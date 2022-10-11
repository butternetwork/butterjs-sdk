import { ethers, Signer } from 'ethers';
import {
  ChainId,
  ID_TO_CHAIN_ID,
  IS_EVM,
  IS_MAP,
  NETWORK_NAME_TO_ID,
} from '../../constants/chains';
import { validateAndParseAddressByChainId } from '../../utils';
import {
  BridgeRequestParam,
  AddTokenPairParam,
} from '../../types/requestTypes';
import { EVMCrossChainService } from '../../libs/mcs/EVMCrossChainService';
import {
  FEE_CENTER_ADDRESS,
  MCS_CONTRACT_ADDRESS_SET,
  TOKEN_REGISTER_ADDRESS,
} from '../../constants/addresses';
import { ContractReceipt } from '@ethersproject/contracts/src.ts';
import { IMapCrossChainService } from '../../libs/interfaces/IMapCrossChainService';

import { RelayCrossChainService } from '../../libs/mcs/RelayCrossChainService';
import { TokenRegister } from '../../libs/TokenRegister';
import { FeeCenter } from '../../libs/FeeCenter';
import { createMCSInstance } from '../../libs/utils/mcsUtils';
import MCS_EVM_ABI from '../../abis/MAPCrossChainServiceABI.json';
import MCS_MAP_ABI from '../../abis/MAPCrossChainServiceRelayABI.json';

export class BarterBridge {
  async bridgeToken({
    token,
    toChainId,
    toAddress,
    amount,
    signer,
    nearConfig,
  }: BridgeRequestParam): Promise<string> {
    // check validity of toAddress according to toChainId
    toAddress = validateAndParseAddressByChainId(toAddress, toChainId);

    // if src chain is evm chain, signer must be provided
    if (IS_EVM(token.chainId) && signer == undefined) {
      throw new Error(`Signer must be provided for EVM blockchains`);
    }

    // if src chain is near chain, near network config must be provided
    if (ChainId.NEAR_TESTNET == token.chainId && nearConfig == undefined) {
      throw new Error(`Network config must be provided for NEAR blockchain`);
    }

    // create mcs instance
    const mcs: IMapCrossChainService = createMCSInstance(
      token.chainId,
      signer,
      nearConfig
    );

    let txHash = '';
    if (token.address == ethers.constants.AddressZero) {
      txHash = await mcs.doTransferOutNative(
        toAddress,
        toChainId.toString(),
        amount
      );
    } else {
      txHash = await mcs.doTransferOutToken(
        token.address,
        amount,
        toAddress,
        toChainId.toString()
      );
    }
    return txHash;
  }

  async addTokenPair({
    srcToken,
    targetToken,
    feeBP,
    mapNetwork,
    mapSigner,
    srcSigner,
    mapToken,
  }: AddTokenPairParam): Promise<void> {
    // check if map intermediary token is provided when bridge two chains
    if (
      targetToken.chainId != NETWORK_NAME_TO_ID(mapNetwork) &&
      srcToken.chainId != NETWORK_NAME_TO_ID(mapNetwork) &&
      mapToken == undefined
    ) {
      throw new Error('intermediary map token is not specified');
    }

    if (
      IS_EVM(srcToken.chainId) &&
      !IS_MAP(srcToken.chainId) &&
      srcSigner == undefined
    ) {
      throw new Error('src chain signer is not provided');
    }

    const mcsContractAddress: string =
      MCS_CONTRACT_ADDRESS_SET[NETWORK_NAME_TO_ID(mapNetwork)];

    const mapMCS = new RelayCrossChainService(
      mcsContractAddress,
      MCS_MAP_ABI,
      mapSigner
    );

    if (IS_EVM(srcToken.chainId) && !IS_MAP(srcToken.chainId)) {
      const mcsContractAddress: string =
        MCS_CONTRACT_ADDRESS_SET[ID_TO_CHAIN_ID(srcToken.chainId)];

      const mcsService = new EVMCrossChainService(
        mcsContractAddress,
        MCS_EVM_ABI,
        srcSigner!
      );

      await mcsService.doSetCanBridgeToken(
        srcToken.address,
        targetToken.chainId,
        true
      );
      console.log('done set can bridge token');
      console.log('srcToken: ', srcToken);
      console.log('tgtToken: ', targetToken);
    }

    // set token gas fee compensation in bps
    const feeCenter = new FeeCenter(FEE_CENTER_ADDRESS, mapSigner);
    await feeCenter.setChainTokenGasFee(
      targetToken.chainId,
      srcToken.address,
      100000,
      1000000000000000,
      feeBP
    );
    console.log('done set chain token gas fee');

    // set token mapping in token register
    const tokenRegister = new TokenRegister(TOKEN_REGISTER_ADDRESS, mapSigner);
    if (targetToken.chainId == NETWORK_NAME_TO_ID(mapNetwork)) {
      await tokenRegister.registerToken(
        srcToken.chainId,
        srcToken.address,
        targetToken.address
      );

      // set token decimals for conversion.
      await mapMCS.doSetTokenOtherChainDecimals(
        targetToken.address,
        srcToken.chainId,
        srcToken.decimals
      );
      await mapMCS.doSetTokenOtherChainDecimals(
        targetToken.address,
        targetToken.chainId,
        targetToken.decimals
      );
    } else if (srcToken.chainId == NETWORK_NAME_TO_ID(mapNetwork)) {
      await tokenRegister.registerToken(
        targetToken.chainId,
        targetToken.address,
        srcToken.address
      );

      // set token decimals for conversion.
      await mapMCS.doSetTokenOtherChainDecimals(
        srcToken.address,
        srcToken.chainId,
        srcToken.decimals
      );
      await mapMCS.doSetTokenOtherChainDecimals(
        srcToken.address,
        targetToken.chainId,
        targetToken.decimals
      );
    } else {
      await tokenRegister.registerToken(
        srcToken.chainId,
        srcToken.address,
        mapToken!.address
      );

      await tokenRegister.registerToken(
        targetToken.chainId,
        targetToken.address,
        srcToken.address
      );
    }
    console.log('done reg token');
  }
}
