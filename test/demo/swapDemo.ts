import { BigNumber, ethers } from 'ethers';
import { InMemoryKeyStore } from 'near-api-js/lib/key_stores';
import { connect, KeyPair, keyStores, WalletConnection } from 'near-api-js';
import {
  BridgeRequestParam,
  ButterCrossChainRoute,
  NearNetworkConfig,
} from '../../src/types';
import {
  BSC_TEST_CHAIN,
  ChainId,
  MAP_MAINNET_CHAIN,
  MAP_TEST_CHAIN,
  MAP_TEST_MOST,
  POLYGON_TEST_MOST,
  POLYGON_MAINNET_USDC,
  POLYGON_TEST_CHAIN,
  SUPPORTED_CHAIN_LIST,
  POLYGON_TEST_BMOS,
  POLYGON_TEST_USDC,
  BSC_TEST_MOST,
  BSC_TEST_BMOS,
  NEAR_TEST_WNEAR,
} from '../../src/constants';
import { ID_TO_SUPPORTED_TOKEN } from '../../src/utils/tokenUtil';
import {
  getBridgeFee,
  getVaultBalance,
  getTokenCandidates,
} from '../../src/core/tools/dataFetch';
import {
  ButterFee,
  ButterTransactionReceipt,
  ButterTransactionResponse,
  VaultBalance,
} from '../../src/types/responseTypes';
import { ButterBridge } from '../../src';
import Web3 from 'web3';
import { ButterJsonRpcProvider } from '../../src/types/paramTypes';
import {
  assembleCrossChainRouteFromJson,
  assembleTargetSwapDataFromRoute,
} from '../../src/utils/requestUtils';
require('dotenv/config');

// web3.js config
const web3 = new Web3(
  'https://testnet-rpc.maplabs.io'
  // 'https://rpc.ankr.com/bsc_testnet_chapel/9a12629301614050e76136dcaf9627f5ef215f86fb1185d908f9d232b8530ef7'
);
const account = web3.eth.accounts.privateKeyToAccount(
  '0x' + process.env.EVM_PRIVATE_KEY
);

web3.eth.accounts.wallet.add(account);
web3.eth.defaultAccount = account.address;

// NEAR Network 配置 等同于ethers.js的signer, 如果src chain是Near需要配置
const keyStore: InMemoryKeyStore = new keyStores.InMemoryKeyStore();
const keyPair: KeyPair = KeyPair.fromString(process.env.NEAR_PRIVATE_KEY!);
keyStore.setKey('testnet', 'xyli.testnet', keyPair);
const nearConfig = new NearNetworkConfig(
  'xyli.testnet',
  keyStore,
  'https://rpc.testnet.near.org',
  'testnet'
);

// signer and providers
const bscProvider = new ethers.providers.JsonRpcProvider(
  BSC_TEST_CHAIN.rpc,
  Number.parseInt(BSC_TEST_CHAIN.chainId)
);

const maticProvider = new ethers.providers.JsonRpcProvider(
  POLYGON_TEST_CHAIN.rpc,
  Number.parseInt(POLYGON_TEST_CHAIN.chainId)
);
const bscSigner = new ethers.Wallet(process.env.EVM_PRIVATE_KEY!, bscProvider);
const maticSinger = new ethers.Wallet(
  process.env.EVM_PRIVATE_KEY!,
  maticProvider
);

const mapProvider = new ethers.providers.JsonRpcProvider(
  MAP_TEST_CHAIN.rpc,
  Number.parseInt(MAP_TEST_CHAIN.chainId)
);
const mapSigner = new ethers.Wallet(process.env.EVM_PRIVATE_KEY!, mapProvider);

/** 下面假设我们要从将MOST代币从BSC链Bridge到NEAR链从而获得NEAR上的MOST代币
 *  整个过程需要3个接口
 *    1. getBridgeFee
 *    2. getVaultBalance
 *    3. bridgeToken
 *  */
// function test(): PromiEvent<TransactionReceipt> {
//   return web3.eth.sendTransaction({
//     from: '0x8c9b3cAf7DedD3003f53312779c1b92ba1625D94',
//     to: '0xCBdb1Da4f99276b0c427776BDE93838Bc19386Cc',
//     value: '10000000',
//     gas: '5000000',
//     gasPrice: '100',
//   });
// }

let jsonStr =
  '{"srcChain":[{"chainId":"56","amountIn":"1000","amountOut":"254892.835377783497158858","path":[{"tokenIn":{"icon":"https://files.mapprotocol.io/bridge/bnb.png","address":"0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c"},"tokenOut":{"symbol":"USDC","icon":"https://files.mapprotocol.io/bridge/usdc.png","address":"0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d"}}],"dexName":"PANCAKESWAP","tokenIn":{"address":"0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c","decimals":18,"icon":"https://files.mapprotocol.io/bridge/bnb.png"},"tokenOut":{"address":"0x9f722b2cb30093f766221Fd0d37964949ed66918","name":"USDC","decimals":18,"symbol":"Mapped USD Coin","icon":"https://files.mapprotocol.io/bridge/usdc.png"}}],"mapChain":[{"chainId":"22776","dexName":"HIVESWAP","amountIn":"","amountOut":"","tokenIn":{"address":"0x9f722b2cb30093f766221Fd0d37964949ed66918","name":"USDC","decimals":18,"symbol":"Mapped USD Coin","icon":"https://files.mapprotocol.io/bridge/usdc.png"},"tokenOut":{"address":"0x9f722b2cb30093f766221Fd0d37964949ed66918","name":"USDC","decimals":18,"symbol":"Mapped USD Coin","icon":"https://files.mapprotocol.io/bridge/usdc.png"},"path":[]}],"targetChain":[{"chainId":"1313161554","amountIn":"254892.835378","amountOut":"139309","path":[{"tokenIn":{"address":"a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.factory.bridge.near","name":"USD Coin","symbol":"USDC.e","icon":"data:image/svg+xml,%3Csvg width=\'32\' height=\'32\' viewBox=\'0 0 32 32\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\'%3E%3Ccircle cx=\'16\' cy=\'16\' r=\'16\' fill=\'%232775C9\'/%3E%3Cpath d=\'M15.75 27.5C9.26 27.5 4 22.24 4 15.75S9.26 4 15.75 4 27.5 9.26 27.5 15.75A11.75 11.75 0 0115.75 27.5zm-.7-16.11a2.58 2.58 0 00-2.45 2.47c0 1.21.74 2 2.31 2.33l1.1.26c1.07.25 1.51.61 1.51 1.22s-.77 1.21-1.77 1.21a1.9 1.9 0 01-1.8-.91.68.68 0 00-.61-.39h-.59a.35.35 0 00-.28.41 2.73 2.73 0 002.61 2.08v.84a.705.705 0 001.41 0v-.85a2.62 2.62 0 002.59-2.58c0-1.27-.73-2-2.46-2.37l-1-.22c-1-.25-1.47-.58-1.47-1.14 0-.56.6-1.18 1.6-1.18a1.64 1.64 0 011.59.81.8.8 0 00.72.46h.47a.42.42 0 00.31-.5 2.65 2.65 0 00-2.38-2v-.69a.705.705 0 00-1.41 0v.74zm-8.11 4.36a8.79 8.79 0 006 8.33h.14a.45.45 0 00.45-.45v-.21a.94.94 0 00-.58-.87 7.36 7.36 0 010-13.65.93.93 0 00.58-.86v-.23a.42.42 0 00-.56-.4 8.79 8.79 0 00-6.03 8.34zm17.62 0a8.79 8.79 0 00-6-8.32h-.15a.47.47 0 00-.47.47v.15a1 1 0 00.61.9 7.36 7.36 0 010 13.64 1 1 0 00-.6.89v.17a.47.47 0 00.62.44 8.79 8.79 0 005.99-8.34z\' fill=\'%23FFF\'/%3E%3C/g%3E%3C/svg%3E"},"tokenOut":{"address":"dac17f958d2ee523a2206206994597c13d831ec7.factory.bridge.near","name":"Tether USD","symbol":"USDT.e","icon":"data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'32\' height=\'32\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Ccircle cx=\'16\' cy=\'16\' r=\'16\' fill=\'%2326A17B\'/%3E%3Cpath fill=\'%23FFF\' d=\'M17.922 17.383v-.002c-.11.008-.677.042-1.942.042-1.01 0-1.721-.03-1.971-.042v.003c-3.888-.171-6.79-.848-6.79-1.658 0-.809 2.902-1.486 6.79-1.66v2.644c.254.018.982.061 1.988.061 1.207 0 1.812-.05 1.925-.06v-2.643c3.88.173 6.775.85 6.775 1.658 0 .81-2.895 1.485-6.775 1.657m0-3.59v-2.366h5.414V7.819H8.595v3.608h5.414v2.365c-4.4.202-7.709 1.074-7.709 2.118 0 1.044 3.309 1.915 7.709 2.118v7.582h3.913v-7.584c4.393-.202 7.694-1.073 7.694-2.116 0-1.043-3.301-1.914-7.694-2.117\'/%3E%3C/g%3E%3C/svg%3E"}},{"tokenIn":{"address":"dac17f958d2ee523a2206206994597c13d831ec7.factory.bridge.near","name":"Tether USD","symbol":"USDT.e","icon":"data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'32\' height=\'32\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Ccircle cx=\'16\' cy=\'16\' r=\'16\' fill=\'%2326A17B\'/%3E%3Cpath fill=\'%23FFF\' d=\'M17.922 17.383v-.002c-.11.008-.677.042-1.942.042-1.01 0-1.721-.03-1.971-.042v.003c-3.888-.171-6.79-.848-6.79-1.658 0-.809 2.902-1.486 6.79-1.66v2.644c.254.018.982.061 1.988.061 1.207 0 1.812-.05 1.925-.06v-2.643c3.88.173 6.775.85 6.775 1.658 0 .81-2.895 1.485-6.775 1.657m0-3.59v-2.366h5.414V7.819H8.595v3.608h5.414v2.365c-4.4.202-7.709 1.074-7.709 2.118 0 1.044 3.309 1.915 7.709 2.118v7.582h3.913v-7.584c4.393-.202 7.694-1.073 7.694-2.116 0-1.043-3.301-1.914-7.694-2.117\'/%3E%3C/g%3E%3C/svg%3E"},"tokenOut":{"address":"wrap.near","name":"Wrapped NEAR fungible token","symbol":"wNEAR","icon":"data:image/png;base64,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"}}],"dexName":"REF","tokenIn":{"address":"0x9f722b2cb30093f766221Fd0d37964949ed66918","name":"USDC","decimals":18,"symbol":"Mapped USD Coin","icon":"https://files.mapprotocol.io/bridge/usdc.png"},"tokenOut":{"address":"0x0000000000000000000000000000000000000000","name":"wrap.near","decimals":6,"icon":"https://cryptologos.cc/logos/near-protocol-near-logo.png"}}]}';

async function demo() {
  console.log('start demo');

  const fromAddress = '0x8c9b3cAf7DedD3003f53312779c1b92ba1625D94';
  const toAddress = '0x8c9b3cAf7DedD3003f53312779c1b92ba1625D94';

  const fromChainId = ChainId.NEAR_MAINNET;
  const toChainId = ChainId.BSC_TEST;

  const fromToken = POLYGON_TEST_USDC;
  const toToken = POLYGON_TEST_MOST;

  const amount = ethers.utils.parseEther('1').toString();

  // const provider: ButterJsonRpcProvider = {
  //   url: 'https://testnet-rpc.maplabs.io',
  //   chainId: 212,
  // };

  const provider: ButterJsonRpcProvider = {
    url: 'https://testnet-rpc.maplabs.io',
    chainId: 212,
  };
  const route: ButterCrossChainRoute = assembleCrossChainRouteFromJson(jsonStr);
  const swapData = await assembleTargetSwapDataFromRoute(route, toToken);
  console.log(swapData);
}

demo()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
