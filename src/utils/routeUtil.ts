import { BaseCurrency } from '../entities';
import {
  BSC_MAINNET_USDC,
  BSC_TEST_BMOS,
  BSC_TEST_NATIVE,
  BSC_TEST_USDC,
  ChainId,
  ETH_GOERLI_NATIVE,
  ETH_GOERLI_USDC,
  MAP_TEST_USDC,
  NEAR_MAINNET_USDC,
  NEAR_TEST_NATIVE,
  NEAR_TEST_USDC,
  POLYGON_MAINNET_USDC,
  POLYGON_TEST_BMOS,
  POLYGON_TEST_NATIVE,
  POLYGON_TEST_USDC,
} from '../constants';
import { ButterCrossChainRoute } from '../types';

export const ID_TO_ROUTER_MAP = (id: string): Map<string, number> => {
  switch (id) {
    case ChainId.MAP_MAINNET:
      return new Map<string, number>([]);
    case ChainId.BSC_MAINNET:
      return new Map<string, number>([]);
    case ChainId.POLYGON_MAINNET:
      return new Map<string, number>([]);
    case ChainId.NEAR_MAINNET:
      return new Map<string, number>([]);
    case ChainId.MAP_TEST:
      return new Map<string, number>([]);
    case ChainId.ETH_GOERLI:
      return new Map<string, number>([['UniswapV2', 0]]);
    case ChainId.NEAR_TESTNET:
      return new Map<string, number>([]);
    case ChainId.BSC_TEST:
      return new Map<string, number>([['Pancakeswap', 0]]);
    case ChainId.POLYGON_TEST:
      return new Map<string, number>([['Quickswap', 0]]);
    default:
      throw new Error(`ID_TO_ROUTER_MAP: unknown chain id : ${id}`);
  }
};

export function getRouterIndexByChainIdAndDexName(
  chainId: string,
  dexName: string
): number | undefined {
  return ID_TO_ROUTER_MAP(chainId).get(dexName);
}

export function assembleBridgeRoute(routeStr: string): string {
  let route: any = JSON.parse(routeStr);

  const srcChainLastRoute = route.srcChain[route.srcChain.length - 1];
  let srcChainTokenOut = srcChainLastRoute.tokenOut;

  const targetChainFirstRoute = route.targetChain[0];
  let targetChainTokenIn = targetChainFirstRoute.tokenIn;

  const mapChainFirstRoute = route.mapChain[route.mapChain.length - 1];
  const mapChainLastRoute = route.mapChain[0];

  const mapChainTokenIn = mapChainFirstRoute.tokenIn;
  const mapChainTokenOut = mapChainLastRoute.tokenOut;
  let bridgeInfo: any = {};

  bridgeInfo.bridgeIn = {
    tokenIn: srcChainTokenOut,
    tokenOut: mapChainTokenIn,
    amount: srcChainLastRoute.amountOut,
  };

  bridgeInfo.bridgeOut = {
    tokenIn: mapChainTokenOut,
    tokenOut: targetChainTokenIn,
    amount: targetChainFirstRoute.amountIn,
  };

  return JSON.stringify(bridgeInfo);
}
