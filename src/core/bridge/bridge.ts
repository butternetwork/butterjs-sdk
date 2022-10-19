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
  FEE_CENTER_ADDRESS,
  MCS_CONTRACT_ADDRESS_SET,
  TOKEN_REGISTER_ADDRESS,
} from '../../constants/addresses';
import { IMapCrossChainService } from '../../libs/interfaces/IMapCrossChainService';

import { RelayCrossChainService } from '../../libs/mcs/RelayCrossChainService';
import { TokenRegister } from '../../libs/TokenRegister';
import { FeeCenter } from '../../libs/FeeCenter';
import { createMCSInstance } from '../../libs/utils/mcsUtils';
import MCS_EVM_ABI from '../../abis/MAPCrossChainServiceABI.json';
import MCS_MAP_ABI from '../../abis/MAPCrossChainServiceRelayABI.json';
import { NearCrossChainService } from '../../libs/mcs/NearCrossChainService';

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
   */
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

    // create mcs instance base on src token chainId.
    const mcs: IMapCrossChainService = createMCSInstance(
      token.chainId,
      signer,
      nearConfig
    );

    let txHash = '';

    // if input token is Native coin, call transferOutNative method
    if (token.isNative) {
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

    // return the transaction hash
    return txHash;
  }

  /**
   * TODO: need improvement!
   * Approve the bridge of the token pair provided.
   * @param srcToken source token
   * @param targetToken target token
   * @param feeBP bridge fee in BP(tenth of one percent)
   * @param mapNetwork map network 'testnet' or 'mainnet'
   * @param mapSigner map signer to sign transaction
   * @param srcSigner src chain signer if src chain is a evm blockchain
   * @param nearConfig near network configuration see {@link NearNetworkConfig}
   * @param mapToken intermediary map token, if the token pair provided both from other blockchain than map,
   * provide a map intermediary token
   */
  async addTokenPair({
    srcToken,
    targetToken,
    feeBP,
    mapNetwork,
    mapSigner,
    srcSigner,
    nearConfig,
    mapToken,
  }: AddTokenPairParam): Promise<void> {
    // argument check
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
    } else if (IS_NEAR(srcToken.chainId) && nearConfig == undefined) {
      throw new Error('near config is not provided');
    }

    // set allowed transfer out token in evm src chain
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

    // set allowed transferout token in near chain
    else if (IS_NEAR(srcToken.chainId)) {
      // initialize near contract, nearConfig cannot be undefined cuz we already check previously.
      const nearMCS = new NearCrossChainService(nearConfig!);
      if (srcToken.isNative) {
        await nearMCS.addNativeToChain(targetToken.chainId);
      } else {
        await nearMCS.addTokenToChain(srcToken.address, srcToken.chainId);
      }
    }

    /**
     * from this point, we need to set up staffs on Map Relay Chain...
     * 1. set chain token gas fee: aka bridge fee, used to compensate messenger gas cost
     * 2. register token: so later on map will know src token will mapped to target token
     * 3. set decimal: for out amount calculation
     */
    const feeCenter = new FeeCenter(FEE_CENTER_ADDRESS, mapSigner);
    await feeCenter.setChainTokenGasFee(
      targetToken.chainId,
      srcToken.address,
      100000,
      1000000000000000,
      feeBP
    );

    const mcsContractAddress: string =
      MCS_CONTRACT_ADDRESS_SET[NETWORK_NAME_TO_ID(mapNetwork)];

    const mapMCS = new RelayCrossChainService(
      mcsContractAddress,
      MCS_MAP_ABI,
      mapSigner
    );

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
  }
}
