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
  assembleNearSwapMsgFromRoute,
} from '../../src/utils/requestUtils';
import { ButterSwap } from '../../src/core/swap/exchange';
import { BaseCurrency } from '../../src/entities';
import { approveToken } from '../../src/libs/allowance';
import axios from 'axios';
import { asciiToHex } from '../../src/utils';

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

async function demo() {
  console.log('start demo');
  const fromAddress = '0x8c9b3cAf7DedD3003f53312779c1b92ba1625D94';
  const toAddress = '0x8c9b3cAf7DedD3003f53312779c1b92ba1625D94';

  let signer;

  const fromToken = BSC_TEST_USDC;
  const toToken = POLYGON_TEST_BMOS;
  const amount = ethers.utils.parseEther('1').toString();

  const fromChainId = fromToken.chainId;
  const toChainId = toToken.chainId;

  if (fromChainId === POLYGON_TEST_CHAIN.chainId) {
    signer = maticSinger;
  } else if (fromChainId === BSC_TEST_CHAIN.chainId) {
    signer = bscSigner;
  } else {
    throw new Error('chain id not supported');
  }

  const provider: ButterJsonRpcProvider = {
    url: 'https://testnet-rpc.maplabs.io',
    chainId: 212,
  };
  let routeStr = '';
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

  console.log(
    'swap fee',
    await getSwapFee(fromToken, toChainId, amount, routeStr, provider)
  );

  if (!fromToken.isNative) {
    await approveToken(
      signer,
      fromToken,
      '100',
      MOS_CONTRACT_ADDRESS_SET[ID_TO_CHAIN_ID(fromChainId)],
      true
    );
  }

  console.log('approved');

  // gas estimation
  const swap: ButterSwap = new ButterSwap();
  // 当源链路径的path不为空，授权这个地址
  const routerAddress = BUTTER_ROUTER_ADDRESS_SET[ID_TO_CHAIN_ID(fromChainId)];

  // 当源链路径的path为空，授权这个地址
  const mosAddress = MOS_CONTRACT_ADDRESS_SET[ID_TO_CHAIN_ID(fromChainId)];

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
    options: { signerOrProvider: signer, gas: adjustedGas },
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
