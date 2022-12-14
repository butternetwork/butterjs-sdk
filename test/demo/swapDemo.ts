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
  BSC_TEST_NATIVE,
  POLYGON_TEST_NATIVE,
  MAP_MAINNET_USDC,
  MAP_TEST_USDC,
  NEAR_TEST_NATIVE,
  NEAR_TEST_CHAIN,
  NEAR_TEST_USDC,
} from '../../src/constants';
import { ID_TO_SUPPORTED_TOKEN } from '../../src/utils/tokenUtil';
import {
  getBridgeFee,
  getVaultBalance,
  getTokenCandidates,
  getSwapFee,
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
} from '../../src/utils/requestUtils';
import { ButterSwap } from '../../src/core/swap/exchange';
import { BaseCurrency } from '../../src/entities';
import { approveToken } from '../../src/libs/allowance';
import axios from 'axios';
import { asciiToHex } from '../../src/utils';

require('dotenv/config');

const wnearToMaticUSDCRouteStr =
  '{"srcChain":[{"chainId":"5566818579631833089","amountIn":"1","amountOut":"6","path":[{"id":"1787","tokenIn":{"symbol":"wNear","icon":"","address":"wrap.testnet"},"tokenOut":{"symbol":"usdc","icon":"","address":"usdc.map007.testnet"}}],"dexName":"ref","tokenIn":{"address":"wrap.testnet","decimals":24,"symbol":"wNear","icon":""},"tokenOut":{"address":"usdc.map007.testnet","name":"USDC","decimals":6,"symbol":"USDC","icon":""}}],"mapChain":[{"chainId":"212","dexName":"","amountIn":"6","amountOut":"5.9","tokenIn":{"address":"0x424D3bcdC96F42aC919F276D7D4f6C94f24e0703","name":"map usdc","decimals":18,"symbol":"mUSDC","icon":""},"tokenOut":{"address":"0x424D3bcdC96F42aC919F276D7D4f6C94f24e0703","name":"map usdc","decimals":18,"symbol":"mUSDC","icon":""},"path":[]}],"targetChain":[{"chainId":"80001","dexName":"","amountIn":"5.9","amountOut":"5.9","tokenIn":{"address":"0x1E01CF4503808Fb30F17806035A87cf5A5217727","name":"PolygonUSD","decimals":18,"symbol":"PUSD","icon":""},"tokenOut":{"address":"0x1E01CF4503808Fb30F17806035A87cf5A5217727","name":"PolygonUSD","decimals":18,"symbol":"PUSD","icon":""},"path":[]}]}'; // web3.js config

const nearToMaticUSDCRouteStr =
  '{"srcChain":[{"chainId":"5566818579631833089","amountIn":"1","amountOut":"6","path":[{"id":"1787","tokenIn":{"symbol":"wNear","icon":"","address":"wrap.testnet"},"tokenOut":{"symbol":"usdc","icon":"","address":"usdc.map007.testnet"}}],"dexName":"ref","tokenIn":{"address":"0x0000000000000000000000000000000000000000","decimals":24,"symbol":"wNear","icon":""},"tokenOut":{"address":"usdc.map007.testnet","name":"USDC","decimals":6,"symbol":"USDC","icon":""}}],"mapChain":[{"chainId":"212","dexName":"","amountIn":"6","amountOut":"5.9","tokenIn":{"address":"0x424D3bcdC96F42aC919F276D7D4f6C94f24e0703","name":"map usdc","decimals":18,"symbol":"mUSDC","icon":""},"tokenOut":{"address":"0x424D3bcdC96F42aC919F276D7D4f6C94f24e0703","name":"map usdc","decimals":18,"symbol":"mUSDC","icon":""},"path":[]}],"targetChain":[{"chainId":"80001","dexName":"","amountIn":"5.9","amountOut":"5.9","tokenIn":{"address":"0x1E01CF4503808Fb30F17806035A87cf5A5217727","name":"PolygonUSD","decimals":18,"symbol":"PUSD","icon":""},"tokenOut":{"address":"0x1E01CF4503808Fb30F17806035A87cf5A5217727","name":"PolygonUSD","decimals":18,"symbol":"PUSD","icon":""},"path":[]}]}';

const bscBmosToWnear =
  '{"srcChain":[{"chainId":"97","amountIn":"1","amountOut":"1.002675181674282048","path":[{"id":"0x7Ca52dd9B883280F6c1EC5f648896c1fbD4f2408","tokenIn":{"symbol":"BMOS","icon":"","address":"0x593F6F6748dc203DFa636c299EeA6a39C0734EEd"},"tokenOut":{"symbol":"BUSD","icon":"","address":"0x3F1E91BFC874625f4ee6EF6D8668E79291882373"}}],"dexName":"Pancakeswap","tokenIn":{"address":"0x593F6F6748dc203DFa636c299EeA6a39C0734EEd","decimals":18,"symbol":"BMOS","icon":""},"tokenOut":{"address":"0x3F1E91BFC874625f4ee6EF6D8668E79291882373","name":"BUSD","decimals":18,"symbol":"BUSD","icon":""}}],"mapChain":[{"chainId":"212","dexName":"","amountIn":"1.002675181674282","amountOut":"0.902675181674282","tokenIn":{"address":"0x424D3bcdC96F42aC919F276D7D4f6C94f24e0703","name":"map usdc","decimals":18,"symbol":"mUSDC","icon":""},"tokenOut":{"address":"0x424D3bcdC96F42aC919F276D7D4f6C94f24e0703","name":"map usdc","decimals":18,"symbol":"mUSDC","icon":""},"path":[]}],"targetChain":[{"chainId":"5566818579631833089","amountIn":"0.902675","amountOut":"0.1404542455","path":[{"id":"1787","tokenIn":{"address":"usdc.map007.testnet","name":"","symbol":""},"tokenOut":{"address":"wrap.testnet","name":"Wrapped NEAR fungible token","symbol":"wNEAR","icon":"data:image/png;base64,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"}}],"dexName":"Ref.finance","tokenIn":{"address":"usdc.map007.testnet","name":"usdc.map007.testnet","decimals":6,"symbol":"USDC","icon":""},"tokenOut":{"address":"0x0000000000000000000000000000000000000000","name":"wrap.testnet","decimals":24,"symbol":"WNEAR","icon":""}}]}';
const bscusdToWnear =
  '{"srcChain":[{"chainId":"97","amountIn":"1","amountOut":"1","path":[],"dexName":"Pancakeswap","tokenIn":{"address":"0x3F1E91BFC874625f4ee6EF6D8668E79291882373","decimals":18,"symbol":"BMOS","icon":""},"tokenOut":{"address":"0x3F1E91BFC874625f4ee6EF6D8668E79291882373","name":"BUSD","decimals":18,"symbol":"BUSD","icon":""}}],"mapChain":[{"chainId":"212","dexName":"","amountIn":"1.002675181674282","amountOut":"0.902675181674282","tokenIn":{"address":"0x424D3bcdC96F42aC919F276D7D4f6C94f24e0703","name":"map usdc","decimals":18,"symbol":"mUSDC","icon":""},"tokenOut":{"address":"0x424D3bcdC96F42aC919F276D7D4f6C94f24e0703","name":"map usdc","decimals":18,"symbol":"mUSDC","icon":""},"path":[]}],"targetChain":[{"chainId":"5566818579631833089","amountIn":"0.902675","amountOut":"0.1404542455","path":[{"id":"1787","tokenIn":{"address":"usdc.map007.testnet","name":"","symbol":""},"tokenOut":{"address":"wrap.testnet","name":"Wrapped NEAR fungible token","symbol":"wNEAR","icon":"data:image/png;base64,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"}}],"dexName":"Ref.finance","tokenIn":{"address":"usdc.map007.testnet","name":"usdc.map007.testnet","decimals":6,"symbol":"USDC","icon":""},"tokenOut":{"address":"0x0000000000000000000000000000000000000000","name":"wrap.testnet","decimals":24,"symbol":"WNEAR","icon":""}}]}';
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
console.log('convert', asciiToHex('mos.map007.testnet', false));
async function demo() {
  console.log('start demo');

  const fromAddress = 'xyli.testnet';
  const toAddress = '0x8c9b3cAf7DedD3003f53312779c1b92ba1625D94';

  let signer;

  const fromToken = NEAR_TEST_NATIVE;
  const toToken = POLYGON_TEST_BMOS;
  const amount = ethers.utils.parseUnits('1', fromToken.decimals).toString();

  const fromChainId = fromToken.chainId;
  const toChainId = toToken.chainId;

  if (fromChainId === POLYGON_TEST_CHAIN.chainId) {
    signer = maticSinger;
  } else if (fromChainId === BSC_TEST_CHAIN.chainId) {
    signer = bscSigner;
  } else if (fromChainId === MAP_TEST_CHAIN.chainId) {
    signer = mapSigner;
  } else if (fromChainId === NEAR_TEST_CHAIN.chainId) {
    signer = mapSigner;
  } else {
    throw new Error('chain id not supported' + fromChainId);
  }
  const provider: ButterJsonRpcProvider = {
    url: 'https://testnet-rpc.maplabs.io',
    chainId: 212,
  };
  let routeStr =
    '{"srcChain":[{"chainId":"5566818579631833089","amountIn":"1","amountOut":"6.012210","path":[{"id":"1787","tokenIn":{"address":"wrap.testnet","name":"Wrapped NEAR fungible token","symbol":"wNEAR","icon":"data:image/png;base64,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"},"tokenOut":{"address":"usdc.map007.testnet","name":"","symbol":""}}],"dexName":"Ref.finance","tokenIn":{"address":"0x0000000000000000000000000000000000000000","name":"wrap.testnet","decimals":24,"symbol":"NEAR","icon":""},"tokenOut":{"address":"usdc.map007.testnet","name":"usdc.map007.testnet","decimals":6,"symbol":"USDC","icon":""}}],"mapChain":[{"chainId":"212","dexName":"","amountIn":"6.01221","amountOut":"6.01221","tokenIn":{"address":"0x424D3bcdC96F42aC919F276D7D4f6C94f24e0703","name":"map usdc","decimals":18,"symbol":"mUSDC","icon":""},"tokenOut":{"address":"0x424D3bcdC96F42aC919F276D7D4f6C94f24e0703","name":"map usdc","decimals":18,"symbol":"mUSDC","icon":""},"path":[]}],"targetChain":[{"chainId":"80001","amountIn":"6.01221","amountOut":"0","path":[{"id":"0x60004720A9edeD2795A7429B11Dd8BcCE1A2358e","tokenIn":{"name":"PolygonUSD","symbol":"PUSD","icon":"","address":"0x1E01CF4503808Fb30F17806035A87cf5A5217727"},"tokenOut":{"name":"Wrapped MATIC","symbol":"WMATIC","icon":"","address":"0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889"}}],"dexName":"Quickswap","tokenIn":{"address":"0x1E01CF4503808Fb30F17806035A87cf5A5217727","name":"PolygonUSD","decimals":18,"symbol":"PUSD","icon":""},"tokenOut":{"address":"0x0000000000000000000000000000000000000000","decimals":18,"symbol":"MATIC","icon":""}}]}';
  // get best route
  const requestUrl =
    `http://54.255.196.147:9009/router/best_route?fromChainId=${fromChainId}&toChainId=${toChainId}&amountIn=` +
    `${ethers.utils.formatUnits(amount, fromToken.decimals)}&` +
    `tokenInAddress=${fromToken.address}&` +
    `tokenInDecimal=${fromToken.decimals}&` +
    `tokenInSymbol=${fromToken.symbol}&` +
    `tokenOutAddress=${toToken.address}&` +
    `tokenOutDecimal=${toToken.decimals}&` +
    `tokenOutSymbol=${toToken.symbol}`;
  console.log(requestUrl);
  await axios.get(requestUrl).then(function (response) {
    routeStr = JSON.stringify(response.data);
  });
  // routeStr = bscBmosToWnear;
  console.log(
    'swap fee',
    await getSwapFee(fromToken, toChainId, amount, routeStr, provider)
  );
  // 当源链路径的path不为空，授权这个地址
  const routerAddress = BUTTER_ROUTER_ADDRESS_SET[ID_TO_CHAIN_ID(fromChainId)];

  // 当源链路径的path为空，授权这个地址
  const mosAddress = MOS_CONTRACT_ADDRESS_SET[ID_TO_CHAIN_ID(fromChainId)];
  // if (!fromToken.isNative) {
  //   await approveToken(signer, fromToken, amount, mosAddress, true);
  // }

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
    options: { signerOrProvider: signer, nearProvider: nearConfig },
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
    options: {
      signerOrProvider: signer,
      gas: estimatedGas,
      nearProvider: nearConfig,
    },
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
