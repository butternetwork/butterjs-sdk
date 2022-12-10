import { ButterCrossChainRoute, ButterPath, ButterSwapRoute } from '../types';
import { BaseCurrency } from '../entities';
import { ethers } from 'ethers';
import { IS_EVM, IS_NEAR } from '../constants';

export async function assembleTargetSwapDataFromRoute(
  routes: ButterCrossChainRoute,
  targetChainTokenOut: BaseCurrency
): Promise<string> {
  if (IS_EVM(targetChainTokenOut.chainId)) {
    return await assembleEVMSwapDataFromRoute(routes, targetChainTokenOut);
  } else if (IS_NEAR(targetChainTokenOut.chainId)) {
    return '0x00';
  } else {
    throw new Error(`chainId ${targetChainTokenOut.chainId} not supported`);
  }
}

export async function assembleEVMSwapDataFromRoute(
  route: ButterCrossChainRoute,
  targetChainTokenOut: BaseCurrency
): Promise<string> {
  const abi = ethers.utils.defaultAbiCoder;
  const swapDataAbi = [
    'tuple(uint256, uint256, bytes, uint64)[]',
    'bytes',
    'address',
  ];

  const mapRoute = route.mapChain;
  const mapTargetTokenAddress = mapRoute[0]!.tokenOut.address;
  let swapData = [];
  let swapParamArr: any[] = [];

  const targetRoute: ButterSwapRoute[] = route.targetChain;
  for (let swapRoute of targetRoute) {
    let swapParam = [];
    swapParam.push(
      ethers.utils
        .parseUnits(swapRoute.amountIn, swapRoute.tokenIn.decimals)
        .toString()
    );
    swapParam.push(
      ethers.utils
        .parseUnits(swapRoute.amountOut, swapRoute.tokenOut.decimals)
        .toString()
    );
    let tokenAddressArr = [];
    for (let i = 0; i < swapRoute.path.length; i++) {
      const butterPath: ButterPath = swapRoute.path[i]!;
      if (i == 0) {
        tokenAddressArr.push(butterPath.tokenIn.address);
        tokenAddressArr.push(butterPath.tokenOut.address);
      } else {
        tokenAddressArr.push(butterPath.tokenOut.address);
      }
    }
    // console.log('tokenAddressArr', tokenAddressArr);
    swapParam.push(abi.encode(['address[]'], [tokenAddressArr]));
    const routerIndex = '0';
    swapParam.push(routerIndex);
    swapParamArr.push(swapParam);
  }
  swapData.push(swapParamArr);
  swapData.push(targetChainTokenOut.address);
  swapData.push(mapTargetTokenAddress);
  // console.log(swapData);
  return abi.encode(swapDataAbi, swapData);
}

export function assembleCrossChainRouteFromJson(
  jsonStr: string
): ButterCrossChainRoute {
  return JSON.parse(jsonStr) as ButterCrossChainRoute;
}
