import {CHAIN_ID,} from '../constants';
import {createVLog} from "./common";

const vlog = createVLog('RouteUtil')

const ROUTE_MAP = (chainId: string | CHAIN_ID): any[] => {
    vlog('ROUTER_MAP',chainId);
    switch (chainId) {
        case CHAIN_ID.MAP_MAINNET:
            return [];
        case CHAIN_ID.BNB_MAINNET:
            return [];
        case CHAIN_ID.POLYGON_MAINNET:
            return [];
        case CHAIN_ID.NEAR_MAINNET:
            return [];
        case CHAIN_ID.MAP_TEST:
            return [];
        case CHAIN_ID.ETH_GOERLI:
            return [['UniswapV2', 0]];
        case CHAIN_ID.BNB_TEST:
            return [['Pancakeswap', 0]];
        case CHAIN_ID.POLYGON_TEST:
            return [['Quickswap', 0]];
        case CHAIN_ID.NEAR_TEST:
            return [];
        default:
            throw new Error(`ROUTER_MAP: unknown chain id : ${chainId}`);
    }
};

export function getRouterIndex(chainId: string | CHAIN_ID,dexName:string): number | undefined {
    vlog('getRouterIndex',chainId,dexName);
    let map = ROUTE_MAP(chainId);
    if (map.length>0){
        if (!dexName){
            return map[0][1];
        }else {
            for (const mapElement of map) {
                if (mapElement[0]===dexName){
                    return mapElement[1];
                }
            }
        }
    }
    return undefined;
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
