import { BigNumber, ethers } from 'ethers';
import { InMemoryKeyStore } from 'near-api-js/lib/key_stores';
import { KeyPair, keyStores } from 'near-api-js';
import { BridgeRequestParam, NearNetworkConfig } from '../src/types';
import {
  BSC_TEST_NEAR,
  ChainId,
  ETH_PRIV_NEAR,
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
  BarterContractCallReceipt,
  VaultBalance,
} from '../src/types/responseTypes';
import { BarterBridge } from '../src';
import { approveToken } from '../src/libs/allowance';
import Web3 from 'web3';
import { JsonRpcProvider } from 'near-api-js/lib/providers';
import { BarterJsonRpcProvider } from '../src/types/paramTypes';
import { BaseCurrency } from '../src/entities';

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
async function demo() {
  console.log('start demo');
  const provider: BarterJsonRpcProvider = {
    url: 'http://18.142.54.137:7445',
    chainId: 212,
  };

  // 1. 获取费用信息
  const fee: BarterFee = await getBridgeFee(
    BSC_TEST_NEAR,
    ChainId.NEAR_TESTNET,
    ethers.utils.parseEther('1').toString(),
    provider
  );
  console.log('bridge fee', fee);

  // 2. 获取目标链的vault余额， 如果用户提供的数额大于余额应提示用户
  const balance: VaultBalance = await getVaultBalance(
    ChainId.BSC_TEST,
    BSC_TEST_NEAR,
    ChainId.NEAR_TESTNET,
    provider
  );
  console.log('vault balance', balance);

  // 3. 获取targetToken
  const tokenCandidates = await getTokenCandidates(
    ChainId.BSC_TEST,
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
  //   ethSigner,
  //   ETH_PRIV_NEAR,
  //   '1',
  //   MCS_CONTRACT_ADDRESS_SET[ChainId.ETH_PRIV],
  //   true
  // );
  // //
  // // // 3. Bridge(先estimate gas)
  const bridge: BarterBridge = new BarterBridge();
  const request: BridgeRequestParam = {
    fromToken: ETH_PRIV_NEAR,
    fromChainId: ChainId.ETH_PRIV,
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
    fromToken: ETH_PRIV_NEAR,
    fromChainId: ChainId.ETH_PRIV,
    toChainId: ChainId.NEAR_TESTNET,
    toAddress: 'xyli.testnet',
    amount: ethers.utils.parseEther('1').toString(),
    options: {
      signerOrProvider: web3.eth,
      gas: adjustedGas,
    },
  };
  const receipt: BarterContractCallReceipt = await bridge.bridgeToken(
    bridgeRequest
  );
  console.log('tx receipt', receipt);
}

demo()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
