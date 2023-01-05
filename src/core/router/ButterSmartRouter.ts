import { BigNumber, ethers } from 'ethers';
import axios from 'axios';
import { BUTTER_SMART_ROUTER_URL } from '../../constants/constants';
import { BaseCurrency } from '../../entities';
import { RouteResponse } from '../../types/responseTypes';
export class ButterSmartRouter {
  async getBestRoute(
    fromToken: BaseCurrency,
    toToken: BaseCurrency,
    amountIn: string
  ): Promise<RouteResponse> {
    const fromChainId = fromToken.chainId;
    const toChainId = toToken.chainId;
    const requestUrl =
      BUTTER_SMART_ROUTER_URL +
      '?' +
      `fromChainId=${fromChainId}&` +
      `toChainId=${toChainId}&` +
      `amountIn=${ethers.utils.formatUnits(amountIn, fromToken.decimals)}&` +
      `tokenInAddress=${fromToken.address}&` +
      `tokenInDecimal=${fromToken.decimals}&` +
      `tokenInSymbol=${fromToken.symbol}&` +
      `tokenOutAddress=${toToken.address}&` +
      `tokenOutDecimal=${toToken.decimals}&` +
      `tokenOutSymbol=${toToken.symbol}`;
    console.log(requestUrl);
    let routeResponse: RouteResponse;
    try {
      await axios.get(requestUrl).then(function (response) {
        const data = response.data;
        if (data.hasOwnProperty('status') && data.hasOwnProperty('error')) {
          routeResponse = {
            status: 200,
            code: 10001,
            msg: 'Insufficient Liquidity',
          };
        } else if (data.hasOwnProperty('mapChain')) {
          const mapAmountOut = data['mapChain'][0]['amountOut'];
          if (parseFloat(mapAmountOut) <= 0) {
            routeResponse = {
              status: 200,
              code: 10002,
              msg: 'Input Amount Less Than Fee',
            };
          } else {
            routeResponse = {
              data: response.data,
              status: response.status,
              code: 10000,
              msg: response.statusText,
            };
          }
        } else {
          routeResponse = {
            status: 500,
            code: 99999,
            msg: 'Internal Server Error',
          };
        }
      });
    } catch (error: any) {
      routeResponse = {
        status: 500,
        code: 99999,
        msg: error.message,
      };
    }
    return routeResponse!;
  }
}
