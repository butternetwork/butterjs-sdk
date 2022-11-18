import { BigNumber, ethers } from 'ethers';
import { InMemoryKeyStore } from 'near-api-js/lib/key_stores';
import { connect, KeyPair, keyStores, WalletConnection } from 'near-api-js';
import { BridgeRequestParam, NearNetworkConfig } from '../src/types';
import { PromiEvent, TransactionReceipt } from 'web3-core';
import {
  BSC_TEST_CHAIN,
  BSC_TEST_MOST,
  BSC_TEST_NEAR,
  ChainId,
  ETH_PRIV_NEAR,
  MAP_TEST_CHAIN,
  MAP_TEST_MOST,
  MCS_CONTRACT_ADDRESS_SET,
  NEAR_TEST_CHAIN,
  NEAR_TEST_MOST,
  NEAR_TEST_NATIVE,
  NEAR_TEST_WRAP,
  SUPPORTED_CHAIN_LIST,
} from '../src/constants';
import { ID_TO_SUPPORTED_TOKEN } from '../src/constants/supported_tokens';
import {
  getBridgeFee,
  getTargetToken,
  getVaultBalance,
  getTokenCandidates,
  isTokenMintable,
} from '../src/core/tools/dataFetch';
import {
  ButterFee,
  ButterTransactionReceipt,
  ButterTransactionResponse,
  VaultBalance,
} from '../src/types/responseTypes';
import { ButterBridge } from '../src';
import { approveToken } from '../src/libs/allowance';
import Web3 from 'web3';
import { JsonRpcProvider } from 'near-api-js/lib/providers';
import { ButterJsonRpcProvider } from '../src/types/paramTypes';
import { BaseCurrency } from '../src/entities';
import { WebsocketProvider } from 'web3-core';
import { Contract } from 'web3-eth-contract';
import { parseNearAmount } from 'near-api-js/lib/utils/format';
import { asciiToHex } from '../src/utils';
import BN from 'bn.js';
require('dotenv/config');
const web3 = new Web3('http://18.142.54.137:7445');
const account = web3.eth.accounts.privateKeyToAccount(
  '0x' + 'b87b1f26c7d0ffe0f65c25dbc09602e0ac9c0d14acc979b5d67439cade6cdb7b'
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

const bscProvider = new ethers.providers.JsonRpcProvider(
  BSC_TEST_CHAIN.rpc,
  Number.parseInt(BSC_TEST_CHAIN.chainId)
);
const bscSigner = new ethers.Wallet(
  'b87b1f26c7d0ffe0f65c25dbc09602e0ac9c0d14acc979b5d67439cade6cdb7b',
  bscProvider
);

const mapProvider = new ethers.providers.JsonRpcProvider(
  MAP_TEST_CHAIN.rpc,
  Number.parseInt(MAP_TEST_CHAIN.chainId)
);
const mapSigner = new ethers.Wallet(
  'b87b1f26c7d0ffe0f65c25dbc09602e0ac9c0d14acc979b5d67439cade6cdb7b',
  mapProvider
);
/** 支持的链 {@link ChainId} 调试中仅支持MAP测试网，ETH私链，和Near测试网**/
console.log('supported chain', SUPPORTED_CHAIN_LIST);
/** 支持的token {@link supported_token.ts} **/
console.log('supported token', ID_TO_SUPPORTED_TOKEN(ChainId.NEAR_TESTNET));

/** 下面假设我们要从讲Near代币从ETH链Bridge到NEAR链从而获得NEAR上的原生Near代币
 *  整个过程需要3个接口
 *    1. getBridgeFee
 *    2. getVaultBalance
 *    3. bridgeToken
 *  */
function test(): PromiEvent<TransactionReceipt> {
  return web3.eth.sendTransaction({
    from: '0x8c9b3cAf7DedD3003f53312779c1b92ba1625D94',
    to: '0xCBdb1Da4f99276b0c427776BDE93838Bc19386Cc',
    value: '10000000',
    gas: '5000000',
    gasPrice: '100',
  });
}

console.log(typeof nearConfig);
async function demo() {
  console.log(
    'near response',
    await isTokenMintable(NEAR_TEST_MOST.address, NEAR_TEST_CHAIN.chainId)
  );
  console.log('start demo');
  const provider: ButterJsonRpcProvider = {
    url: 'http://18.142.54.137:7445',
    chainId: 212,
  };

  // 1. 获取费用信息
  const fee: ButterFee = await getBridgeFee(
    BSC_TEST_MOST,
    ChainId.MAP_TEST,
    ethers.utils.parseEther('2').toString(),
    provider
  );
  console.log('bridge fee', fee);
  //
  // // 2. 获取目标链的vault余额， 如果用户提供的数额大于余额应提示用户
  const balance: VaultBalance = await getVaultBalance(
    ChainId.BSC_TEST,
    BSC_TEST_MOST,
    ChainId.NEAR_TESTNET,
    provider
  );
  console.log('vault balance', balance);
  //
  // // 3. 获取targetToken
  const tokenCandidates = await getTokenCandidates(
    ChainId.MAP_TEST,
    ChainId.NEAR_TESTNET,
    {
      url: 'http://18.142.54.137:7445',
      chainId: 212,
    }
  );
  console.log('token candidates', tokenCandidates);

  //
  // // 2.a approve spend token if necessary
  //
  // await approveToken(
  //   mapSigner,
  //   MAP_TEST_MOST,
  //   '1',
  //   MCS_CONTRACT_ADDRESS_SET[ChainId.MAP_TEST],
  //   true
  // );
  // console.log('approved');
  // //
  // // 3. Bridge(先estimate gas)
  console.log('gas estimate');
  const bridge: ButterBridge = new ButterBridge();
  // const request: BridgeRequestParam = {
  //   fromAddress: '0x8c9b3cAf7DedD3003f53312779c1b92ba1625D94',
  //   fromToken: MAP_TEST_MOST,
  //   fromChainId: ChainId.MAP_TEST,
  //   toChainId: ChainId.BSC_TEST,
  //   toAddress: '0x8c9b3cAf7DedD3003f53312779c1b92ba1625D94',
  //   amount: ethers.utils.parseEther('1').toString(),
  //   options: { signerOrProvider: web3.eth },
  // };
  // const estimatedGas: string = await bridge.gasEstimateBridgeToken(request);

  // console.log('gas', estimatedGas);
  // const adjustedGas = Math.floor(
  //   Number.parseFloat(estimatedGas) * 1.2
  // ).toString();

  // 3. Bridge(真正的Bridge)
  const bridgeRequest: BridgeRequestParam = {
    fromAddress: '0x8c9b3cAf7DedD3003f53312779c1b92ba1625D94',
    fromToken: MAP_TEST_MOST,
    fromChainId: ChainId.MAP_TEST,
    toChainId: ChainId.BSC_TEST,
    toAddress: '0x8c9b3cAf7DedD3003f53312779c1b92ba1625D94',
    amount: ethers.utils.parseEther('5')!.toString(),
    options: {
      nearProvider: nearConfig,
      signerOrProvider: mapSigner,
      gas: '100000000000000',
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
