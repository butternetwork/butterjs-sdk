import { ethers } from 'ethers';
import axios from 'axios';
import { BUTTER_SMART_ROUTER_URL } from '../../constants/constants';
import { BaseCurrency } from '../../entities';

export class ButterSmartRouter {
  async getBestRoute(
    fromToken: BaseCurrency,
    toToken: BaseCurrency,
    amountIn: string
  ): Promise<string> {
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
    let routeStr = '';
    await axios.get(requestUrl).then(function (response) {
      routeStr = JSON.stringify(response.data);
    });
    return routeStr;
  }
}
