import { ChainId, IS_EVM, IS_NEAR } from '../../constants/chains';
import {
  getHexAddress,
  validateAndParseAddressByChainId,
  verifyNearAccountId,
} from '../../utils';
import { BridgeRequestParam } from '../../types/requestTypes';
import { IMapCrossChainService } from '../../libs/interfaces/IMapCrossChainService';
import { createMCSInstance } from '../../libs/utils/mcsUtils';
import {
  ButterTransactionReceipt,
  ButterTransactionResponse,
  NearAccountState,
} from '../../types/responseTypes';
import BN from 'bn.js';
import { hexlify } from 'ethers/lib/utils';

export class ButterBridge {
  /**
   * The BridgeToken method is used to bridge token from one chain to another.
   * see {@link BridgeRequestParam} for detail
   * @param token source token, aka token that user provide
   * @param toChainId target chain id
   * @param toAddress target chain receiving address
   * @param amount amount to bridge, in minimal uint. For example wei in Ethereum, yocto in Near
   * @param options of bridging, check {@link BridgeOptions} for more details
   * @return BN for gas estimation, ContractCallReceipt for actual contract invocation
   */
  async bridgeToken({
    fromAddress,
    fromToken,
    toChainId,
    toAddress,
    amount,
    options,
  }: BridgeRequestParam): Promise<ButterTransactionResponse> {
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

    // create mcs instance base on src token chainId.
    const mcs: IMapCrossChainService = createMCSInstance(
      fromToken.chainId,
      options
    );

    let result;

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
      result = await mcs.doTransferOutNative(
        fromAddress,
        toAddress,
        toChainId.toString(),
        amount,
        {
          gas: options.gas,
        }
      );
    } else {
      result = await mcs.doTransferOutToken(
        fromAddress,
        fromToken.address,
        amount,
        toAddress,
        toChainId.toString(),
        {
          gas: options.gas,
        }
      );
    }

    return result;
  }

  async gasEstimateBridgeToken({
    fromAddress,
    fromToken,
    toChainId,
    toAddress,
    amount,
    options,
  }: BridgeRequestParam): Promise<string> {
    // check validity of toAddress according to toChainId
    toAddress = validateAndParseAddressByChainId(toAddress, toChainId);

    // if src chain is evm chain, signer must be provided
    if (IS_EVM(fromToken.chainId) && options.signerOrProvider == undefined) {
      throw new Error(`Provider must be provided`);
    }

    // near doesn't provide gas estimation yet

    // create mcs instance base on src token chainId.
    const mcs: IMapCrossChainService = createMCSInstance(
      fromToken.chainId,
      options
    );

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

    let gas;
    // if input token is Native coin, call transferOutNative method
    if (fromToken.isNative) {
      gas = await mcs.gasEstimateTransferOutNative(
        fromAddress,
        toAddress,
        toChainId.toString(),
        amount
      );
    } else {
      gas = await mcs.gasEstimateTransferOutToken(
        fromAddress,
        fromToken.address,
        amount,
        toAddress,
        toChainId.toString()
      );
    }

    return gas;
  }
}
