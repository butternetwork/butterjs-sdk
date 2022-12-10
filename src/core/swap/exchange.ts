import { ChainId, IS_EVM, IS_NEAR } from '../../constants';
import {
  getHexAddress,
  validateAndParseAddressByChainId,
  verifyNearAccountId,
} from '../../utils';
import { BridgeRequestParam, SwapRequestParam } from '../../types';
import { IMapOmnichainService } from '../../libs/interfaces/IMapOmnichainService';
import { createMOSInstance } from '../../libs/utils/mosUtils';
import {
  ButterTransactionResponse,
  NearAccountState,
} from '../../types/responseTypes';
import { assembleTargetSwapDataFromRoute } from '../../utils/requestUtils';

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
  async swap({
    fromAddress,
    fromToken,
    toAddress,
    toToken,
    amountIn,
    swapRoute,
    options,
  }: SwapRequestParam): Promise<ButterTransactionResponse> {
    // check validity of toAddress according to toChainId
    const toChainId = toToken.chainId;
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

    const swapData: string = await assembleTargetSwapDataFromRoute(
      swapRoute,
      toToken
    );

    // create mos instance base on src token chainId.
    const mos: IMapOmnichainService = createMOSInstance(
      fromToken.chainId,
      options
    );

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
    swapRoute,
    options,
  }: SwapRequestParam): Promise<string> {
    // check validity of toAddress according to toChainId
    // toAddress = validateAndParseAddressByChainId(toAddress, toChainId);
    const toChainId = toToken.chainId;

    // if src chain is evm chain, signer must be provided
    if (IS_EVM(fromToken.chainId) && options.signerOrProvider == undefined) {
      throw new Error(`Provider must be provided`);
    }

    // near doesn't provide gas estimation yet

    // create mos instance base on src token chainId.
    const mos: IMapOmnichainService = createMOSInstance(
      fromToken.chainId,
      options
    );

    const swapData: string = await assembleTargetSwapDataFromRoute(
      swapRoute,
      toToken
    );

    if (IS_NEAR(toChainId)) {
      // no need to check address validity for gas estimation
      // const accountState: NearAccountState = await verifyNearAccountId(
      //   toAddress,
      //   toChainId
      // );
      // if (!accountState.isValid) {
      //   throw new Error(accountState.errMsg);
      // }

      toAddress = getHexAddress(toAddress, toChainId, false);
    }

    let gas;
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
