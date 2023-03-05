import {BUTTER_ROUTER, DEFAULT_SLIPPAGE, IS_EVM, IS_NEAR} from '../../constants';
import {
    assembleButterRouterParamFromRoute,
    assembleCrossChainRouteFromJson,
    assembleNearSwapMsgFromRoute,
    assembleTargetSwapDataFromRoute,
    createVLog,
    getHexAddress,
    validateAndParseAddressByChainId,
    verifyNearAccountId,
} from '../../utils';
import {
    ButterCrossChainRoute,
    ButterRouterParam,
    ButterTransactionResponse,
    NearAccountState,
    SwapRequestParam,
} from '../../types';
import {IMapOmnichainService} from '../../libs/interfaces/IMapOmnichainService';
import {createMOSInstance} from '../../libs/utils/mosUtils';
import BUTTER_ROUTER_METADATA from '../../abis/ButterRouter.json';
// import {ButterRouter} from '../../libs/butter-router/ButterRouter';
import {ButterRouter as ButterRouterV2} from '../../libs/router/ButterRouter';

const vlog = createVLog('ButterSmartSwap');
export class ButterSmartSwap {

    _checkParams(params: SwapRequestParam) {
        vlog('_checkParams',params);
        let {fromToken, options} = params;
        const fromChainId = fromToken.chainId;
        if (IS_EVM(fromChainId)) {
            if (options.signerOrProvider == undefined) {
                // if src chain is evm chain, signer must be provided
                throw new Error(`[ButterSmartSwap] Signer must be provided for EVM blockchains`);
            }
        }

        // if src chain is near chain, near network provider must be provided
        if (IS_NEAR(fromChainId)) {
            if ( options.nearProvider == undefined){
                throw new Error(`[ButterSmartSwap] Network config must be provided for NEAR blockchain`);
            }
        }
    }

    async swap(params: SwapRequestParam): Promise<ButterTransactionResponse> {
        vlog('swap',params);
        this._checkParams(params);
        let {
            fromAddress, fromToken, toAddress, toToken,
            amountIn, swapRouteStr, slippage, options
        } = params;
        const toChainId = toToken.chainId;
        const fromChainId = fromToken.chainId;
        toAddress = validateAndParseAddressByChainId(toAddress, toChainId);
        let result: ButterTransactionResponse;
        // assemble cross-chain swap route
        if (slippage === undefined) {
            slippage = DEFAULT_SLIPPAGE;
        }
        const route: ButterCrossChainRoute = assembleCrossChainRouteFromJson(swapRouteStr, slippage);
        let swapData = '';
        // convert near address to hex
        if (IS_NEAR(toChainId)) {
            const accountState: NearAccountState = await verifyNearAccountId(
                toAddress,
                toChainId
            );
            if (!accountState.isValid) {
                throw new Error(accountState.errMsg);
            }
            toAddress = getHexAddress(toAddress, toChainId, false);
        }
        if (IS_EVM(fromChainId)) {
            swapData = await assembleTargetSwapDataFromRoute(route, toToken);
        }
        let fromChainIsNear = IS_NEAR(fromChainId);
        // check if source chain needs to do agg-swap
        if (!fromChainIsNear) {
            if (!route.srcChain
                || route.srcChain.length == 0) {
                route.srcChain = [
                    {
                        chainId: fromChainId,
                        amountIn: amountIn,
                        amountOut: '',
                        path: [],
                        dexName: '',
                        tokenIn: fromToken,
                        tokenOut: fromToken
                    }
                ]
            }
            const routerParam: ButterRouterParam = await assembleButterRouterParamFromRoute(
                route, amountIn, fromChainId, toToken, toAddress);
            const router: ButterRouterV2 = ButterRouterV2.from({
                contract: BUTTER_ROUTER(fromChainId),
                abi: BUTTER_ROUTER_METADATA.abi,
                signerOrProvider: options.signerOrProvider!
            });
            result = await router.entrance(
                fromAddress,
                routerParam.toAddress,
                routerParam.amount,
                routerParam.toChainId,
                routerParam.coreSwapData,
                routerParam.targetSwapData,
                {
                    isNative: fromToken.isNative,
                    gas: options.gas,
                }
            );

            return result;
        }

        if (fromChainIsNear) {
            swapData = assembleNearSwapMsgFromRoute(
                route,
                fromToken,
                toToken,
                toAddress
            );
        }
        // create mos instance base on src token chainId.
        const mos: IMapOmnichainService = createMOSInstance(
            fromToken.chainId,
            options
        );

        if (fromToken.isNative) {
            // if input token is Native coin, call transferOutNative method
            result = await mos.doSwapOutNative(
                fromAddress,
                toAddress,
                toChainId.toString(),
                amountIn,
                swapData,
                {
                    gas: options.gas,
                }
            );
        } else {
            result = await mos.doSwapOutToken(
                fromAddress,
                fromToken.address,
                amountIn,
                toAddress,
                toChainId.toString(),
                swapData,
                {
                    gas: options.gas,
                }
            );
        }
        return result;
    }

    async estimateGas(params: SwapRequestParam): Promise<string> {
        vlog('estimateGas','params',params);
        this._checkParams(params);
        let {
            fromAddress, fromToken, toAddress, toToken,
            amountIn, swapRouteStr, slippage, options
        } = params;
        const toChainId = toToken.chainId;
        const fromChainId = fromToken.chainId;
        // check validity of toAddress according to toChainId
        toAddress = validateAndParseAddressByChainId(toAddress, toChainId);
        const route: ButterCrossChainRoute = assembleCrossChainRouteFromJson(swapRouteStr, DEFAULT_SLIPPAGE);
        vlog('estimateGas','route',route);
        let swapData = '';
        if (IS_EVM(fromChainId)) {
            swapData = await assembleTargetSwapDataFromRoute(route, toToken);
        }
        if (IS_NEAR(toChainId)) {
            toAddress = getHexAddress(toAddress, toChainId, false);
        }

        let gas;

        // check if source chain needs to do agg-swap
        if (!IS_NEAR(fromChainId)) {
            if (!route.srcChain || route.srcChain.length == 0) {
                route.srcChain = [
                    {
                        chainId: fromChainId,
                        amountIn: amountIn,
                        amountOut: '',
                        path: [],
                        dexName: '',
                        tokenIn: fromToken,
                        tokenOut: fromToken
                    }
                ]
            }
            const routerParam: ButterRouterParam =
                await assembleButterRouterParamFromRoute(
                    route,
                    amountIn,
                    fromChainId,
                    toToken,
                    toAddress
                );
            const router: ButterRouterV2 = ButterRouterV2.from({
                contract: BUTTER_ROUTER(fromChainId),
                abi: BUTTER_ROUTER_METADATA.abi,
                signerOrProvider: options.signerOrProvider!
            });
            let gas = await router.estimateGas(fromAddress, routerParam.toAddress, routerParam.amount, routerParam.toChainId,
                routerParam.coreSwapData, routerParam.targetSwapData, {
                    isNative: fromToken.isNative
                }
            )

            return gas;
        }

        // if no swap, direct call mos swap method
        const mos: IMapOmnichainService = createMOSInstance(
            fromToken.chainId,
            options
        );

        if (IS_NEAR(toChainId)) {
            toAddress = getHexAddress(toAddress, toChainId, false);
        }

        // if input token is Native coin, call transferOutNative method
        if (fromToken.isNative) {
            gas = await mos.gasEstimateSwapOutNative(
                fromAddress,
                toAddress,
                toChainId.toString(),
                amountIn,
                swapData
            );
        } else {
            console.log({
                fromAddress,
                fromTokenAddress: fromToken.address,
                amountIn,
                toAddress,
                toChainId: toChainId.toString(),
                swapData
            }, 'butter sdk gasEstimateSwapOutToken params')
            gas = await mos.gasEstimateSwapOutToken(
                fromAddress,
                fromToken.address,
                amountIn,
                toAddress,
                toChainId.toString(),
                swapData
            );
        }

        return gas;
    }

}