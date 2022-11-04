import { BigNumber, ethers } from 'ethers';
import { InMemoryKeyStore } from 'near-api-js/lib/key_stores';
import { KeyPair, keyStores, utils } from 'near-api-js';
import {
  AddTokenPairParam,
  BridgeRequestParam,
  NearNetworkConfig,
} from '../src/types';
import { BarterBridge } from '../src';
import {
  ChainId,
  ETH_PRIV_LMAP,
  ETH_PRIV_NATIVE,
  ETH_PRIV_NEAR,
  ETH_PRIV_WETH,
  MAP_TEST_METH,
  MAP_TEST_NATIVE,
  MAP_TEST_NEAR,
  NEAR_TEST_NATIVE,
} from '../src/constants';
import BN from 'bn.js';
import { getBridgeFee, getVaultBalance } from '../src/core/tools/dataFetch';
import { addTokenPair } from '../src/core/tools/manage';

const mapProvider = new ethers.providers.JsonRpcProvider(
  'http://18.142.54.137:7445',
  212
);
const mapSigner = new ethers.Wallet(
  '939ae45116ea2d4ef9061f13534bc451e9f9835e94f191970f23aac0299d5f7a',
  mapProvider
);
const ethProvider = new ethers.providers.JsonRpcProvider(
  'http://18.138.248.113:8545',
  34434
);
const ethSigner = new ethers.Wallet(
  '939ae45116ea2d4ef9061f13534bc451e9f9835e94f191970f23aac0299d5f7a',
  ethProvider
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
const oneEther = ethers.utils.parseEther('1').toString();
const oneNear = utils.format.parseNearAmount('1')!;
const to = '0x8c9b3cAf7DedD3003f53312779c1b92ba1625D94';

async function main() {
  const addTokenParam: AddTokenPairParam = {
    feeRate: {
      lowest: BigNumber.from(100000),
      highest: BigNumber.from(10000000000000),
      bps: 100,
    },
    mapNetwork: 'map-testnet',
    mapSigner: mapSigner,
    srcToken: ETH_PRIV_NATIVE,
    targetToken: MAP_TEST_METH,
    // mapToken: MAP_TEST_NEAR,
    nearConfig,
    srcSigner: ethSigner,
  };
  await addTokenPair(addTokenParam);
  // await mapToEthNative();
  // console.log(await getBridgeFee(ETH_PRIV_NATIVE, 212, oneEther, mapProvider));
  // console.log(await getBridgeFee(ETH_PRIV_NEAR, 34434, oneEther, mapProvider));
}

async function ethToMapNative() {
  const bridge: BarterBridge = new BarterBridge();
  const request: BridgeRequestParam = {
    token: ETH_PRIV_NATIVE,
    fromChainId: ETH_PRIV_NATIVE.chainId,
    toChainId: ChainId.MAP_TEST,
    toAddress: to,
    amount: oneEther,
    options: { signerOrProvider: ethSigner },
  };
  const ret = await bridge.bridgeToken(request);
}

async function ethToMapToken() {
  const bridge: BarterBridge = new BarterBridge();
  const request: BridgeRequestParam = {
    token: ETH_PRIV_LMAP,
    fromChainId: ETH_PRIV_WETH.chainId,
    toChainId: ChainId.MAP_TEST,
    toAddress: to,
    amount: oneEther,
    options: { signerOrProvider: ethSigner },
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
    options: { signerOrProvider: mapSigner },
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
    options: { signerOrProvider: mapSigner },
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
    options: { signerOrProvider: mapSigner },
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
    options: { signerOrProvider: mapSigner },
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
    options: { nearConfig: nearConfig },
  };

  await bridge.bridgeToken(request);
}

async function nearToMapToken() {}

async function nearToEth() {}

async function ethToNear() {}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
