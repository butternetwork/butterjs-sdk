import { AddTokenPairParam } from '../../types';
import {
  ID_TO_CHAIN_ID,
  IS_EVM,
  IS_MAP,
  IS_NEAR, MAP_NETWORK_NAME_TO_ID, MOS_CONTRACT, TOKEN_REGISTER,
} from '../../constants';
import { EVMOmnichainService } from '../../libs/mos/EVMOmnichainService';
import MOS_EVM_METADATA from '../../abis/MAPOmnichainService.json';
import { NearOmnichainService } from '../../libs/mos/NearOmnichainService';
import { RelayOmnichainService } from '../../libs/mos/RelayOmnichainService';
import MOS_MAP_METADATA from '../../abis/MAPOmnichainServiceRelay.json';
import { TokenRegister } from '../../libs/TokenRegister';
import { getHexAddress } from '../../utils';

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
    targetToken.chainId != MAP_NETWORK_NAME_TO_ID(mapNetwork) &&
    srcToken.chainId != MAP_NETWORK_NAME_TO_ID(mapNetwork) &&
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
    const mosContractAddress: string =
      // MOS_CONTRACT_ADDRESS_SET[ID_TO_CHAIN_ID(srcToken.chainId)];
    MOS_CONTRACT(srcToken.chainId);

    const mosService = new EVMOmnichainService(
      mosContractAddress,
      MOS_EVM_METADATA.abi,
      srcSigner!
    );

    await mosService.doSetCanBridgeToken(
      srcToken.address,
      targetToken.chainId,
      true
    );
  } else if (IS_NEAR(srcToken.chainId)) {
    /** case 2: source chain is Near */
    // initialize near contract, nearConfig cannot be undefined cuz we already check previously.
    const nearMOS = new NearOmnichainService(nearConfig!);
    if (srcToken.isNative) {
      await nearMOS.addNativeToChain(targetToken.chainId);
    } else {
      await nearMOS.addFungibleTokenToChain(
        srcToken.address,
        targetToken.chainId
      );
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
  const mosContractAddress: string =
    // MOS_CONTRACT_ADDRESS_SET[MAP_NETWORK_NAME_TO_ID(mapNetwork)];
  MOS_CONTRACT(mapNetwork);
  const mapMOS = new RelayOmnichainService(
    mosContractAddress,
    MOS_MAP_METADATA.abi,
    mapSigner
  );

  const tokenRegister = new TokenRegister(
      TOKEN_REGISTER(MAP_NETWORK_NAME_TO_ID(mapNetwork))!,
    // TOKEN_REGISTER_ADDRESS_SET[MAP_NETWORK_NAME_TO_ID(mapNetwork)]!,
    mapSigner
  );

  /** case 1: target chain is map */
  if (targetToken.chainId == MAP_NETWORK_NAME_TO_ID(mapNetwork)) {
    await tokenRegister.registerToken(
      srcToken.chainId,
      srcToken.address,
      targetToken.address
    );

    // set token decimals for conversion.
    await mapMOS.doSetTokenOtherChainDecimals(
      getHexAddress(srcToken.address, srcToken.chainId, false),
      srcToken.chainId,
      srcToken.decimals
    );

    await mapMOS.doSetTokenOtherChainDecimals(
      getHexAddress(srcToken.address, srcToken.chainId, false),
      targetToken.chainId,
      targetToken.decimals
    );
  } else if (srcToken.chainId == MAP_NETWORK_NAME_TO_ID(mapNetwork)) {
    /** case 2: source chain is map */
    await tokenRegister.registerToken(
      targetToken.chainId,
      targetToken.address,
      srcToken.address
    );

    // set token decimals for conversion.
    await mapMOS.doSetTokenOtherChainDecimals(
      srcToken.address,
      srcToken.chainId,
      srcToken.decimals
    );
    await mapMOS.doSetTokenOtherChainDecimals(
      srcToken.address,
      targetToken.chainId,
      targetToken.decimals
    );
  } else {
    /** case 3: neither src chain and target chain is map, then map will act as a relay */
    await tokenRegister.registerToken(
      srcToken.chainId,
      getHexAddress(srcToken.address, srcToken.chainId, false),
      mapToken!.address
    );
    console.log(`register ${srcToken.name} done`);

    await tokenRegister.registerToken(
      targetToken.chainId,
      getHexAddress(targetToken.address, targetToken.chainId, false),
      mapToken!.address
    );
    console.log(`register ${targetToken.name} done`);

    // set token decimals for conversion.
    await mapMOS.doSetTokenOtherChainDecimals(
      mapToken!.address,
      srcToken.chainId,
      srcToken.decimals
    );

    await mapMOS.doSetTokenOtherChainDecimals(
      mapToken!.address,
      targetToken.chainId,
      targetToken.decimals
    );
  }
  console.log('token reg done');
}
