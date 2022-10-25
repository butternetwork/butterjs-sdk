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
    feeRate,
    mapNetwork,
    mapSigner,
    srcSigner,
    nearConfig,
    mapToken,
  }: AddTokenPairParam): Promise<void> {
    /**
     * argument check
     */
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

    /**
     * set allowed transfer token for source chain.
     */
    /** case 1: source chain is non-MAP evm chain*/
    if (IS_EVM(srcToken.chainId) && !IS_MAP(srcToken.chainId)) {
      const mcsContractAddress: string =
        MCS_CONTRACT_ADDRESS_SET[ID_TO_CHAIN_ID(srcToken.chainId)];

      const mcsService = new EVMCrossChainService(
        mcsContractAddress,
        MCS_EVM_METADATA.abi,
        srcSigner!
      );

      await mcsService.doSetCanBridgeToken(
        srcToken.address,
        targetToken.chainId,
        true
      );
    } else if (IS_NEAR(srcToken.chainId)) {
      /** case 2: source chain is Near */
      // initialize near contract, nearConfig cannot be undefined cuz we already check previously.
      const nearMCS = new NearCrossChainService(nearConfig!);
      console.log('init near mcs');
      if (srcToken.isNative) {
        await nearMCS.addNativeToChain(targetToken.chainId);
      } else {
        await nearMCS.addTokenToChain(srcToken.address, srcToken.chainId);
      }
      console.log(`add token ${srcToken.name} to ${targetToken.chainId}`);
    } else {
      throw new Error(
        `source chainId: ${srcToken.chainId} is not supported yet`
      );
    }

    /**
     * from this point, we need to set up staffs on Map Relay Chain...
     * 1. set chain token gas fee: aka bridge fee, used to compensate messenger gas cost
     * 2. register token: so later on map will know src token will mapped to target token
     * 3. set decimal: for out amount calculation
     */

    // create contract instance
    const mcsContractAddress: string =
      MCS_CONTRACT_ADDRESS_SET[NETWORK_NAME_TO_ID(mapNetwork)];
    const mapMCS = new RelayCrossChainService(
      mcsContractAddress,
      MCS_MAP_METADATA.abi,
      mapSigner
    );
    const feeCenter = new FeeCenter(FEE_CENTER_ADDRESS, mapSigner);
    const tokenRegister = new TokenRegister(TOKEN_REGISTER_ADDRESS, mapSigner);

    /** case 1: target chain is map */
    if (targetToken.chainId == NETWORK_NAME_TO_ID(mapNetwork)) {
      await tokenRegister.registerToken(
        srcToken.chainId,
        srcToken.address,
        targetToken.address
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

      // set fees
      await feeCenter.setChainTokenGasFee(
        targetToken.chainId,
        targetToken.address,
        feeRate.lowest,
        feeRate.highest,
        feeRate.bps
      );
    } else if (srcToken.chainId == NETWORK_NAME_TO_ID(mapNetwork)) {
      /** case 2: source chain is map */
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

      // set fee
      await feeCenter.setChainTokenGasFee(
        targetToken.chainId,
        srcToken.address,
        feeRate.lowest,
        feeRate.highest,
        feeRate.bps
      );
    } else {
      /** case 3: neither src chain and target chain is map, then map will act as a relay */
      await tokenRegister.registerToken(
        srcToken.chainId,
        srcToken.address,
        mapToken!.address
      );

      await tokenRegister.registerToken(
        targetToken.chainId,
        targetToken.address,
        mapToken!.address
      );

      // set token decimals for conversion.
      await mapMCS.doSetTokenOtherChainDecimals(
        mapToken!.address,
        srcToken.chainId,
        srcToken.decimals
      );
      await mapMCS.doSetTokenOtherChainDecimals(
        mapToken!.address,
        targetToken.chainId,
        targetToken.decimals
      );

      // set fee
      await feeCenter.setChainTokenGasFee(
        targetToken.chainId,
        targetToken.address,
        feeRate.lowest,
        feeRate.highest,
        feeRate.bps
      );
    }
    console.log('token reg done');
  }
}
