import { ChainId, IS_EVM, IS_NEAR } from '../../constants/chains';
import { getHexAddress, validateAndParseAddressByChainId } from '../../utils';
import { BridgeRequestParam } from '../../types/requestTypes';
import { IMapCrossChainService } from '../../libs/interfaces/IMapCrossChainService';
import { createMCSInstance } from '../../libs/utils/mcsUtils';
import { BarterContractCallReceipt } from '../../types/responseTypes';
import BN from 'bn.js';
import { hexlify } from 'ethers/lib/utils';

export class BarterBridge {
  /**
   * The BridgeToken method is used to bridge token from one chain to another.
   * see {@link BridgeRequestParam} for detail
   * @param token source token, aka token that user provide
   * @param toChainId target chain id
   * @param toAddress target chain receiving address
   * @param amount amount to bridge, in minimal uint. For example wei in Ethereum, yocto in Near
   * @param signer ethers.js signer, must provide when src chain is EVM chain
   * @param nearConfig Near config file, must provide when src chain is Near
   * @return BN for gas estimation, ContractCallReceipt for actual contract invocation
   */
  async bridgeToken({
    token,
    toChainId,
    toAddress,
    amount,
    options,
  }: BridgeRequestParam): Promise<BarterContractCallReceipt> {
    // check validity of toAddress according to toChainId
    toAddress = validateAndParseAddressByChainId(toAddress, toChainId);
    // if src chain is evm chain, signer must be provided
    if (IS_EVM(token.chainId) && options.signerOrProvider == undefined) {
      throw new Error(`Signer must be provided for EVM blockchains`);
    }

    // if src chain is near chain, near network config must be provided
    if (
      ChainId.NEAR_TESTNET == token.chainId &&
      options.nearConfig == undefined
    ) {
      throw new Error(`Network config must be provided for NEAR blockchain`);
    }

    // create mcs instance base on src token chainId.
    const mcs: IMapCrossChainService = createMCSInstance(
      token.chainId,
      options
    );

    let result;
    if (IS_NEAR(toChainId)) {
      toAddress = getHexAddress(toAddress, toChainId);
    }
    if (token.isNative) {
      // if input token is Native coin, call transferOutNative method
      result = await mcs.doTransferOutNative(
        toAddress,
        toChainId.toString(),
        amount,
        {
          gas: options.gas,
        }
      );
    } else {
      result = await mcs.doTransferOutToken(
        token.address,
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
    token,
    toChainId,
    toAddress,
    amount,
    options,
  }: BridgeRequestParam): Promise<string> {
    // check validity of toAddress according to toChainId
    toAddress = validateAndParseAddressByChainId(toAddress, toChainId);

    // if src chain is evm chain, signer must be provided
    if (IS_EVM(token.chainId) && options.signerOrProvider == undefined) {
      throw new Error(`Provider must be provided`);
    }

    // near doesn't provide gas estimation yet

    // create mcs instance base on src token chainId.
    const mcs: IMapCrossChainService = createMCSInstance(
      token.chainId,
      options
    );

    if (IS_NEAR(toChainId)) {
      toAddress = getHexAddress(toAddress, toChainId);
    }

    let gas;
    // if input token is Native coin, call transferOutNative method
    if (token.isNative) {
      gas = await mcs.gasEstimateTransferOutNative(
        toAddress,
        toChainId.toString(),
        amount
      );
    } else {
      gas = await mcs.gasEstimateTransferOutToken(
        token.address,
        amount,
        toAddress,
        toChainId.toString()
      );
    }

    return gas;
  }
}
