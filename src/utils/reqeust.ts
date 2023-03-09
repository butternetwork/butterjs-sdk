import {Contract} from "web3-eth-contract";
import {Method} from "web3-core-method";
import Web3 from "web3";
import BN from "bn.js";
import {ethers} from "ethers";
import {ButterCoreParam, ButterCrossChainRoute, ButterPath, ButterRouterParam, ButterSwapRoute} from "../types";
import {Currency} from "../beans";
import {getRouterIndex} from "./route";
import {asciiToHex, getHexAddress} from "./common";
import {BUTTER_ROUTER, IS_EVM, IS_NEAR, NEAR_TOKEN_SEPARATOR} from "../constants";

const abi = ethers.utils.defaultAbiCoder;

const makeBatchRequest = (calls: any[], maprpc: string) => {
    const web3 = new Web3(maprpc);
    const batch = new web3.BatchRequest();

    const promises = calls.map((call: Method) => {
        return new Promise((resolve: any, reject: any) => {
            // @ts-ignore
            const req = call.request({}, (err, data: string) => {
                if (err) reject(err);
                else resolve(data);
            });
            batch.add(req);
        });
    });
    batch.execute();
    return Promise.all(promises);
}

/**
 * get relay chain token in batch to improve speed
 * @param contract
 * @param chainId fromChainId
 * @param addresses tokenAddress[]
 * @param maprpc
 */
export const getRelayChainToken = async (contract: Contract,
                                         chainId: string,
                                         addresses: string[],
                                         maprpc: string) => {
    const calls: any[] = [];

    for (let i = 0; i < addresses.length; i++) {
        calls.push(
            contract.methods.getRelayChainToken(chainId, addresses[i]).call
        );
    }
    return await makeBatchRequest(calls, maprpc);
}
/**
 * get relay chain token in batch to improve speed
 * @param contract
 * @param chainId toChainId
 * @param addresses tokenAddress[]
 * @param maprpc
 */
export const getToChainToken = async (contract: Contract,
                                      chainId: string,
                                      addresses: string[],
                                      maprpc: string) => {
    const calls: any[] = [];
    for (let i = 0; i < addresses.length; i++) {
        const tokenAddress = addresses[i];
        calls.push(
            contract.methods.getToChainToken(tokenAddress, new BN(chainId, 10)).call
        );
    }
    return await makeBatchRequest(calls, maprpc);
}

export async function assembleButterRouterParamFromRoute(
    routes: ButterCrossChainRoute,
    amount: string,
    fromChainId: string,
    targetChainTokenOut: Currency,
    toAddress: string
): Promise<ButterRouterParam> {
    const targetSwapData = await assembleTargetSwapDataFromRoute(
        routes,
        targetChainTokenOut
    );
    const tokenIn = routes.srcChain[0]!.tokenIn;
    const tokenOut = routes.srcChain[0]!.tokenOut;
    const butterRouterAddress =
        BUTTER_ROUTER(fromChainId);
    const coreSwapData = await assembleSrcSwapDataFromRoute(
        routes,
        tokenIn.address,
        tokenOut.address,
        butterRouterAddress
    );

    const toChainId = targetChainTokenOut.chainId;
    return <ButterRouterParam>{
        coreSwapData: coreSwapData,
        targetSwapData: targetSwapData,
        amount: amount,
        toChainId: toChainId,
        toAddress: toAddress,
    };
}

export async function assembleSrcSwapDataFromRoute(
    route: ButterCrossChainRoute,
    tokenIn: string,
    tokenOut: string,
    toAddress: string
): Promise<ButterCoreParam> {
    console.log('assembleSrcSwapDataFromRoute', {route, tokenIn, tokenOut});
    const srcRoute: ButterSwapRoute[] = route.srcChain;
    try {
        let route0 = srcRoute[0];
        if (route0?.tokenIn.address === route0?.tokenOut.address) {
            return <ButterCoreParam>{
                amountInArr: [],
                paramsArr: [],
                routerIndex: [],
                inputOutAddre: [route0?.tokenIn.address, route0?.tokenOut.address],
            };
        }
    } catch (e) {
    }
    let amountInArr: string[] = [];
    let paramsArr: string[] = [];
    let routerIndexArr: string[] = [];
    for (let swapRoute of srcRoute) {
        amountInArr.push(swapRoute.amountIn);

        const routerIndex = getRouterIndex(
            swapRoute.chainId,
            swapRoute.dexName
        );
        if (routerIndex === undefined) {
            throw new Error('assembleSrcSwapDataFromRoute: routerIndex is undefined');
        }
        routerIndexArr.push(routerIndex.toString());

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
         struct AccessParams {
  uint256[]  amountInArr;
  bytes[]    paramsArr;
  uint32[]  routerIndex;
  address[2]  inputOutAddre;  // 0 -input  1- Out
}
         **/

        const coreParamAbi = [
            'uint256',
            'uint256',
            'address[]',
            'address',
            'uint256',
            'address',
            'address',
        ];
        paramsArr.push(
            abi.encode(coreParamAbi, [
                amountIn,
                amountOut,
                tokenAddressArr,
                toAddress,
                (Math.floor(Date.now() / 1000) + 1000).toString(),
                tokenIn,
                tokenOut,
            ])
        );
    }

    return <ButterCoreParam>{
        amountInArr: amountInArr,
        paramsArr: paramsArr,
        routerIndex: routerIndexArr,
        inputOutAddre: [tokenIn, tokenOut],
    };
}

export async function assembleTargetSwapDataFromRoute(
    routes: ButterCrossChainRoute,
    targetChainTokenOut: Currency,
    toAddress?: string
): Promise<string> {
    if (IS_EVM(targetChainTokenOut.chainId)) {
        return await assembleEVMSwapDataFromRoute(routes, targetChainTokenOut);
    } else if (IS_NEAR(targetChainTokenOut.chainId)) {
        return assembleNearSwapDataFromRoute(routes, targetChainTokenOut);
    } else {
        throw new Error(`chainId ${targetChainTokenOut.chainId} not supported`);
    }
}

const swapDataAbi = [
    'tuple(uint256, uint256, bytes, uint64)[]',
    'bytes',
    'address',
];

export async function assembleEVMSwapDataFromRoute(
    route: ButterCrossChainRoute,
    targetChainTokenOut: Currency
): Promise<string> {
    const mapRoute = route.mapChain;
    const mapTargetTokenAddress = mapRoute[0]!.tokenOut.address;
    let swapData = [];
    let swapParamArr: any[] = [];

    const targetRoute: ButterSwapRoute[] = route.targetChain;
    if (
        targetRoute === undefined ||
        targetRoute.length === 0 ||
        targetRoute[0]!.path === undefined ||
        targetRoute[0]!.path.length === 0
    ) {
        swapData.push([]);
        swapData.push(targetChainTokenOut.address);
        swapData.push(mapTargetTokenAddress);
        return abi.encode(swapDataAbi, swapData);
    }
    for (let swapRoute of targetRoute) {
        let swapParam = [];
        swapParam.push(swapRoute.amountIn);
        swapParam.push(swapRoute.amountOut);
        const toChainId = swapRoute.chainId;

        let tokenAddressArr = [];
        for (let i = 0; i < swapRoute.path.length; i++) {
            const butterPath: ButterPath = swapRoute.path[i]!;
            if (i == 0) {
                tokenAddressArr.push(
                    getHexAddress(butterPath.tokenIn.address, toChainId, false)
                );
                tokenAddressArr.push(
                    getHexAddress(butterPath.tokenOut.address, toChainId, false)
                );
            } else {
                tokenAddressArr.push(
                    getHexAddress(butterPath.tokenOut.address, toChainId, false)
                );
            }
        }

        // console.log('tokenAddressArr', tokenAddressArr);
        swapParam.push(abi.encode(['address[]'], [tokenAddressArr]));

        const routerIndex = getRouterIndex(
            swapRoute.chainId,
            swapRoute.dexName
        );
        if (routerIndex === undefined) {
            throw new Error('assembleSrcSwapDataFromRoute: routerIndex is undefined');
        }

        swapParam.push(routerIndex.toString());
        swapParamArr.push(swapParam);
    }
    swapData.push(swapParamArr);
    swapData.push(targetChainTokenOut.address);
    swapData.push(mapTargetTokenAddress);
    console.log('swap Data', swapData);
    return abi.encode(swapDataAbi, swapData);
}

export function assembleCrossChainRouteFromJson(
    jsonStr: string,
    slippage: number
): ButterCrossChainRoute {
    let route: ButterCrossChainRoute = JSON.parse(
        jsonStr
    ) as ButterCrossChainRoute;

    if (route.srcChain != undefined) {
        for (let swapRoute of route.srcChain) {
            swapRoute.amountIn = ethers.utils
                .parseUnits(swapRoute.amountIn, swapRoute.tokenIn.decimals)
                .toString();
            swapRoute.amountOut = ethers.utils
                .parseUnits(swapRoute.amountOut, swapRoute.tokenOut.decimals)
                .mul(10000 - slippage)
                .div(10000)
                .toString();
        }
    }
    for (let swapRoute of route.mapChain) {
        swapRoute.amountIn = ethers.utils
            .parseUnits(swapRoute.amountIn, swapRoute.tokenIn.decimals)
            .toString();
        swapRoute.amountOut = ethers.utils
            .parseUnits(swapRoute.amountOut, swapRoute.tokenIn.decimals)
            .toString();
    }
    if (route.targetChain != undefined) {
        for (let swapRoute of route.targetChain) {
            swapRoute.amountIn = ethers.utils
                .parseUnits(swapRoute.amountIn, swapRoute.tokenIn.decimals)
                .toString();
            swapRoute.amountOut = ethers.utils
                .parseUnits(swapRoute.amountOut, swapRoute.tokenOut.decimals)
                .mul(10000 - slippage)
                .div(10000)
                .toString();
            // swapRoute.amountOut = '0';
        }
    }
    return route;
}

export function assembleNearSwapDataFromRoute(
    routes: ButterCrossChainRoute,
    targetChainTokenOut: Currency
) {
    const mapRoute = routes.mapChain;
    const mapTargetTokenAddress = mapRoute[0]!.tokenOut.address;
    let swapData = [];
    let swapParamArr: any[] = [];

    const targetRoute: ButterSwapRoute[] = routes.targetChain;
    if (
        targetRoute === undefined ||
        targetRoute.length === 0 ||
        targetRoute[0]!.path === undefined ||
        targetRoute[0]!.path.length === 0
    ) {
        swapData.push([]);
        swapData.push(asciiToHex(targetChainTokenOut.address, false));
        swapData.push(mapTargetTokenAddress);
        return abi.encode(swapDataAbi, swapData);
    }

    for (let swapRoute of targetRoute) {
        let swapParam = [];
        for (let i = 0; i < swapRoute.path.length; i++) {
            const butterPath: ButterPath = swapRoute.path[i]!;
            const path =
                butterPath.tokenIn.address +
                NEAR_TOKEN_SEPARATOR +
                butterPath.tokenOut.address;
            const amountIn = 0;
            const minAmountOut =
                i === swapRoute.path.length - 1 ? swapRoute.amountOut : '0';
            const routerIndex = butterPath.id;

            swapParam.push(amountIn);
            swapParam.push(minAmountOut);
            swapParam.push(asciiToHex(path, false));
            swapParam.push(routerIndex);
        }
        swapParamArr.push(swapParam);
    }
    swapData.push(swapParamArr);
    swapData.push(
        asciiToHex(
            targetChainTokenOut.isNative
                ? targetChainTokenOut.wrapped.address
                : targetChainTokenOut.address,
            false
        )
    );
    swapData.push(mapTargetTokenAddress);
    return abi.encode(swapDataAbi, swapData);
}

export function assembleNearSwapMsgFromRoute(
    routes: ButterCrossChainRoute,
    fromToken: Currency,
    targetChainTokenOut: Currency,
    toAddress: string
): string {
    const toChainId = targetChainTokenOut.chainId;
    // assemble near source swap
    let srcSwap = assembleNearSwapParamArrayFromRoutes(routes.srcChain);

    const targetSwapData: any = {
        target_token: targetChainTokenOut.address,
        map_target_token: routes.mapChain[0]!.tokenOut.address,
    };

    targetSwapData.swap_param = assembleNearVersionTargetSwapParamArrayFromRoutes(
        routes.targetChain
    );

    const swapInfo = {
        src_swap: srcSwap,
        dst_swap: targetSwapData,
    };

    console.log('dst_swap', targetSwapData);

    if (fromToken.isNative) {
        return JSON.stringify(swapInfo);
    }

    let msg = {
        type: 'Swap',
        to: toAddress,
        to_chain: toChainId,
        swap_info: swapInfo,
    };
    return JSON.stringify(msg);
}

export function assembleNearSwapParamArrayFromRoutes(
    routes: ButterSwapRoute[]
): any[] {
    let swapParamArray: any[] = [];
    for (let route of routes) {
        for (let i = 0; i < route.path.length; i++) {
            const path = route.path[i]!;
            swapParamArray.push({
                amount_in: '0',
                min_amount_out: i === route.path.length - 1 ? route.amountOut : '0',
                path: asciiToHex(
                    path.tokenIn.address + NEAR_TOKEN_SEPARATOR + path.tokenOut.address,
                    false
                ),
                router_index: path.id,
            });
        }
    }

    return swapParamArray;
}

export function assembleNearVersionTargetSwapParamArrayFromRoutes(
    routes: ButterSwapRoute[]
): any[] {
    console.log('assembleNearVersionTargetSwapParamArrayFromRoutes', routes)
    let swapParamArray: any[] = [];
    for (let route of routes) {
        if (!route.path || route.path.length===0){
            continue;
        }
        let swapParam: any = {};
        swapParam.amount_in = route.amountIn;
        swapParam.min_amount_out = route.amountOut;
        let routerIndex = getRouterIndex(
            route.chainId,
            route.dexName
        );

        if (routerIndex === undefined) {
            throw new Error('assembleSrcSwapDataFromRoute: routerIndex is undefined');
        }
        swapParam.router_index = routerIndex.toString();
        let tokenArr: string[] = [];
        for (let i = 0; i < route.path.length; i++) {
            const path: ButterPath = route.path[i]!;
            if (i == 0) {
                tokenArr.push(path.tokenIn.address);
                tokenArr.push(path.tokenOut.address);
            } else {
                tokenArr.push(path.tokenOut.address);
            }
        }
        swapParam.path = abi.encode(['address[]'], [tokenArr]);
        swapParamArray.push(swapParam);
    }
    return swapParamArray;
}
