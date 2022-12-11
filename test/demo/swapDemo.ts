import { BigNumber, ethers } from 'ethers';
import { InMemoryKeyStore } from 'near-api-js/lib/key_stores';
import { connect, KeyPair, keyStores, WalletConnection } from 'near-api-js';
import {
  BridgeRequestParam,
  ButterCrossChainRoute,
  NearNetworkConfig,
  SwapOptions,
  SwapRequestParam,
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
  BSC_TEST_USDC,
  MOS_CONTRACT_ADDRESS_SET,
  BUTTER_ROUTER_ADDRESS_SET,
  ID_TO_CHAIN_ID,
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
  assembleButterRouterParamFromRoute,
  assembleCrossChainRouteFromJson,
  assembleTargetSwapDataFromRoute,
} from '../../src/utils/requestUtils';
import { ButterSwap } from '../../src/core/swap/exchange';
import { BaseCurrency } from '../../src/entities';
import { approveToken } from '../../src/libs/allowance';
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

// let jsonStr =
//   '{"srcChain":[{"chainId":"97","amountIn":"1.5","amountOut":"1.2","path":[{"tokenIn":{"icon":"https://files.mapprotocol.io/bridge/bnb.png","address":"0x593F6F6748dc203DFa636c299EeA6a39C0734EEd"},"tokenOut":{"symbol":"USDC","icon":"https://files.mapprotocol.io/bridge/usdc.png","address":"0x3F1E91BFC874625f4ee6EF6D8668E79291882373"}}],"dexName":"PANCAKESWAP","tokenIn":{"address":"0x593F6F6748dc203DFa636c299EeA6a39C0734EEd","decimals":18,"icon":"https://files.mapprotocol.io/bridge/bnb.png"},"tokenOut":{"address":"0x3F1E91BFC874625f4ee6EF6D8668E79291882373","name":"USDC","decimals":18,"symbol":"Mapped USD Coin","icon":"https://files.mapprotocol.io/bridge/usdc.png"}}],"mapChain":[{"chainId":"22776","dexName":"HIVESWAP","amountIn":"","amountOut":"","tokenIn":{"address":"0x6Ac66dCBE1680aAC446B28BE5371Be869B5059cF","name":"USDC","decimals":18,"symbol":"Mapped USD Coin","icon":"https://files.mapprotocol.io/bridge/usdc.png"},"tokenOut":{"address":"0x6Ac66dCBE1680aAC446B28BE5371Be869B5059cF","name":"USDC","decimals":18,"symbol":"Mapped USD Coin","icon":"https://files.mapprotocol.io/bridge/usdc.png"},"path":[]}],"targetChain":[{"chainId":"80001","amountIn":"1","amountOut":"0.8","path":[{"tokenIn":{"address":"0x1E01CF4503808Fb30F17806035A87cf5A5217727","name":"USD Coin","symbol":"USDC.e","icon":""},"tokenOut":{"address":"0xe1D8eAB4e616156E11e1c59D1a0E0EFeD66f4cfa","name":"BMOS","symbol":"BMOS","icon":""}}],"dexName":"REF","tokenIn":{"address":"0x1E01CF4503808Fb30F17806035A87cf5A5217727","name":"USDC","decimals":18,"symbol":"Mapped USD Coin","icon":"https://files.mapprotocol.io/bridge/usdc.png"},"tokenOut":{"address":"0xe1D8eAB4e616156E11e1c59D1a0E0EFeD66f4cfa","name":"wrap.near","decimals":18,"icon":"https://cryptologos.cc/logos/near-protocol-near-logo.png"}}]}';
const bscSwap2matic =
  '{"srcChain":[{"chainId":"97","amountIn":"1","amountOut":"1","path":[{"id":"0x7Ca52dd9B883280F6c1EC5f648896c1fbD4f2408","tokenIn":{"symbol":"WMOS","icon":"","address":"0x593F6F6748dc203DFa636c299EeA6a39C0734EEd"},"tokenOut":{"symbol":"BUSD","icon":"","address":"0x3F1E91BFC874625f4ee6EF6D8668E79291882373"}}],"dexName":"Pancakeswap","tokenIn":{"address":"0x593F6F6748dc203DFa636c299EeA6a39C0734EEd","decimals":18,"symbol":"WMOS","icon":""},"tokenOut":{"address":"0x3F1E91BFC874625f4ee6EF6D8668E79291882373","name":"BUSD","decimals":18,"symbol":"BUSD","icon":""}}],"mapChain":[{"chainId":"212","dexName":"","amountIn":"1","amountOut":"1","tokenIn":{"address":"0x5F91a91DBa041073858E1e2236605C4Db2F5488C","name":"map usdc","decimals":18,"symbol":"mUSDC","icon":""},"tokenOut":{"address":"0x5F91a91DBa041073858E1e2236605C4Db2F5488C","name":"map usdc","decimals":18,"symbol":"mUSDC","icon":""},"path":[]}],"targetChain":[{"chainId":"80001","dexName":"","amountIn":"1","amountOut":"1","tokenIn":{"address":"0x1E01CF4503808Fb30F17806035A87cf5A5217727","name":"PolygonUSD","decimals":18,"symbol":"PUSD","icon":""},"tokenOut":{"address":"0x1E01CF4503808Fb30F17806035A87cf5A5217727","name":"PolygonUSD","decimals":18,"symbol":"PUSD","icon":""},"path":[]}]}';
const bscSwap2maticSwap =
  '{"srcChain":[{"chainId":"97","amountIn":"1","amountOut":"1","path":[{"id":"0x7Ca52dd9B883280F6c1EC5f648896c1fbD4f2408","tokenIn":{"symbol":"WMOS","icon":"","address":"0x593F6F6748dc203DFa636c299EeA6a39C0734EEd"},"tokenOut":{"symbol":"BUSD","icon":"","address":"0x3F1E91BFC874625f4ee6EF6D8668E79291882373"}}],"dexName":"Pancakeswap","tokenIn":{"address":"0x593F6F6748dc203DFa636c299EeA6a39C0734EEd","decimals":18,"symbol":"WMOS","icon":""},"tokenOut":{"address":"0x3F1E91BFC874625f4ee6EF6D8668E79291882373","name":"BUSD","decimals":18,"symbol":"BUSD","icon":""}}],"mapChain":[{"chainId":"212","dexName":"","amountIn":"1","amountOut":"1","tokenIn":{"address":"0x5F91a91DBa041073858E1e2236605C4Db2F5488C","name":"map usdc","decimals":18,"symbol":"mUSDC","icon":""},"tokenOut":{"address":"0x5F91a91DBa041073858E1e2236605C4Db2F5488C","name":"map usdc","decimals":18,"symbol":"mUSDC","icon":""},"path":[]}],"targetChain":[{"chainId":"80001","amountIn":"1","amountOut":"-0.000496904054139972","path":[{"id":"0x23C7dA39924Da6CAE645912884306e95A494Aac1","tokenIn":{"name":"PolygonUSD","symbol":"PUSD","icon":"","address":"0x1E01CF4503808Fb30F17806035A87cf5A5217727"},"tokenOut":{"symbol":"PMOS","icon":"","address":"0xe1D8eAB4e616156E11e1c59D1a0E0EFeD66f4cfa"}}],"dexName":"Quickswap","tokenIn":{"address":"0x1E01CF4503808Fb30F17806035A87cf5A5217727","name":"PolygonUSD","decimals":18,"symbol":"PUSD","icon":""},"tokenOut":{"address":"0xe1D8eAB4e616156E11e1c59D1a0E0EFeD66f4cfa","decimals":18,"symbol":"PUSD","icon":""}}]}';

const bsc2maticSwap = '';
const noswapstr =
  '{"srcChain":[],"mapChain":[{"chainId":"212","dexName":"","amountIn":"0","amountOut":"0","tokenIn":{"address":"0x5F91a91DBa041073858E1e2236605C4Db2F5488C","name":"map usdc","decimals":18,"symbol":"mUSDC","icon":""},"tokenOut":{"address":"0x5F91a91DBa041073858E1e2236605C4Db2F5488C","name":"map usdc","decimals":18,"symbol":"mUSDC","icon":""},"path":[]}],"targetChain":[]}';

let routeStr = bscSwap2matic;

async function demo() {
  console.log('start demo');
  const fromAddress = '0x8c9b3cAf7DedD3003f53312779c1b92ba1625D94';
  const toAddress = '0x8c9b3cAf7DedD3003f53312779c1b92ba1625D94';

  const signer = bscSigner;
  const fromChainId = ChainId.BSC_TEST;
  const toChainId = ChainId.POLYGON_TEST;

  const fromToken = BSC_TEST_BMOS;
  const toToken = POLYGON_TEST_USDC;

  const amount = ethers.utils.parseEther('1').toString();

  const provider: ButterJsonRpcProvider = {
    url: 'https://testnet-rpc.maplabs.io',
    chainId: 212,
  };

  await approveToken(
    signer,
    fromToken,
    '100',
    BUTTER_ROUTER_ADDRESS_SET[ID_TO_CHAIN_ID(fromChainId)],
    true
  );
  console.log('approved');
  // gas estimation
  const swap: ButterSwap = new ButterSwap();

  const request: SwapRequestParam = {
    fromAddress,
    fromToken,
    toAddress,
    toToken,
    amountIn: amount,
    swapRouteStr: routeStr,
    options: { signerOrProvider: signer },
  };

  const estimatedGas: string = await swap.gasEstimateSwap(request);

  console.log('gas', estimatedGas);
  const adjustedGas = Math.floor(
    Number.parseFloat(estimatedGas) * 1.2
  ).toString();

  // swap action
  const swapRequestParam: SwapRequestParam = {
    fromAddress,
    fromToken,
    toAddress,
    toToken,
    amountIn: amount,
    swapRouteStr: routeStr,
    options: { signerOrProvider: signer, gas: '1000000' },
  };
  const response: ButterTransactionResponse = await swap.swap(swapRequestParam);
  const receipt: ButterTransactionReceipt = await response.wait!();
  console.log('receipt', receipt);
}

demo()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
