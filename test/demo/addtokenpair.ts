import { BigNumber, ethers } from 'ethers';
import { InMemoryKeyStore } from 'near-api-js/lib/key_stores';
import { connect, KeyPair, keyStores, Near, utils } from 'near-api-js';
import {
  AddTokenPairParam,
  BridgeRequestParam,
  NearNetworkConfig,
} from '../../src/types';
import { ButterBridge } from '../../src';
import {
  BSC_TEST_CHAIN,
  BSC_TEST_NATIVE,
  BSC_TEST_NEAR,
  ChainId,
  ETH_PRIV_LMAP,
  ETH_PRIV_NATIVE,
  ETH_PRIV_NEAR,
  ETH_PRIV_WETH,
  MAP_TEST_METH,
  MAP_TEST_NATIVE,
  MAP_TEST_NEAR,
  MOS_CONTRACT_ADDRESS_SET,
  NEAR_TEST_NATIVE,
} from '../../src/constants';
import BN from 'bn.js';
import { getBridgeFee, getVaultBalance } from '../../src/core/tools/dataFetch';
import { addTokenPair } from '../../src/core/tools/tokenManagement';
import { hexToDecimalArray } from '../../src/utils';
import { ChangeFunctionCallOptions } from 'near-api-js/lib/account';
import { TRANSFER_OUT_TOKEN } from '../../src/constants/near_method_names';
import { FinalExecutionOutcome } from 'near-api-js/lib/providers';

const mapProvider = new ethers.providers.JsonRpcProvider(
  'https://testnet-rpc.maplabs.io',
  212
);
const mapSigner = new ethers.Wallet(
  'b87b1f26c7d0ffe0f65c25dbc09602e0ac9c0d14acc979b5d67439cade6cdb7b',
  mapProvider
);
// const ethProvider = new ethers.providers.JsonRpcProvider(
//   'http://18.138.248.113:8545',
//   34434
// );
// const ethSigner = new ethers.Wallet(
//   'b87b1f26c7d0ffe0f65c25dbc09602e0ac9c0d14acc979b5d67439cade6cdb7b',
//   ethProvider
// );

const bscProvider = new ethers.providers.JsonRpcProvider(
  BSC_TEST_CHAIN.rpc,
  BSC_TEST_CHAIN.chainId
);
const bscSigner = new ethers.Wallet(
  'b87b1f26c7d0ffe0f65c25dbc09602e0ac9c0d14acc979b5d67439cade6cdb7b',
  bscProvider
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
  // await addChainTypeToNear(97, 'EvmChain');

  const addTokenParam: AddTokenPairParam = {
    feeRate: {
      lowest: BigNumber.from(1),
      highest: BigNumber.from(10000000000000),
      bps: 1,
    },
    mapNetwork: 'map-testnet',
    mapSigner: mapSigner,
    srcToken: NEAR_TEST_NATIVE,
    targetToken: BSC_TEST_NEAR,
    mapToken: MAP_TEST_NEAR,
    nearConfig,
    srcSigner: bscSigner,
  };
  await addTokenPair(addTokenParam);
  // await mapToEthNative();
  // console.log(await getBridgeFee(ETH_PRIV_NATIVE, 212, oneEther, mapProvider));
  // console.log(await getBridgeFee(ETH_PRIV_NEAR, 34434, oneEther, mapProvider));
}

async function ethToMapNative() {
  const bridge: ButterBridge = new ButterBridge();
  const request: BridgeRequestParam = {
    fromAddress: '',
    fromToken: ETH_PRIV_NATIVE,
    fromChainId: ETH_PRIV_NATIVE.chainId,
    toChainId: ChainId.MAP_TEST,
    toAddress: to,
    amount: oneEther,
    options: { signerOrProvider: bscSigner },
  };
  const ret = await bridge.bridgeToken(request);
}

async function ethToMapToken() {
  const bridge: ButterBridge = new ButterBridge();
  const request: BridgeRequestParam = {
    fromAddress: '',
    fromToken: ETH_PRIV_LMAP,
    fromChainId: ETH_PRIV_WETH.chainId,
    toChainId: ChainId.MAP_TEST,
    toAddress: to,
    amount: oneEther,
    options: { signerOrProvider: bscSigner },
  };
  await bridge.bridgeToken(request);
}

async function mapToEthNative() {
  const bridge: ButterBridge = new ButterBridge();
  const request: BridgeRequestParam = {
    fromAddress: '',
    fromToken: MAP_TEST_NATIVE,
    fromChainId: MAP_TEST_NATIVE.chainId,
    toChainId: ChainId.ETH_PRIV,
    toAddress: to,
    amount: oneEther,
    options: { signerOrProvider: mapSigner },
  };
  await bridge.bridgeToken(request);
}

async function mapToEthToken() {
  const bridge: ButterBridge = new ButterBridge();
  const request: BridgeRequestParam = {
    fromAddress: '',
    fromToken: MAP_TEST_METH,
    fromChainId: MAP_TEST_METH.chainId,
    toChainId: ChainId.ETH_PRIV,
    toAddress: 'xyli.testnet',
    amount: oneEther,
    options: { signerOrProvider: mapSigner },
  };
  await bridge.bridgeToken(request);
}

async function mapToNearNative() {
  const bridge: ButterBridge = new ButterBridge();
  const request: BridgeRequestParam = {
    fromAddress: '',
    fromToken: MAP_TEST_NATIVE,
    fromChainId: MAP_TEST_NATIVE.chainId,
    toChainId: ChainId.NEAR_TESTNET,
    toAddress: to,
    amount: oneEther,
    options: { signerOrProvider: mapSigner },
  };
  await bridge.bridgeToken(request);
}

async function mapToNearToken() {
  const bridge: ButterBridge = new ButterBridge();
  const request: BridgeRequestParam = {
    fromAddress: '',
    fromToken: MAP_TEST_NEAR,
    fromChainId: MAP_TEST_NEAR.chainId,
    toChainId: ChainId.NEAR_TESTNET,
    toAddress: to,
    amount: oneEther,
    options: { signerOrProvider: mapSigner },
  };
  await bridge.bridgeToken(request);
}

async function nearToMapNative() {
  const bridge: ButterBridge = new ButterBridge();
  const request: BridgeRequestParam = {
    fromAddress: '',
    fromToken: NEAR_TEST_NATIVE,
    fromChainId: ChainId.NEAR_TESTNET,
    toChainId: ChainId.MAP_TEST,
    toAddress: to,
    amount: oneNear,
    options: { nearProvider: nearConfig },
  };

  await bridge.bridgeToken(request);
}

async function nearToMapToken() {}

async function nearToEth() {}

async function addChainTypeToNear(chainId: number, chainType: string) {
  const mosAccountId: string =
    nearConfig.networkId === 'testnet'
      ? MOS_CONTRACT_ADDRESS_SET[ChainId.NEAR_TESTNET]
      : '';

  // prep near connection
  const near: Near = await connect(nearConfig);
  const account = await near.account(nearConfig.fromAccount);

  // contract call option
  const nearCallOptions: ChangeFunctionCallOptions = {
    contractId: mosAccountId,
    methodName: 'set_chain_type',
    args: {
      chain_id: chainId,
      chain_type: chainType,
    },
  };
  let outcome: FinalExecutionOutcome;
  try {
    outcome = await account.functionCall(nearCallOptions);
  } catch (e) {
    console.log(e);
  }
  console.log(outcome!);
}
async function ethToNear() {}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
