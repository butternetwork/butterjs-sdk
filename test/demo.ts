import { BigNumber, ethers } from 'ethers';
import { InMemoryKeyStore } from 'near-api-js/lib/key_stores';
import { KeyPair, keyStores } from 'near-api-js';
import { BridgeRequestParam, NearNetworkConfig } from '../src/types';
import { PromiEvent, TransactionReceipt } from 'web3-core';
import {
  BSC_TEST_CHAIN,
  BSC_TEST_NEAR,
  ChainId,
  ETH_PRIV_NEAR,
  MCS_CONTRACT_ADDRESS_SET,
  NEAR_TEST_NATIVE,
  SUPPORTED_CHAIN_LIST,
} from '../src/constants';
import { ID_TO_SUPPORTED_TOKEN } from '../src/constants/supported_tokens';
import {
  getBridgeFee,
  getTargetToken,
  getVaultBalance,
  getTokenCandidates,
} from '../src/core/tools/dataFetch';
import {
  BarterFee,
  BarterTransactionReceipt,
  BarterTransactionResponse,
  VaultBalance,
} from '../src/types/responseTypes';
import { BarterBridge } from '../src';
import { approveToken } from '../src/libs/allowance';
import Web3 from 'web3';
import { JsonRpcProvider } from 'near-api-js/lib/providers';
import { BarterJsonRpcProvider } from '../src/types/paramTypes';
import { BaseCurrency } from '../src/entities';
import { WebsocketProvider } from 'web3-core';
import { Contract } from 'web3-eth-contract';

require('dotenv/config');
const web3 = new Web3('http://18.138.248.113:8545');
const account = web3.eth.accounts.privateKeyToAccount(
  '0x' + 'b87b1f26c7d0ffe0f65c25dbc09602e0ac9c0d14acc979b5d67439cade6cdb7b'
);
web3.eth.accounts.wallet.add(account);
web3.eth.defaultAccount = account.address;

// NEAR Network 配置 等同于ethers.js的signer, 如果src chain是Near需要配置
const keyStore: InMemoryKeyStore = new keyStores.InMemoryKeyStore();
const keyPair: KeyPair = KeyPair.fromString(process.env.NEAR_PRIVATE_KEY!);
keyStore.setKey('testnet', 'xyli.testnet', keyPair);
const nearConfig: NearNetworkConfig = {
  fromAccount: 'xyli.testnet',
  keyStore: keyStore,
  nodeUrl: 'https://rpc.testnet.near.org',
  networkId: 'testnet',
};
const bscProvider = new ethers.providers.JsonRpcProvider(
  BSC_TEST_CHAIN.rpc,
  BSC_TEST_CHAIN.chainId
);
const bscSigner = new ethers.Wallet(
  'b87b1f26c7d0ffe0f65c25dbc09602e0ac9c0d14acc979b5d67439cade6cdb7b',
  bscProvider
);
/** 支持的链 {@link ChainId} 调试中仅支持MAP测试网，ETH私链，和Near测试网**/
console.log('supported chain', SUPPORTED_CHAIN_LIST);
/** 支持的token {@link supported_token.ts} **/
console.log('supported token', ID_TO_SUPPORTED_TOKEN(ChainId.ETH_PRIV));

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
async function demo() {
  // const promiReceipt: PromiEvent<TransactionReceipt> = test();
  // promiReceipt
  //   .on('transactionHash', function (hash: string) {
  //     console.log('success!', hash);
  //   })
  //   .on('receipt', function (receipt: any) {
  //     console.log('receipt', receipt);
  //   });
  console.log('start demo');
  const provider: BarterJsonRpcProvider = {
    url: 'http://18.142.54.137:7445',
    chainId: 212,
  };

  // 1. 获取费用信息
  // const fee: BarterFee = await getBridgeFee(
  //   BSC_TEST_NEAR,
  //   ChainId.NEAR_TESTNET,
  //   ethers.utils.parseEther('2').toString(),
  //   provider
  // );
  // console.log('bridge fee', fee);
  //
  // // 2. 获取目标链的vault余额， 如果用户提供的数额大于余额应提示用户
  // const balance: VaultBalance = await getVaultBalance(
  //   ChainId.NEAR_TESTNET,
  //   NEAR_TEST_NATIVE,
  //   ChainId.BSC_TEST,
  //   provider
  // );
  // console.log('vault balance', balance);
  //
  // // 3. 获取targetToken
  // const tokenCandidates = await getTokenCandidates(
  //   ChainId.BSC_TEST,
  //   ChainId.NEAR_TESTNET,
  //   {
  //     url: 'http://18.142.54.137:7445',
  //     chainId: 212,
  //   }
  // );
  // console.log('token candidates', tokenCandidates);

  //
  // // 2.a approve spend token if necessary
  //
  // await approveToken(
  //   bscSigner,
  //   BSC_TEST_NEAR,
  //   '1',
  //   MCS_CONTRACT_ADDRESS_SET[ChainId.BSC_TEST],
  //   true
  // );
  // //
  // // 3. Bridge(先estimate gas)
  const bridge: BarterBridge = new BarterBridge();
  const request: BridgeRequestParam = {
    fromAddress: '0x8c9b3cAf7DedD3003f53312779c1b92ba1625D94',
    fromToken: BSC_TEST_NEAR,
    fromChainId: ChainId.BSC_TEST,
    toChainId: ChainId.NEAR_TESTNET,
    toAddress: 'abc.testnet',
    amount: ethers.utils.parseEther('1').toString(),
    options: { signerOrProvider: web3.eth },
  };
  const estimatedGas: string = await bridge.gasEstimateBridgeToken(request);

  const adjustedGas = Math.floor(
    Number.parseFloat(estimatedGas) * 1.2
  ).toString();

  // 3. Bridge(真正的Bridge)
  const bridgeRequest: BridgeRequestParam = {
    fromAddress: '0x8c9b3cAf7DedD3003f53312779c1b92ba1625D94',
    fromToken: BSC_TEST_NEAR,
    fromChainId: ChainId.BSC_TEST,
    toChainId: ChainId.NEAR_TESTNET,
    toAddress: 'xyli.testnet',
    amount: ethers.utils.parseEther('1').toString(),
    options: {
      signerOrProvider: web3.eth,
      gas: adjustedGas,
    },
  };
  const response: BarterTransactionResponse = await bridge.bridgeToken(
    bridgeRequest
  );
  const promiReceipt: PromiEvent<TransactionReceipt> = response.promiReceipt!;
  await promiReceipt
    .on('transactionHash', function (hash: string) {
      console.log('hash', hash);
    })
    .on('receipt', function (receipt: any) {
      console.log('receipt', receipt);
    });
}

demo()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
