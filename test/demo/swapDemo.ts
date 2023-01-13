import { BigNumber, ethers } from 'ethers';
import { InMemoryKeyStore } from 'near-api-js/lib/key_stores';
import { connect, KeyPair, keyStores, WalletConnection } from 'near-api-js';
import {
  BridgeRequestParam,
  ButterCrossChainRoute,
  NearNetworkConfig,
  ButterTransactionOption,
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
  SUPPORTED_CHAIN_LIST_TESTNET,
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
  IS_NEAR,
  ETH_GOERLI_CHAIN,
  ETH_GOERLI_USDC,
  ETH_GOERLI_NATIVE,
  BSC_MAINNET_USDC,
  POLYGON_MAINNET_NATIVE,
  BSC_MAINNET_NATIVE,
  NEAR_MAINNET_USDC,
  NEAR_MAINNET_NATIVE,
  NEAR_MAINNET_WNEAR,
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
  RouteResponse,
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
import './config';
import {
  bscSigner,
  goerliSigner,
  mapSigner,
  maticSinger,
  nearConfig,
  provider,
} from './config';
import { ButterSmartRouter } from '../../src/core/router/ButterSmartRouter';

async function demo() {
  console.log('start demo');

  const fromAddress = '0x9f477490Aac940cE48249D8C455D8f6AE6Dc29c0';
  const toAddress = '0x9f477490Aac940cE48249D8C455D8f6AE6Dc29c0';
  const fromToken = ETH_GOERLI_NATIVE;
  const toToken = BSC_TEST_NATIVE;
  const inputAmount = '1';

  let signer;
  const fromChainId = fromToken.chainId;
  const toChainId = toToken.chainId;
  const amount = ethers.utils
    .parseUnits(inputAmount, fromToken.decimals)
    .toString();

  if (fromChainId === POLYGON_TEST_CHAIN.chainId) {
    signer = maticSinger;
  } else if (fromChainId === BSC_TEST_CHAIN.chainId) {
    signer = bscSigner;
  } else if (fromChainId === MAP_TEST_CHAIN.chainId) {
    signer = mapSigner;
  } else if (fromChainId === NEAR_TEST_CHAIN.chainId) {
    signer = mapSigner;
  } else if (fromChainId === ETH_GOERLI_CHAIN.chainId) {
    signer = goerliSigner;
  } else {
    throw new Error('chain id not supported' + fromChainId);
  }

  const router: ButterSmartRouter = new ButterSmartRouter();
  const routeResponse: RouteResponse = await router.getBestRoute(
    fromToken,
    toToken,
    amount
  );
  console.log('routeResponse', routeResponse);
  const routeStr = JSON.stringify(routeResponse.data);

  console.log(
    'swap fee',
    await getSwapFee(fromToken, toChainId, amount, routeStr, provider)
  );

  // 当源链路径的path不为空，授权这个地址
  const routerAddress = BUTTER_ROUTER_ADDRESS_SET[ID_TO_CHAIN_ID(fromChainId)];

  // 当源链路径的path为空，授权这个地址
  const mosAddress = MOS_CONTRACT_ADDRESS_SET[ID_TO_CHAIN_ID(fromChainId)];

  if (!fromToken.isNative && !IS_NEAR(fromToken.chainId)) {
    let approvalAddress =
      JSON.parse(routeStr).srcChain === undefined ||
      JSON.parse(routeStr).srcChain.length === 0 ||
      JSON.parse(routeStr).srcChain[0].path.length === 0
        ? mosAddress
        : routerAddress;
    await approveToken(signer, fromToken, amount, approvalAddress, true);
  }

  // gas estimation
  const swap: ButterSwap = new ButterSwap();

  let adjustedGas = '';
  if (!IS_NEAR(fromChainId)) {
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
    adjustedGas = Math.floor(Number.parseFloat(estimatedGas) * 1.2).toString();
  }

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
      gas: adjustedGas,
      nearProvider: nearConfig,
    },
  };
  const response: ButterTransactionResponse = await swap.omnichainSwap(
    swapRequestParam
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
