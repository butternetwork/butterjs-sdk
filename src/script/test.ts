import { ethers } from 'ethers';
import { BarterBridge } from '../core/bridge/bridge';
import { BridgeRequestParam, NearNetworkConfig } from '../types/requestTypes';
import { ChainId } from '../constants/chains';
import { InMemoryKeyStore } from 'near-api-js/lib/key_stores';
import { KeyPair, keyStores, utils } from 'near-api-js';
import { NearCrossChainService } from '../libs/mcs/NearCrossChainService';
import { hexToDecimalArray } from '../utils';
import {
  ETH_PRIV_LMAP,
  ETH_PRIV_NATIVE,
  ETH_PRIV_WETH,
  MAP_TEST_METH,
  MAP_TEST_NATIVE,
  MAP_TEST_NEAR,
  NEAR_TEST_NATIVE,
} from '../constants/tokens';

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
const keyStore: InMemoryKeyStore = new keyStores.InMemoryKeyStore();
const keyPair: KeyPair = KeyPair.fromString(
  'ed25519:3V1ZUMUD3pZkKyEFJFHpev32WVipYb7HFu6YhnHrGZMw1bArtcBBzB11W9ouFuB3cd11hZL2miXZnX1N36pgywgU'
);
keyStore.setKey('testnet', 'xyli.testnet', keyPair);

const nearConfig: NearNetworkConfig = {
  fromAccount: 'xyli.testnet',
  keyStore: keyStore,
  nodeUrl: 'https://rpc.testnet.near.org',
  networkId: 'testnet',
};

const oneEther = ethers.utils.parseEther('2').toString();
const oneNear = utils.format.parseNearAmount('1')!;
const LMAP = '0xE1b2b81B66150F9EF5A89dC346a7A8B8df05d847';
const to = '0x8c9b3cAf7DedD3003f53312779c1b92ba1625D94';

async function main() {}

async function ethToMapNative() {
  const bridge: BarterBridge = new BarterBridge();
  const request: BridgeRequestParam = {
    token: ETH_PRIV_NATIVE,
    fromChainId: ETH_PRIV_NATIVE.chainId,
    toChainId: ChainId.MAP_TEST,
    toAddress: to,
    amount: oneEther,
    signer: ethSigner,
  };
  await bridge.bridgeToken(request);
}

async function ethToMapToken() {
  const bridge: BarterBridge = new BarterBridge();
  const request: BridgeRequestParam = {
    token: ETH_PRIV_LMAP,
    fromChainId: ETH_PRIV_WETH.chainId,
    toChainId: ChainId.MAP_TEST,
    toAddress: to,
    amount: oneEther,
    signer: ethSigner,
  };
  await bridge.bridgeToken(request);
}

async function mapToEthNative() {
  const bridge: BarterBridge = new BarterBridge();
  const request: BridgeRequestParam = {
    token: MAP_TEST_NATIVE,
    fromChainId: MAP_TEST_NATIVE.chainId,
    toChainId: ChainId.ETH_PRIV,
    toAddress: to,
    amount: oneEther,
    signer: mapSigner,
  };
  await bridge.bridgeToken(request);
}

async function mapToEthToken() {
  const bridge: BarterBridge = new BarterBridge();
  const request: BridgeRequestParam = {
    token: MAP_TEST_METH,
    fromChainId: MAP_TEST_METH.chainId,
    toChainId: ChainId.ETH_PRIV,
    toAddress: 'xyli.testnet',
    amount: oneEther,
    signer: mapSigner,
  };
  await bridge.bridgeToken(request);
}

async function mapToNearNative() {
  const bridge: BarterBridge = new BarterBridge();
  const request: BridgeRequestParam = {
    token: MAP_TEST_NATIVE,
    fromChainId: MAP_TEST_NATIVE.chainId,
    toChainId: ChainId.NEAR_TESTNET,
    toAddress: to,
    amount: oneEther,
    signer: mapSigner,
  };
  await bridge.bridgeToken(request);
}

async function mapToNearToken() {
  const bridge: BarterBridge = new BarterBridge();
  const request: BridgeRequestParam = {
    token: MAP_TEST_NEAR,
    fromChainId: MAP_TEST_NEAR.chainId,
    toChainId: ChainId.NEAR_TESTNET,
    toAddress: to,
    amount: oneEther,
    signer: mapSigner,
  };
  await bridge.bridgeToken(request);
}

async function nearToMapNative() {
  const bridge: BarterBridge = new BarterBridge();
  const request: BridgeRequestParam = {
    token: NEAR_TEST_NATIVE,
    fromChainId: ChainId.NEAR_TESTNET,
    toChainId: ChainId.MAP_TEST,
    toAddress: to,
    amount: oneNear,
    nearConfig: nearConfig,
  };

  await bridge.bridgeToken(request);
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
