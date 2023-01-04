import Web3 from 'web3';
import { InMemoryKeyStore } from 'near-api-js/lib/key_stores';
import { KeyPair, keyStores } from 'near-api-js';
import { NearNetworkConfig } from '../../src/types';
import {
  BSC_TEST_CHAIN,
  ETH_GOERLI_CHAIN,
  MAP_TEST_CHAIN,
  NEAR_TEST_CHAIN,
  POLYGON_TEST_CHAIN,
} from '../../src/constants';
import { ethers } from 'ethers';
import { ButterJsonRpcProvider } from '../../src/types/paramTypes';

require('dotenv/config');

// web3.js for reference
const web3 = new Web3(
  'https://testnet-rpc.maplabs.io'
  // 'https://rpc.ankr.com/bsc_testnet_chapel/9a12629301614050e76136dcaf9627f5ef215f86fb1185d908f9d232b8530ef7'
);
const account = web3.eth.accounts.privateKeyToAccount(
  '0x' + process.env.EVM_PRIVATE_KEY
);

web3.eth.accounts.wallet.add(account);
web3.eth.defaultAccount = account.address;
export const eth = web3.eth;

// NEAR Network 配置 等同于ethers.js的signer, 如果src chain是Near需要配置
const keyStore: InMemoryKeyStore = new keyStores.InMemoryKeyStore();
const keyPair: KeyPair = KeyPair.fromString(process.env.NEAR_PRIVATE_KEY!);
keyStore.setKey('testnet', 'xyli.testnet', keyPair);
export const nearConfig = new NearNetworkConfig(
  'xyli.testnet',
  keyStore,
  NEAR_TEST_CHAIN.rpc!,
  'testnet'
);

// signer and providers
export const bscProvider = new ethers.providers.JsonRpcProvider(
  BSC_TEST_CHAIN.rpc,
  Number.parseInt(BSC_TEST_CHAIN.chainId)
);

export const maticProvider = new ethers.providers.JsonRpcProvider(
  POLYGON_TEST_CHAIN.rpc,
  Number.parseInt(POLYGON_TEST_CHAIN.chainId)
);

export const goerliProvider = new ethers.providers.JsonRpcProvider(
  ETH_GOERLI_CHAIN.rpc,
  Number.parseInt(ETH_GOERLI_CHAIN.chainId)
);

export const mapProvider = new ethers.providers.JsonRpcProvider(
  MAP_TEST_CHAIN.rpc,
  Number.parseInt(MAP_TEST_CHAIN.chainId)
);

export const bscSigner = new ethers.Wallet(
  process.env.EVM_PRIVATE_KEY!,
  bscProvider
);
export const maticSinger = new ethers.Wallet(
  process.env.EVM_PRIVATE_KEY!,
  maticProvider
);
export const mapSigner = new ethers.Wallet(
  process.env.EVM_PRIVATE_KEY!,
  mapProvider
);

export const goerliSigner = new ethers.Wallet(
  process.env.EVM_PRIVATE_KEY!,
  goerliProvider
);

export const provider: ButterJsonRpcProvider = {
  url: MAP_TEST_CHAIN.rpc!,
  chainId: 212,
};
