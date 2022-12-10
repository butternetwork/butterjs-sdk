import {
  ButterCoreParam,
  ButterCrossChainRoute,
  ButterPath,
  ButterRouterParam,
  ButterSwapRoute,
} from '../types';
import { BaseCurrency } from '../entities';
import { ethers } from 'ethers';
import { IS_EVM, IS_NEAR } from '../constants';

const abi = ethers.utils.defaultAbiCoder;

/**
struct AccessParams {
  uint256[]  amountInArr;
  bytes[]    paramsArr;
  uint32[]  routerIndex;
  address[2]  inputOutAddre;  // 0 -input  1- Out
}
**/
export async function assembleButterRouterParamFromRoute(
  routes: ButterCrossChainRoute,
  targetChainTokenOut: BaseCurrency
): Promise<ButterRouterParam> {
  let routerParam: ButterRouterParam;
  const targetSwapData = await assembleTargetSwapDataFromRoute(
    routes,
    targetChainTokenOut
  );

  const coreSwapData = await assembleSrcSwapDataFromRoute(routes);
  return routerParam;
}
export async function assembleSrcSwapDataFromRoute(
  route: ButterCrossChainRoute
): Promise<ButterCoreParam> {
  // amountInArr: string[];
  // paramsArr: string[];
  // routerIndex: string[];
  // inAndOutTokenAddr: string[2];
  let coreParam: ButterCoreParam;
  const srcRoute: ButterSwapRoute[] = route.srcChain;

  let amountInArr: string[] = [];
  let paramsArr: string[] = [];
  let routerIndexArr: string[] = [];
  for (let swapRoute of srcRoute) {
    amountInArr.push(
      ethers.utils
        .parseUnits(swapRoute.amountIn, swapRoute.tokenIn.decimals)
        .toString()
    );
    routerIndexArr.push('0');
    const amountIn = swapRoute.amountIn;
    const amountOut = swapRoute.amountOut;

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
    /**
     *         (amountInArr, amountOutMinArr, pathArr, to, deadLines, inputAddre, outAddre) = abi.decode(
     *             exchangeData,
     *             (uint256,
     *             uint256,
     *             bytes,address[]
     *             address,
     *             uint256,
     *             address,
     *             address));
     */
    const coreParamAbi = [
      'uint256',
      'uint256',
      'bytes',
      'address',
      'uint256',
      'address',
      'address',
    ];
    paramsArr.push(
      abi.encode(coreParamAbi, [
        amountIn,
        amountOut,
        abi.encode(['address[]'], tokenAddressArr),
        to,
        (Date.now() + 1000).toString(),
        tokenIn,
        tokenOut,
      ])
    );
  }

  return <ButterCoreParam>{
    amountInArr: amountInArr,
    paramsArr: paramsArr,
    routerIndex: routerIndexArr,
    inAndOutTokenAddr: ['', ''],
  };
}
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
