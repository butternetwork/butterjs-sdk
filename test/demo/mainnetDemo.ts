import { BigNumber, ethers } from 'ethers';
import { InMemoryKeyStore } from 'near-api-js/lib/key_stores';
import { connect, KeyPair, keyStores, WalletConnection } from 'near-api-js';
import { BridgeRequestParam, NearNetworkConfig } from '../../src/types';
import {
  BSC_MAINNET_CHAIN,
  ChainId,
  MAP_MAINNET_CHAIN,
  POLYGON_MAINNET_USDC,
  POLYGON_MAINNET_CHAIN,
  SUPPORTED_CHAIN_LIST_MAINNET,
  MOS_CONTRACT_ADDRESS_SET,
  BSC_MAINNET_USDC,
  NEAR_MAINNET_CHAIN,
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
import { approveToken } from '../../src/libs/allowance';
import { verifyNearAccountId } from '../../src/utils';
require('dotenv/config');

// web3.js config
const web3 = new Web3(
  'https://testnet-rpc.maplabs.io'
  // 'https://rpc.ankr.com/bsc_testnet_chapel/9a12629301614050e76136dcaf9627f5ef215f86fb1185d908f9d232b8530ef7'
);
const account = web3.eth.accounts.privateKeyToAccount(
  '0x' + process.env.EVM_MAINNET
);

web3.eth.accounts.wallet.add(account);
web3.eth.defaultAccount = account.address;

// NEAR Network 配置 等同于ethers.js的signer, 如果src chain是Near需要配置
const keyStore: InMemoryKeyStore = new keyStores.InMemoryKeyStore();
const keyPair: KeyPair = KeyPair.fromString(process.env.NEAR_PRIVATE_KEY!);
keyStore.setKey('testnet', 'xyli.testnet', keyPair);
const nearConfig = new NearNetworkConfig(
  'xyli.near',
  keyStore,
  'https://rpc.near.org',
  'mainnet'
);

// signer and providers
const bscProvider = new ethers.providers.JsonRpcProvider(
  BSC_MAINNET_CHAIN.rpc,
  Number.parseInt(BSC_MAINNET_CHAIN.chainId)
);

const maticProvider = new ethers.providers.JsonRpcProvider(
  POLYGON_MAINNET_CHAIN.rpc,
  Number.parseInt(POLYGON_MAINNET_CHAIN.chainId)
);

const bscSigner = new ethers.Wallet(process.env.EVM_MAINNET!, bscProvider);
const maticSinger = new ethers.Wallet(process.env.EVM_MAINNET!, maticProvider);

const mapProvider = new ethers.providers.JsonRpcProvider(
  MAP_MAINNET_CHAIN.rpc,
  Number.parseInt(MAP_MAINNET_CHAIN.chainId)
);
const mapSigner = new ethers.Wallet(process.env.EVM_MAINNET!, mapProvider);

/** 支持的链 {@link ChainId} 调试中仅支持MAP测试网，BSC测试，和Near测试网**/
console.log('supported chain', SUPPORTED_CHAIN_LIST_MAINNET);
/** 支持的token {@link supported_token.ts} **/
console.log(
  'supported token by chainId',
  ID_TO_SUPPORTED_TOKEN(ChainId.BSC_MAINNET)
);

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

async function demo() {
  console.log('start demo');
  console.log(
    'verify account!',
    await verifyNearAccountId('xyli.near', NEAR_MAINNET_CHAIN.chainId)
  );
  const fromAddress = '0x8c9b3cAf7DedD3003f53312779c1b92ba1625D94';
  const toAddress = '0x8c9b3cAf7DedD3003f53312779c1b92ba1625D94';

  const fromToken = BSC_MAINNET_USDC;
  const toChainId = POLYGON_MAINNET_USDC.chainId;
  const fromChainId = fromToken.chainId;

  const amount = ethers.utils.parseUnits('1', fromToken.decimals).toString();

  // const provider: ButterJsonRpcProvider = {
  //   url: 'https://testnet-rpc.maplabs.io',
  //   chainId: 212,
  // };

  const provider: ButterJsonRpcProvider = {
    url: MAP_MAINNET_CHAIN.rpc,
    chainId: parseInt(MAP_MAINNET_CHAIN.chainId),
  };

  // 2. 获取目标链的vault余额， 如果用户提供的数额大于余额应提示用户
  const balance: VaultBalance = await getVaultBalance(
    fromChainId,
    fromToken,
    toChainId,
    provider
  );
  console.log('vault balance', balance);
  // 获取token 从bsc链可以bridge到near链的token列表
  const tokenCandidates = await getTokenCandidates(
    fromChainId,
    toChainId,
    provider
  );
  console.log('token candidates', tokenCandidates);

  // 1. 获取费用信息
  const fee: ButterFee = await getBridgeFee(
    fromToken,
    toChainId,
    amount,
    provider
  );
  console.log('bridge fee', fee);

  // 3. Bridge(先estimate gas)
  console.log('gas estimate');
  const bridge: ButterBridge = new ButterBridge();
  const request: BridgeRequestParam = {
    fromAddress: fromAddress,
    fromToken: fromToken,
    fromChainId: fromChainId,
    toChainId: toChainId,
    toAddress: toAddress,
    amount: amount,
    options: { signerOrProvider: maticSinger },
  };
  const estimatedGas: string = await bridge.gasEstimateBridgeToken(request);

  console.log('gas', estimatedGas);
  const adjustedGas = Math.floor(
    Number.parseFloat(estimatedGas) * 1.2
  ).toString();

  // 3. Bridge(真正的Bridge)
  const bridgeRequest: BridgeRequestParam = {
    fromAddress: fromAddress,
    fromToken: fromToken,
    fromChainId: fromChainId,
    toChainId: toChainId,
    toAddress: toAddress,
    amount: amount,
    options: {
      nearProvider: nearConfig,
      signerOrProvider: maticSinger,
      // gas: '100000000000000',
      gas: adjustedGas,
    },
  };

  // const response: ButterTransactionResponse = await bridge.bridgeToken(
  //   bridgeRequest
  // );
  // const receipt: ButterTransactionReceipt = await response.wait!();
  // console.log('receipt', receipt);
}

demo()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
