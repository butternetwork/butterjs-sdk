import {
    ButterCoreParam,
    ButterCrossChainRoute,
    ButterPath,
    ButterRouterParam,
    ButterSwapRoute,
} from '../types';
import {ethers} from 'ethers';
import {
    BUTTER_ROUTER,
    IS_EVM,
    IS_NEAR,
} from '../constants';
import {asciiToHex, getHexAddress, hexToDecimalArray} from './addressUtil';
import {NEAR_TOKEN_SEPARATOR} from '../constants/constants';
import {getRouterIndexByChainIdAndDexName} from './routeUtil';
import {Currency} from "../beans";

const abi = ethers.utils.defaultAbiCoder;

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
    const butterRouterAddress = BUTTER_ROUTER(fromChainId);
    // BUTTER_ROUTER_ADDRESS_SET[ID_TO_CHAIN_ID(fromChainId)];
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
    const srcRoute: ButterSwapRoute[] = route.srcChain;

    let amountInArr: string[] = [];
    let paramsArr: string[] = [];
    let routerIndexArr: string[] = [];
    for (let swapRoute of srcRoute) {
        amountInArr.push(swapRoute.amountIn);

        const routerIndex = getRouterIndexByChainIdAndDexName(
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

        const routerIndex = getRouterIndexByChainIdAndDexName(
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
    let swapParamArray: any[] = [];
    for (let route of routes) {
        let swapParam: any = {};
        swapParam.amount_in = route.amountIn;
        swapParam.min_amount_out = route.amountOut;
        const routerIndex = getRouterIndexByChainIdAndDexName(
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
