import { BigNumber, ethers } from 'ethers';
import { InMemoryKeyStore } from 'near-api-js/lib/key_stores';
import { connect, KeyPair, keyStores, WalletConnection } from 'near-api-js';
import { BridgeRequestParam, NearNetworkConfig } from '../../src/types';
import { PromiEvent, TransactionReceipt } from 'web3-core';
import {
  BSC_TEST_CHAIN,
  BSC_TEST_MAP,
  BSC_TEST_MOST,
  BSC_TEST_NATIVE,
  BSC_TEST_NEAR,
  BSC_TEST_WBNB,
  ChainId,
  ETH_PRIV_NEAR,
  ID_TO_CHAIN_ID,
  MAP_TEST_BNB,
  MAP_TEST_CHAIN,
  MAP_TEST_MOST,
  MAP_TEST_NATIVE,
  MAP_TEST_WMAP,
  MOS_CONTRACT_ADDRESS_SET,
  NEAR_TEST_CHAIN,
  NEAR_TEST_MOST,
  NEAR_TEST_NATIVE,
  SUPPORTED_CHAIN_LIST,
} from '../../src/constants';
import { ID_TO_SUPPORTED_TOKEN } from '../../src/utils/tokenUtil';
import {
  getBridgeFee,
  getVaultBalance,
  getTokenCandidates,
  isTokenMintable,
  getDistributeRate,
} from '../../src/core/tools/dataFetch';
import {
  ButterFee,
  ButterTransactionReceipt,
  ButterTransactionResponse,
  VaultBalance,
} from '../../src/types/responseTypes';
import { ButterBridge } from '../../src';
import { approveToken } from '../../src/libs/allowance';
import Web3 from 'web3';
import { JsonRpcProvider } from 'near-api-js/lib/providers';
import { ButterJsonRpcProvider } from '../../src/types/paramTypes';
import { BaseCurrency } from '../../src/entities';
import { WebsocketProvider } from 'web3-core';
import { Contract } from 'web3-eth-contract';
import { parseNearAmount } from 'near-api-js/lib/utils/format';
import { asciiToHex, verifyNearAccountId } from '../../src/utils';
import BN from 'bn.js';
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
const bscSigner = new ethers.Wallet(process.env.EVM_PRIVATE_KEY!, bscProvider);

const mapProvider = new ethers.providers.JsonRpcProvider(
  MAP_TEST_CHAIN.rpc,
  Number.parseInt(MAP_TEST_CHAIN.chainId)
);
const mapSigner = new ethers.Wallet(process.env.EVM_PRIVATE_KEY!, mapProvider);

/** 支持的链 {@link ChainId} 调试中仅支持MAP测试网，BSC测试，和Near测试网**/
console.log('supported chain', SUPPORTED_CHAIN_LIST);
/** 支持的token {@link supported_token.ts} **/
console.log(
  'supported token by chainId',
  ID_TO_SUPPORTED_TOKEN(ChainId.NEAR_TESTNET)
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

  const provider: ButterJsonRpcProvider = {
    url: 'https://testnet-rpc.maplabs.io',
    chainId: 212,
  };

  // 获取token 从bsc链可以bridge到near链的token列表
  const tokenCandidates = await getTokenCandidates(
    ChainId.BSC_TEST,
    ChainId.NEAR_TESTNET,
    {
      url: 'https://testnet-rpc.maplabs.io',
      chainId: 212,
    }
  );
  console.log('token candidates', tokenCandidates);

  // 1. 获取费用信息
  const fee: ButterFee = await getBridgeFee(
    BSC_TEST_MOST,
    ChainId.NEAR_TESTNET,
    ethers.utils.parseEther('1').toString(),
    provider
  );
  console.log('bridge fee', fee);

  // 2. 获取目标链的vault余额， 如果用户提供的数额大于余额应提示用户
  const balance: VaultBalance = await getVaultBalance(
    ChainId.BSC_TEST,
    BSC_TEST_MOST,
    ChainId.NEAR_TESTNET,
    provider
  );
  console.log('vault balance', balance);

  // 3. Bridge(先estimate gas)
  console.log('gas estimate');
  const bridge: ButterBridge = new ButterBridge();
  const request: BridgeRequestParam = {
    fromAddress: '0x8c9b3cAf7DedD3003f53312779c1b92ba1625D94',
    fromToken: BSC_TEST_MOST,
    fromChainId: ChainId.BSC_TEST,
    toChainId: ChainId.NEAR_TESTNET,
    toAddress: 'xyli.testnet',
    amount: ethers.utils.parseEther('1')!.toString(),
    options: { signerOrProvider: web3.eth },
  };
  const estimatedGas: string = await bridge.gasEstimateBridgeToken(request);

  console.log('gas', estimatedGas);
  const adjustedGas = Math.floor(
    Number.parseFloat(estimatedGas) * 1.2
  ).toString();

  // 3. Bridge(真正的Bridge)
  const bridgeRequest: BridgeRequestParam = {
    fromAddress: '0x8c9b3cAf7DedD3003f53312779c1b92ba1625D94',
    fromToken: BSC_TEST_MOST,
    fromChainId: ChainId.BSC_TEST,
    toChainId: ChainId.NEAR_TESTNET,
    toAddress: 'xyli.testnet',
    amount: ethers.utils.parseEther('1')!.toString(),
    options: {
      nearProvider: nearConfig,
      signerOrProvider: bscSigner,
      // gas: '100000000000000',
      gas: adjustedGas,
    },
  };

  const response: ButterTransactionResponse = await bridge.bridgeToken(
    bridgeRequest
  );
  const receipt: ButterTransactionReceipt = await response.wait!();
  console.log('receipt', receipt);
}

demo()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
