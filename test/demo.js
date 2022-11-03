import { ethers } from 'ethers';
import { InMemoryKeyStore } from 'near-api-js/lib/key_stores';
import { KeyPair, keyStores } from 'near-api-js';
import { BridgeRequestParam, NearNetworkConfig } from '../src/types';
import {
  ChainId,
  ETH_PRIV_NEAR,
  MCS_CONTRACT_ADDRESS_SET,
  NEAR_TEST_NATIVE,
} from '../src/constants';
import { ID_TO_SUPPORTED_TOKEN } from '../src/constants/supported_tokens';
import { getBridgeFee, getVaultBalance } from '../src/core/tools/dataFetch';
import {
  BarterFee,
  ContractCallReceipt,
  VaultBalance,
} from '../src/types/responseTypes';
import { BarterBridge } from '../src';
import { approveToken } from '../src/libs/allowance';
require('dotenv/config');
// MAP Test Signer
const mapProvider = new ethers.providers.JsonRpcProvider(
  'http://18.142.54.137:7445',
  212
);

// ETH Private Signer
const ethProvider = new ethers.providers.JsonRpcProvider(
  'http://18.138.248.113:8545',
  34434
);
const ethSigner = new ethers.Wallet(
  '939ae45116ea2d4ef9061f13534bc451e9f9835e94f191970f23aac0299d5f7a',
  ethProvider
);

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

/** 支持的token {@link supported_token.ts} **/
// console.log('supported token', ID_TO_SUPPORTED_TOKEN(ChainId.ETH_PRIV));

/** 下面假设我们要从讲Near代币从ETH链Bridge到NEAR链从而获得NEAR上的原生Near代币
 *  整个过程需要3个接口
 *    1. getBridgeFee
 *    2. getVaultBalance
 *    3. bridgeToken
 *  */
async function demo() {
  // 1. 获取费用信息
  const fee: BarterFee = await getBridgeFee(
    ETH_PRIV_NEAR,
    ChainId.ETH_PRIV,
    ethers.utils.parseEther('1').toString(),
    mapProvider
  );
  console.log('bridge fee', fee);

  // 2. 获取目标链的vault余额， 如果用户提供的数额大于余额应提示用户

  const token =
  const balance: VaultBalance = await getVaultBalance(
    ChainId.ETH_PRIV,
    ETH_PRIV_NEAR,
    ChainId.NEAR_TESTNET,
    mapProvider
  );
  console.log('vault balance', balance);

  // 2.a approve spend token if necessary

  await approveToken(
    ethSigner,
    ETH_PRIV_NEAR,
    '1',
    MCS_CONTRACT_ADDRESS_SET[ChainId.ETH_PRIV],
    true
  );

  // // 3. Bridge(先estimate gas)
  const bridge: BarterBridge = new BarterBridge();
  const request: BridgeRequestParam = {
    token: ETH_PRIV_NEAR,
    fromChainId: ChainId.ETH_PRIV,
    toChainId: ChainId.NEAR_TESTNET,
    toAddress: 'abc.testnet',
    amount: ethers.utils.parseEther('1').toString(),
    options: { signerOrProvider: ethSigner },
  };
  const estimatedGas: string = await bridge.gasEstimateBridgeToken(request);
  console.log('gas estimate', estimatedGas);

  // 3. Bridge(真正的Bridge)
  const bridgeRequest: BridgeRequestParam = {
    token: ETH_PRIV_NEAR,
    fromChainId: ChainId.ETH_PRIV,
    toChainId: ChainId.NEAR_TESTNET,
    toAddress: 'xyli.testnet',
    amount: ethers.utils.parseEther('1').toString(),
    options: { signerOrProvider: ethSigner, gas: estimatedGas },
  };
  const receipt: ContractCallReceipt = await bridge.bridgeToken(bridgeRequest);
  console.log('tx receipt', receipt);
}

demo()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
