import { ButterCrossChainRoute, ButterSwapRoute } from '../types';
import { BigNumber } from 'ethers';
import { BaseCurrency } from '../entities';

export function getTotalAmountOut(
  routes: ButterSwapRoute[],
  token: BaseCurrency
): BigNumber {
  if (routes === undefined || routes.length === 0) {
    throw new Error('route is undefined or empty');
  }

  let totalAmountOut = BigNumber.from(0);

  for (let i = 0; i < routes.length; i++) {
    const route = routes[i];
    if (route != undefined && token.address === route.tokenOut.address) {
      totalAmountOut = totalAmountOut.add(BigNumber.from(route.amountOut));
    }
  }

  return totalAmountOut;
}

export function isGreaterThanRequiredAmount(
  routes: ButterSwapRoute[],
  requiredToken: BaseCurrency,
  requiredAmount: string
): boolean {
  const actualAmount = getTotalAmountOut(routes, requiredToken);
  console.log(
    'actual' + actualAmount.toString() + ' required ' + requiredAmount
  );
  return !actualAmount.lt(BigNumber.from(requiredAmount));
}
