import {
  BUTTER_ROUTER,
  ChainId,
  ID_TO_CHAIN_ID,
  IS_EVM,
  IS_NEAR,
} from '../../constants';
import {
  getHexAddress,
  validateAndParseAddressByChainId,
  verifyNearAccountId,
} from '../../utils';
import {
  BridgeRequestParam,
  ButterCrossChainRoute,
  ButterRouterParam,
  SwapRequestParam,
} from '../../types';
import { IMapOmnichainService } from '../../libs/interfaces/IMapOmnichainService';
import { createMOSInstance } from '../../libs/utils/mosUtils';
import BUTTER_ROUTER_METADATA from '../../abis/ButterRouter.json';

import {
  ButterTransactionResponse,
  NearAccountState,
} from '../../types/responseTypes';
import {
  assembleButterRouterParamFromRoute,
  assembleCrossChainRouteFromJson,
  assembleEVMSwapDataFromRoute,
  assembleNearSwapMsgFromRoute,
  assembleTargetSwapDataFromRoute,
} from '../../utils/requestUtils';
import { ButterRouter } from '../../libs/butter-router/ButterRouter';
import { DEFAULT_SLIPPAGE } from '../../constants/constants';

export class ButterSwap {
  /**
   * The BridgeToken method is used to bridge token from one chain to another.
   * see {@link BridgeRequestParam} for detail
   * @param token source token, aka token that user provide
   * @param toAddress target chain receiving address
   * @param swapRoute best cross-chain swap route, see {@link ButterCrossChainRoute}
   * @param options of bridging, check {@link SwapOptions} for more details
   * @return ButterTransactionResponse
   */
  async omnichainSwap({
    fromAddress,
    fromToken,
    toAddress,
    toToken,
    amountIn,
    swapRouteStr,
    slippage,
    options,
  }: SwapRequestParam): Promise<ButterTransactionResponse> {
    const toChainId = toToken.chainId;
    const fromChainId = fromToken.chainId;
    // check validity of toAddress according to toChainId
    toAddress = validateAndParseAddressByChainId(toAddress, toChainId);
    // if src chain is evm chain, signer must be provided
    if (IS_EVM(fromToken.chainId) && options.signerOrProvider == undefined) {
      throw new Error(`Signer must be provided for EVM blockchains`);
    }

    // if src chain is near chain, near network provider must be provided
    if (
      ChainId.NEAR_TESTNET == fromToken.chainId &&
      options.nearProvider == undefined
    ) {
      throw new Error(`Network config must be provided for NEAR blockchain`);
    }

    let result: ButterTransactionResponse;

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
    // assemble cross-chain swap route
    if (slippage === undefined) {
      slippage = DEFAULT_SLIPPAGE;
    }
    const route: ButterCrossChainRoute = assembleCrossChainRouteFromJson(
      swapRouteStr,
      slippage
    );

    let swapData = '';
    if (IS_EVM(fromChainId)) {
      swapData = await assembleTargetSwapDataFromRoute(route, toToken);
    }
    // check if source chain needs to do agg-swap
    if (
      route.srcChain != undefined &&
      route.srcChain.length != 0 &&
      route.srcChain[0]!.path.length != 0 &&
      !IS_NEAR(fromChainId)
    ) {
      const routerParam: ButterRouterParam =
        await assembleButterRouterParamFromRoute(
          route,
          amountIn,
          fromChainId,
          toToken,
          toAddress
        );
      const butterRouter: ButterRouter = new ButterRouter(
          BUTTER_ROUTER(fromChainId),
        // BUTTER_ROUTER_ADDRESS_SET[ID_TO_CHAIN_ID()],
        BUTTER_ROUTER_METADATA.abi,
        options.signerOrProvider!
      );

      result = await butterRouter.entrance(
        fromAddress,
        routerParam.coreSwapData,
        routerParam.targetSwapData,
        routerParam.amount,
        routerParam.toChainId,
        routerParam.toAddress,
        fromToken.isNative,
        {
          gas: options.gas,
        }
      );

      return result;
    }

    if (IS_NEAR(fromChainId)) {
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

  async gasEstimateSwap({
    fromAddress,
    fromToken,
    toAddress,
    toToken,
    amountIn,
    swapRouteStr,
    slippage,
    options,
  }: SwapRequestParam): Promise<string> {
    const toChainId = toToken.chainId;
    const fromChainId = fromToken.chainId;
    // check validity of toAddress according to toChainId
    toAddress = validateAndParseAddressByChainId(toAddress, toChainId);
    // if src chain is evm chain, signer must be provided
    if (IS_EVM(fromToken.chainId) && options.signerOrProvider == undefined) {
      throw new Error(`provider must be provided`);
    }
    // if src chain is near chain, near network provider must be provided
    if (
      ChainId.NEAR_TESTNET == fromToken.chainId &&
      options.nearProvider == undefined
    ) {
      throw new Error(`Network config must be provided for NEAR blockchain`);
    }

    // assemble cross-chain swap route
    const route: ButterCrossChainRoute = assembleCrossChainRouteFromJson(
      swapRouteStr,
      DEFAULT_SLIPPAGE
    );
    let swapData = '';
    // if (IS_NEAR(fromChainId)) {
    //   swapData = assembleNearSwapMsgFromRoute(
    //     route,
    //     fromToken,
    //     toToken,
    //     toAddress
    //   );
    //   return 'not supported near estimate';
    // }
    if (IS_EVM(fromChainId)) {
      swapData = await assembleTargetSwapDataFromRoute(route, toToken);
    }

    if (IS_NEAR(toChainId)) {
      toAddress = getHexAddress(toAddress, toChainId, false);
    }
    let gas;

    // check if source chain needs to do agg-swap
    if (
      route.srcChain != undefined &&
      route.srcChain.length != 0 &&
      route.srcChain[0]!.path.length != 0 &&
      !IS_NEAR(fromChainId)
    ) {
      const routerParam: ButterRouterParam =
        await assembleButterRouterParamFromRoute(
          route,
          amountIn,
          fromChainId,
          toToken,
          toAddress
        );
      const butterRouter: ButterRouter = new ButterRouter(
          BUTTER_ROUTER(fromChainId),
          // BUTTER_ROUTER_ADDRESS_SET[ID_TO_CHAIN_ID(fromChainId)],
        BUTTER_ROUTER_METADATA.abi,
        options.signerOrProvider!
      );
      gas = await butterRouter.gasEstimateEntrance(
        fromAddress,
        routerParam.coreSwapData,
        routerParam.targetSwapData,
        routerParam.amount,
        routerParam.toChainId,
        routerParam.toAddress,
        fromToken.isNative
      );

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
