import { ethers } from 'ethers';
import { BarterBridge } from '../core/bridge/bridge';
import { AddTokenPairParam, BridgeRequestParam } from '../types/requestTypes';
import { Token } from '../entities';
import { ChainId, ID_TO_CHAIN_ID, IS_MAP } from '../constants/chains';
import { MCS_CONTRACT_ADDRESS_SET } from '../constants/addresses';
import { IMapCrossChainService } from '../libs/interfaces/IMapCrossChainService';
import { EVMCrossChainService } from '../libs/mcs/EVMCrossChainService';
import MCS_MAP_ABI from '../abis/MAPCrossChainServiceRelayABI.json';
import TOKEN_REG_ABI from '../abis/TokenRegister.json';
import MCS_EVM_ABI from '../abis/MAPCrossChainServiceABI.json';
import { RelayCrossChainService } from '../libs/mcs/RelayCrossChainService';
import { TokenRegister } from '../libs/TokenRegister';
import { InMemoryKeyStore } from 'near-api-js/lib/key_stores';
import { KeyPair, keyStores, utils } from 'near-api-js';
import { NearCrossChainService } from '../libs/mcs/NearCrossChainService';
import { decimalArrayToHex, hexToDecimalArray } from '../utils';
import BN from 'bn.js';
import { approveToken } from '../libs/allowance';
import WETH9_ABI from '../abis/WETH9.json';
import { ETH_PRIV_NATIVE, MAP_TEST_METH } from '../constants/tokens';

require('dotenv/config');

const mapProvider = new ethers.providers.JsonRpcProvider(
  'http://18.142.54.137:7445',
  212
);
const mapSigner = new ethers.Wallet(process.env.PRIVATE_KEY!, mapProvider);

const ethProvider = new ethers.providers.JsonRpcProvider(
  'http://18.138.248.113:8545',
  34434
);
const ethSigner = new ethers.Wallet(process.env.PRIVATE_KEY!, ethProvider);

const makaluProvider = new ethers.providers.JsonRpcProvider(
  'https://poc2-rpc.maplabs.io',
  22776
);
const makaluSigner = new ethers.Wallet(
  process.env.PRIVATE_KEY!,
  makaluProvider
);

const oneEther = ethers.utils.parseEther('2').toString();
const LMAP = '0xE1b2b81B66150F9EF5A89dC346a7A8B8df05d847';
const to = '0x8c9b3cAf7DedD3003f53312779c1b92ba1625D94';
const ethmcs = new EVMCrossChainService(
  MCS_CONTRACT_ADDRESS_SET[ChainId.ETH_PRIV],
  MCS_EVM_ABI,
  ethSigner
);

const mapmcs = new RelayCrossChainService(
  MCS_CONTRACT_ADDRESS_SET[ChainId.MAP_TEST],
  MCS_MAP_ABI,
  mapSigner
);

async function main() {
  // const bridge = new BarterBridge();
  //
  // const param: AddTokenPairParam = {
  //   srcToken: MAP_TEST_METH,
  //   targetToken: ETH_PRIV_NATIVE,
  //   feeBP: 100,
  //   mapNetwork: 'map-testnet',
  //   mapSigner: mapSigner,
  //   srcSigner: ethSigner,
  // };
  // await bridge.addTokenPair(param);
  // await approveToken(
  //   mapSigner,
  //   MAP_TEST_METH,
  //   ethers.utils.parseEther('10').toString(),
  //   '0xf0C4f447e361c14F9BF01F9805a78F51FCCb95BB',
  //   true
  // );
  // await ethToMapNative();
  // await ethToMapToken();
  // await mapToEthNative(); pass
  await mapToEthToken();
}

async function ethToMapNative() {
  await ethmcs.doTransferOutNative(to, '212', oneEther);
}

async function ethToMapToken() {
  await ethmcs.doTransferOutToken(
    LMAP, //LMAP
    oneEther,
    to,
    '212'
  );
}

async function mapToEthNative() {
  await mapmcs.doTransferOutNative(to, '34434', oneEther);
}

async function mapToEthToken() {
  await mapmcs.doTransferOutToken(MAP_TEST_METH.address, oneEther, to, '34434');
}

async function mapToNearNative() {
  await mapmcs.doTransferOutNative(
    '0x78796c692e746573746e6574',
    '1313161555',
    ethers.utils.parseEther('1').toString()
  );
}

async function mapToNearToken() {
  await mapmcs.doTransferOutToken(
    '0xAC35D87EfcA068c9dcEf65f89937B7593fA03d37',
    ethers.utils.parseEther('1').toString(),
    '0x78796c692e746573746e6574',
    '1313161555'
  );
}

async function nearToMapNative() {
  const keyStore: InMemoryKeyStore = new keyStores.InMemoryKeyStore();
  const keyPair: KeyPair = KeyPair.fromString(
    'ed25519:3V1ZUMUD3pZkKyEFJFHpev32WVipYb7HFu6YhnHrGZMw1bArtcBBzB11W9ouFuB3cd11hZL2miXZnX1N36pgywgU'
  );
  keyStore.setKey('testnet', 'xyli.testnet', keyPair);

  const nearMcs: NearCrossChainService = new NearCrossChainService({
    fromAccount: 'xyli.testnet',
    keyStore: keyStore,
    nodeUrl: 'https://rpc.testnet.near.org',
    networkId: 'testnet',
  });

  const toAddress: number[] = hexToDecimalArray(
    '0x8c9b3cAf7DedD3003f53312779c1b92ba1625D94',
    212
  );

  const txHash: string = await nearMcs.doTransferOutNative(
    toAddress,
    '212',
    utils.format.parseNearAmount('1')!,
    {}
  );
}

async function nearToMapToken() {
  const keyStore: InMemoryKeyStore = new keyStores.InMemoryKeyStore();
  const keyPair: KeyPair = KeyPair.fromString(
    'ed25519:3V1ZUMUD3pZkKyEFJFHpev32WVipYb7HFu6YhnHrGZMw1bArtcBBzB11W9ouFuB3cd11hZL2miXZnX1N36pgywgU'
  );
  keyStore.setKey('testnet', 'xyli.testnet', keyPair);

  const nearMcs: NearCrossChainService = new NearCrossChainService({
    fromAccount: 'xyli.testnet',
    keyStore: keyStore,
    nodeUrl: 'https://rpc.testnet.near.org',
    networkId: 'testnet',
  });

  const toAddress: number[] = hexToDecimalArray(
    '0x8c9b3cAf7DedD3003f53312779c1b92ba1625D94',
    212
  );

  // const txHash: string = await nearMcs.doTransferOutToken(
  //   'xyli.testnet',
  //   toAddress,
  //   212,
  //   new BN(utils.format.parseNearAmount('1')!, 10)
  // );
}

async function nearToEth() {}

async function ethToNear() {}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
