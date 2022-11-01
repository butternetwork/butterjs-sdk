import { AddTokenPairParam } from '../../types';
import {
  FEE_CENTER_ADDRESS_SET,
  ID_TO_CHAIN_ID,
  IS_EVM,
  IS_MAP,
  IS_NEAR,
  MCS_CONTRACT_ADDRESS_SET,
  NETWORK_NAME_TO_ID,
  TOKEN_REGISTER_ADDRESS_SET,
} from '../../constants';
import { EVMCrossChainService } from '../../libs/mcs/EVMCrossChainService';
import MCS_EVM_METADATA from '../../abis/MAPCrossChainService.json';
import { NearCrossChainService } from '../../libs/mcs/NearCrossChainService';
import { RelayCrossChainService } from '../../libs/mcs/RelayCrossChainService';
import MCS_MAP_METADATA from '../../abis/MAPCrossChainServiceRelay.json';
import { FeeCenter } from '../../libs/FeeCenter';
import { TokenRegister } from '../../libs/TokenRegister';

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
export async function addTokenPair({
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
    if (srcToken.isNative) {
      await nearMCS.addNativeToChain(targetToken.chainId);
    } else {
      await nearMCS.addTokenToChain(srcToken.address, srcToken.chainId);
    }
    console.log(`add token ${srcToken.name} to ${targetToken.chainId}`);
  } else if (!IS_MAP(srcToken.chainId)) {
    throw new Error(`source chainId: ${srcToken.chainId} is not supported yet`);
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
  const feeCenter = new FeeCenter(
    FEE_CENTER_ADDRESS_SET[NETWORK_NAME_TO_ID(mapNetwork)]!,
    mapSigner
  );
  const tokenRegister = new TokenRegister(
    TOKEN_REGISTER_ADDRESS_SET[NETWORK_NAME_TO_ID(mapNetwork)]!,
    mapSigner
  );

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
    console.log(`register ${srcToken.name} done`);

    await tokenRegister.registerToken(
      targetToken.chainId,
      targetToken.address,
      mapToken!.address
    );
    console.log(`register ${targetToken.name} done`);

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
    console.log(`setfee done`);
  }
  console.log('token reg done');
}
