import { ethers, Signer } from 'ethers';
import {
  ChainId,
  ID_TO_CHAIN_ID,
  IS_EVM,
  IS_MAP,
  IS_NEAR,
  NETWORK_NAME_TO_ID,
} from '../../constants/chains';
import { validateAndParseAddressByChainId } from '../../utils';
import {
  BridgeRequestParam,
  AddTokenPairParam,
  NearNetworkConfig,
} from '../../types/requestTypes';
import { EVMCrossChainService } from '../../libs/mcs/EVMCrossChainService';
import {
  FEE_CENTER_ADDRESS_SET,
  MCS_CONTRACT_ADDRESS_SET,
  TOKEN_REGISTER_ADDRESS_SET,
} from '../../constants/addresses';
import { IMapCrossChainService } from '../../libs/interfaces/IMapCrossChainService';

import { RelayCrossChainService } from '../../libs/mcs/RelayCrossChainService';
import { TokenRegister } from '../../libs/TokenRegister';
import { FeeCenter } from '../../libs/FeeCenter';
import { createMCSInstance } from '../../libs/utils/mcsUtils';
import MCS_EVM_METADATA from '../../abis/MAPCrossChainService.json';
import MCS_MAP_METADATA from '../../abis/MAPCrossChainServiceRelay.json';
import { NearCrossChainService } from '../../libs/mcs/NearCrossChainService';
import { ContractCallReceipt } from '../../types/responseTypes';
import BN from 'bn.js';

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
    gasEstimate,
    options,
  }: BridgeRequestParam): Promise<ContractCallReceipt | BN> {
    // check validity of toAddress according to toChainId
    toAddress = validateAndParseAddressByChainId(toAddress, toChainId);

    // if src chain is evm chain, signer must be provided
    if (IS_EVM(token.chainId) && options.signer == undefined) {
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

    // if input token is Native coin, call transferOutNative method
    if (token.isNative) {
      result = await mcs.doTransferOutNative(
        toAddress,
        toChainId.toString(),
        amount,
        gasEstimate
      );
    } else {
      result = await mcs.doTransferOutToken(
        token.address,
        amount,
        toAddress,
        toChainId.toString(),
        gasEstimate
      );
    }

    return result;
  }
}
