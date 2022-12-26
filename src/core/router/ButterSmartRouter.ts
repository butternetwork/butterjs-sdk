import { ethers } from 'ethers';
import axios from 'axios';
import { BUTTER_SMART_ROUTER_URL } from '../../constants/constants';
import { BaseCurrency } from '../../entities';
import { RouteResponse } from '../../types/responseTypes';

export async function getBestRoute(
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
          msg: 'insufficient liquidity',
        };
      } else {
        routeResponse = {
          data: response.data,
          status: response.status,
          msg: response.statusText,
        };
      }
    });
  } catch (error: any) {
    routeResponse = {
      status: 500,
      msg: error.message,
    };
  }

  return routeResponse!;
}
