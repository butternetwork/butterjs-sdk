import {
  CHAIN_ID
} from '../constants';

export const ID_TO_ROUTER_MAP = (id: string): Map<string, number> => {
  switch (id) {
    case CHAIN_ID.MAP_MAINNET:
      return new Map<string, number>([]);
    case CHAIN_ID.BNB_MAINNET:
      return new Map<string, number>([]);
    case CHAIN_ID.POLYGON_MAINNET:
      return new Map<string, number>([]);
    case CHAIN_ID.NEAR_MAINNET:
      return new Map<string, number>([]);
    case CHAIN_ID.MAP_TEST:
      return new Map<string, number>([]);
    case CHAIN_ID.ETH_GOERLI:
      return new Map<string, number>([['UniswapV2', 0]]);
    case CHAIN_ID.NEAR_TEST:
      return new Map<string, number>([]);
    case CHAIN_ID.BNB_TEST:
      return new Map<string, number>([['Pancakeswap', 0]]);
    case CHAIN_ID.POLYGON_TEST:
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

  const mapChainFirstRoute = route.mapChain[route.mapChain.length - 1];
  const mapChainLastRoute = route.mapChain[0];

  const mapChainTokenIn = mapChainFirstRoute.tokenIn;
  const mapChainTokenOut = mapChainLastRoute.tokenOut;

  let bridgeInfo: any = {};
  if (route.srcChain != undefined) {
    const srcChainLastRoute = route.srcChain[route.srcChain.length - 1];
    let srcChainTokenOut = srcChainLastRoute.tokenOut;
    bridgeInfo.bridgeIn = {
      tokenIn: srcChainTokenOut,
      tokenOut: mapChainTokenIn,
      amount: srcChainLastRoute.amountOut,
    };
  }

  if (route.targetChain != undefined) {
    const targetChainFirstRoute = route.targetChain[0];
    let targetChainTokenIn = targetChainFirstRoute.tokenIn;

    bridgeInfo.bridgeOut = {
      tokenIn: mapChainTokenOut,
      tokenOut: targetChainTokenIn,
      amount: targetChainFirstRoute.amountIn,
    };
  }
  return JSON.stringify(bridgeInfo);
}
