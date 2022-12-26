import { BaseCurrency } from '../../entities';
import {
  ID_TO_CHAIN_ID,
  ID_TO_NEAR_NETWORK,
  ID_TO_DEFAULT_RPC_URL,
  IS_MAP,
  IS_NEAR,
  MOS_CONTRACT_ADDRESS_SET,
  TOKEN_REGISTER_ADDRESS_SET,
  ZERO_ADDRESS,
} from '../../constants';
import {
  ButterFee,
  ButterFeeDistribution,
  ButterFeeRate,
  VaultBalance,
} from '../../types/responseTypes';
import { TokenRegister } from '../../libs/TokenRegister';
import { BigNumber, ethers } from 'ethers';
import { getTokenByAddressAndChainId } from '../../utils/tokenUtil';
import { ButterJsonRpcProvider } from '../../types/paramTypes';
import { ID_TO_SUPPORTED_TOKEN } from '../../utils/tokenUtil';
import { asciiToHex, asciiToString, getHexAddress } from '../../utils';
import { VaultToken } from '../../libs/VaultToken';
import { EVMOmnichainService } from '../../libs/mos/EVMOmnichainService';
import MOS_RELAY_METADATA from '../../abis/MAPOmnichainServiceRelay.json';
import MOS_EVM_METADATA from '../../abis/MAPOmnichainService.json';
import { connect } from 'near-api-js';
import { CodeResult } from 'near-api-js/lib/providers/provider';
import { GET_MCS_TOKENS } from '../../constants/near_method_names';
import {
  batchGetRelayChainToken,
  batchGetToChainToken,
} from '../../utils/batchRequestUtils';
import Web3 from 'web3';
import TokenRegisterMetadata from '../../abis/TokenRegister.json';
import { RelayOmnichainService } from '../../libs/mos/RelayOmnichainService';
import { ButterSwapRoute } from '../../types';
import { assembleCrossChainRouteFromJson } from '../../utils/requestUtils';
import { DEFAULT_SLIPPAGE } from '../../constants/constants';

/**
 * get fee for bridging srcToken to targetChain
 * @param srcToken
 * @param targetChain
 * @param amount
 * @param mapRpcProvider
 */
export async function getBridgeFee(
  srcToken: BaseCurrency,
  targetChain: string,
  amount: string,
  mapRpcProvider: ButterJsonRpcProvider
): Promise<ButterFee> {
  const chainId: string = mapRpcProvider.chainId.toString();

  const mapChainId: string = mapRpcProvider.chainId.toString();
  const mapProvider = new ethers.providers.JsonRpcProvider(
    mapRpcProvider.url ? mapRpcProvider.url : ID_TO_DEFAULT_RPC_URL(mapChainId)
  );
  const tokenRegister = new TokenRegister(
    TOKEN_REGISTER_ADDRESS_SET[chainId]!,
    mapProvider
  );
  let feeAmount = '';
  let feeRate: ButterFeeRate = { lowest: '0', rate: '0', highest: '0' };
  if (IS_MAP(srcToken.chainId)) {
    const tokenAddress = srcToken.isNative
      ? srcToken.wrapped.address
      : srcToken.address;
    const tokenFeeRate = await tokenRegister.getFeeRate(
      tokenAddress,
      targetChain
    );
    feeRate.lowest = tokenFeeRate.lowest.toString();
    feeRate.highest = tokenFeeRate.highest.toString();
    feeRate.rate = BigNumber.from(tokenFeeRate.rate).div(100).toString();
    feeAmount = _getFeeAmount(amount, feeRate);
  } else {
    const mapTokenAddress = await tokenRegister.getRelayChainToken(
      srcToken.chainId.toString(),
      srcToken
    );

    const relayChainAmount = await tokenRegister.getRelayChainAmount(
      mapTokenAddress,
      srcToken.chainId.toString(),
      amount
    );
    const tokenFeeRate: ButterFeeRate = await tokenRegister.getFeeRate(
      mapTokenAddress,
      targetChain
    );
    feeRate.lowest = tokenFeeRate.lowest;
    feeRate.highest = tokenFeeRate.highest;
    feeRate.rate = BigNumber.from(tokenFeeRate.rate).div(100).toString();

    const feeAmountInMappingToken = _getFeeAmount(relayChainAmount, feeRate);
    const feeAmountBN = BigNumber.from(feeAmountInMappingToken);
    feeRate.lowest = BigNumber.from(feeRate.lowest)
      .mul(amount)
      .div(relayChainAmount)
      .toString();
    feeRate.highest = BigNumber.from(feeRate.highest)
      .mul(amount)
      .div(relayChainAmount)
      .toString();
    feeAmount = feeAmountBN.mul(amount).div(relayChainAmount).toString();
  }
  const distribution = await getDistributeRate(mapChainId);
  return Promise.resolve({
    feeToken: srcToken,
    feeRate: feeRate,
    amount: feeAmount.toString(),
    feeDistribution: distribution,
  });
}

/**
 * get fee for cross-chain exchange
 * @param srcToken source token
 * @param targetChain target chain id
 * @param amount amount in minimal uint
 * @param routeStr cross-chain route in string format
 * @param mapRpcProvider map relay chain rpc provider
 */
export async function getSwapFee(
  srcToken: BaseCurrency,
  targetChain: string,
  amount: string,
  routeStr: string,
  mapRpcProvider: ButterJsonRpcProvider
): Promise<ButterFee> {
  const routes = assembleCrossChainRouteFromJson(routeStr, DEFAULT_SLIPPAGE);
  const srcRoute = routes.srcChain;

  if (srcRoute.length === 0 || srcRoute[0]!.path.length === 0) {
    return await getBridgeFee(srcToken, targetChain, amount, mapRpcProvider);
  }
  let totalAmountOut: string = '0';
  for (let route of routes.mapChain) {
    totalAmountOut = BigNumber.from(totalAmountOut)
      .add(route.amountOut)
      .toString();
  }
  const tokenOut: BaseCurrency = srcRoute[0]!.tokenOut;

  const chainId: string = mapRpcProvider.chainId.toString();

  const mapChainId: string = mapRpcProvider.chainId.toString();
  const mapProvider = new ethers.providers.JsonRpcProvider(
    mapRpcProvider.url ? mapRpcProvider.url : ID_TO_DEFAULT_RPC_URL(mapChainId)
  );
  const tokenRegister = new TokenRegister(
    TOKEN_REGISTER_ADDRESS_SET[chainId]!,
    mapProvider
  );
  let feeAmount = '';
  let feeRate: ButterFeeRate = { lowest: '0', rate: '0', highest: '0' };
  if (IS_MAP(srcToken.chainId)) {
    const tokenAddress = srcToken.isNative
      ? srcToken.wrapped.address
      : srcToken.address;
    const tokenFeeRate = await tokenRegister.getFeeRate(
      tokenAddress,
      targetChain
    );
    feeRate.lowest = tokenFeeRate.lowest.toString();
    feeRate.highest = tokenFeeRate.highest.toString();
    feeRate.rate = BigNumber.from(tokenFeeRate.rate).div(100).toString();
    feeAmount = _getFeeAmount(amount, feeRate);
  } else {
    const mapTokenAddress = await tokenRegister.getRelayChainToken(
      srcToken.chainId.toString(),
      tokenOut
    );

    const relayChainAmount = await tokenRegister.getRelayChainAmount(
      mapTokenAddress,
      srcToken.chainId.toString(),
      totalAmountOut
    );
    const tokenFeeRate: ButterFeeRate = await tokenRegister.getFeeRate(
      mapTokenAddress,
      targetChain
    );
    feeRate.lowest = tokenFeeRate.lowest;
    feeRate.highest = tokenFeeRate.highest;
    feeRate.rate = BigNumber.from(tokenFeeRate.rate).div(100).toString();

    const feeAmountInMappingToken = _getFeeAmount(relayChainAmount, feeRate);
    const feeAmountBN = BigNumber.from(feeAmountInMappingToken);
    feeRate.lowest = BigNumber.from(feeRate.lowest)
      .mul(totalAmountOut)
      .div(relayChainAmount)
      .toString();
    feeRate.highest = BigNumber.from(feeRate.highest)
      .mul(totalAmountOut)
      .div(relayChainAmount)
      .toString();
    feeAmount = feeAmountBN
      .mul(totalAmountOut)
      .div(relayChainAmount)
      .toString();
  }
  const distribution = await getDistributeRate(mapChainId);
  console.log('11123123123123213123');
  console.log('distribution', distribution);
  return Promise.resolve({
    feeToken: getTokenByAddressAndChainId(
      getHexAddress(
        tokenOut.address,
        srcToken.chainId,
        !IS_NEAR(srcToken.chainId)
      ),
      srcToken.chainId
    ),
    feeRate: feeRate,
    amount: feeAmount.toString(),
    feeDistribution: distribution,
  });
}
/**
 * get vault balance
 * @param fromChainId
 * @param fromToken
 * @param toChainId
 * @param rpcProvider
 */
export async function getVaultBalance(
  fromChainId: string,
  fromToken: BaseCurrency,
  toChainId: string,
  rpcProvider: ButterJsonRpcProvider
): Promise<VaultBalance> {
  if (fromChainId != fromToken.chainId) {
    throw new Error("Request Error: chainId and token.chainId doesn't match");
  }

  const mapChainId: string = rpcProvider.chainId.toString();
  const provider = new ethers.providers.JsonRpcProvider(
    rpcProvider.url ? rpcProvider.url : ID_TO_DEFAULT_RPC_URL(mapChainId)
  );

  const tokenRegister = new TokenRegister(
    TOKEN_REGISTER_ADDRESS_SET[mapChainId]!,
    provider
  );

  if (fromToken.isNative) {
    fromToken = fromToken.wrapped;
  }
  const mapTokenAddress = IS_MAP(fromChainId)
    ? fromToken.address
    : await tokenRegister.getRelayChainToken(fromChainId.toString(), fromToken);
  const vaultAddress = await tokenRegister.getVaultToken(mapTokenAddress);

  if (vaultAddress === ZERO_ADDRESS) {
    throw new Error('vault address not found for token: ' + mapTokenAddress);
  }
  const vaultToken = new VaultToken(vaultAddress, provider);

  let tokenBalance = await vaultToken.getVaultBalance(toChainId.toString());

  let toChainTokenAddress = mapTokenAddress;

  if (!IS_MAP(toChainId)) {
    toChainTokenAddress = await tokenRegister.getToChainToken(
      mapTokenAddress,
      toChainId
    );

    if (toChainTokenAddress === '0x') {
      throw new Error(
        'Internal Error: Cannot find corresponding target token on target chain'
      );
    }

    const mapToken = getTokenByAddressAndChainId(mapTokenAddress, mapChainId);
    const toChainToken = getTokenByAddressAndChainId(
      toChainTokenAddress,
      toChainId
    );
    tokenBalance = BigNumber.from(tokenBalance)
      .mul(ethers.utils.parseUnits('1', toChainToken.decimals))
      .div(ethers.utils.parseUnits('1', mapToken.decimals))
      .toString();
  }

  return Promise.resolve({
    token: getTokenByAddressAndChainId(toChainTokenAddress, toChainId),
    balance: tokenBalance.toString(),
    isMintable: await isTokenMintable(toChainTokenAddress, toChainId),
  });
}

/**
 * get srcToken mapping token on target chain
 * @param srcToken
 * @param targetChainId
 * @param rpcProvider
 */
export async function getTargetToken(
  srcToken: BaseCurrency,
  targetChainId: string,
  rpcProvider: ButterJsonRpcProvider
): Promise<BaseCurrency> {
  const tokenAddress = await getTargetTokenAddress(
    srcToken,
    targetChainId,
    rpcProvider
  );
  if (tokenAddress === '0x') {
    throw new Error('token does not exist');
  }
  return getTokenByAddressAndChainId(tokenAddress, targetChainId);
}

/**
 * get srcToken mapping token on target chain
 * @param srcToken
 * @param targetChainId
 * @param rpcProvider
 */
export async function getTargetTokenAddress(
  srcToken: BaseCurrency,
  targetChainId: string,
  rpcProvider: ButterJsonRpcProvider
): Promise<string> {
  const mapChainId: string = rpcProvider.chainId.toString();
  const provider = new ethers.providers.JsonRpcProvider(
    rpcProvider.url ? rpcProvider.url : ID_TO_DEFAULT_RPC_URL(mapChainId)
  );
  const tokenRegister = new TokenRegister(
    TOKEN_REGISTER_ADDRESS_SET[mapChainId]!,
    provider
  );
  let mapTokenAddress = srcToken.address;
  if (!IS_MAP(srcToken.chainId)) {
    mapTokenAddress = await tokenRegister.getRelayChainToken(
      srcToken.chainId.toString(),
      srcToken
    );
  }
  let targetTokenAddress = mapTokenAddress;
  if (!IS_MAP(targetChainId)) {
    targetTokenAddress = await tokenRegister.getToChainToken(
      mapTokenAddress,
      targetChainId
    );
  }
  return targetTokenAddress;
}

/**
 * get what token can be bridge from src chain to target chain
 * @param fromChainId
 * @param toChainId
 * @param provider
 */
export async function getTokenCandidatesOneByOne(
  fromChainId: string,
  toChainId: string,
  provider: ButterJsonRpcProvider
): Promise<BaseCurrency[]> {
  let ret = [];
  const fromChainTokenList = ID_TO_SUPPORTED_TOKEN(fromChainId);
  for (let i = 0; i < fromChainTokenList.length; i++) {
    const token: BaseCurrency = fromChainTokenList[i]!;
    const tokenToCheck: BaseCurrency = token.isNative ? token.wrapped : token;
    if (
      (await getTargetTokenAddress(tokenToCheck, toChainId, provider)) != '0x'
    ) {
      ret.push(token);
    }
  }
  return ret;
}

/**
 * get token candidates with one transaction call
 * @param fromChainId
 * @param toChainId
 * @param provider
 */
export async function getTokenCandidates(
  fromChainId: string,
  toChainId: string,
  provider: ButterJsonRpcProvider
): Promise<BaseCurrency[]> {
  const mapUrl = provider.url
    ? provider.url
    : ID_TO_DEFAULT_RPC_URL(provider.chainId.toString());
  const web3 = new Web3(mapUrl);

  const tokenRegisterContract = new web3.eth.Contract(
    TokenRegisterMetadata.abi as any,
    TOKEN_REGISTER_ADDRESS_SET[provider.chainId.toString()]
  );

  let tokenArr = ID_TO_SUPPORTED_TOKEN(fromChainId).map(
    (token: BaseCurrency) => {
      if (IS_NEAR(token.chainId)) {
        if (token.isNative) {
          return getHexAddress(token.wrapped.address, token.chainId, false);
        } else return getHexAddress(token.address, token.chainId, false);
      } else {
        if (token.isNative) {
          return token.wrapped.address;
        } else return token.address;
      }
    }
  );
  if (!IS_MAP(fromChainId)) {
    tokenArr = await batchGetRelayChainToken(
      tokenRegisterContract,
      fromChainId,
      tokenArr,
      mapUrl
    );
  }

  if (IS_MAP(toChainId)) {
    return ID_TO_SUPPORTED_TOKEN(fromChainId);
  }
  const toChainTokenList = await batchGetToChainToken(
    tokenRegisterContract,
    tokenArr,
    toChainId,
    mapUrl
  );
  let supportedFromChainTokenArr: BaseCurrency[] = [];
  for (let i = 0; i < toChainTokenList.length; i++) {
    if (toChainTokenList[i] != null && toChainTokenList[i] != '0x') {
      supportedFromChainTokenArr.push(ID_TO_SUPPORTED_TOKEN(fromChainId)[i]!);
    }
  }
  return supportedFromChainTokenArr;
}

/**
 * check if a token is mintable on mos
 * @param tokenAddress
 * @param chainId
 */
export async function isTokenMintable(
  tokenAddress: string,
  chainId: string
): Promise<boolean> {
  const rpcUrl = ID_TO_DEFAULT_RPC_URL(chainId);
  const rpcProvider = new ethers.providers.JsonRpcProvider(rpcUrl);
  if (IS_MAP(chainId)) {
    const tokenRegister = new TokenRegister(
      TOKEN_REGISTER_ADDRESS_SET[chainId]!,
      rpcProvider
    );
    return tokenRegister.checkMintable(tokenAddress);
  } else if (IS_NEAR(chainId)) {
    const accountId = MOS_CONTRACT_ADDRESS_SET[ID_TO_CHAIN_ID(chainId)];
    const connectionConfig = {
      networkId: ID_TO_NEAR_NETWORK(chainId),
      nodeUrl: ID_TO_DEFAULT_RPC_URL(chainId),
    };
    const near = await connect(connectionConfig);
    const response: CodeResult = await near.connection.provider.query({
      request_type: 'call_function',
      finality: 'final',
      account_id: accountId,
      method_name: GET_MCS_TOKENS,
      args_base64: 'e30=',
    });
    const mosTokenSet = JSON.parse(asciiToString(response.result));
    for (let i = 0; i < mosTokenSet.length; i++) {
      if (
        getHexAddress(mosTokenSet[i][0].toLowerCase(), chainId, false) ===
        tokenAddress.toLowerCase()
      ) {
        return true;
      }
    }
    return false;
  } else {
    const mos = new EVMOmnichainService(
      MOS_CONTRACT_ADDRESS_SET[ID_TO_CHAIN_ID(chainId)],
      MOS_EVM_METADATA.abi,
      rpcProvider
    );
    return mos.isMintable(tokenAddress);
  }
}

export async function getDistributeRate(
  mapChainId: string
): Promise<ButterFeeDistribution> {
  const rpcUrl = ID_TO_DEFAULT_RPC_URL(mapChainId);
  const rpcProvider = new ethers.providers.JsonRpcProvider(rpcUrl);
  if (!IS_MAP(mapChainId)) {
    throw new Error('chain id is not MAP');
  }

  const mos = new ethers.Contract(
    MOS_CONTRACT_ADDRESS_SET[ID_TO_CHAIN_ID(mapChainId)],
    MOS_RELAY_METADATA.abi,
    rpcProvider
  );
  const lpRate = await mos.distributeRate(0);
  const relayerRate = await mos.distributeRate(1);
  const protocolRate = await mos.distributeRate(2);
  console.log('relay', relayerRate);
  return Promise.resolve({
    relayer: relayerRate.rate.div(100).toString(),
    lp: lpRate.rate.div(100).toString(),
    protocol: protocolRate.rate.div(100).toString(),
  });
}

function _getFeeAmount(amount: string, feeRate: ButterFeeRate): string {
  const feeAmount = BigNumber.from(amount).mul(feeRate.rate).div(10000);
  if (feeAmount.gt(feeRate.highest)) {
    return feeRate.highest.toString();
  } else if (feeAmount.lt(feeRate.lowest)) {
    return feeRate.lowest.toString();
  }
  return feeAmount.toString();
}
