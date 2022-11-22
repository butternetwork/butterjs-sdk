import { BaseCurrency } from '../../entities';
import {
  ID_TO_CHAIN_ID,
  ID_TO_DEFAULT_PROVIDER,
  ID_TO_NEAR_NETWORK,
  ID_TO_RPC_URL,
  IS_MAP,
  IS_NEAR,
  MCS_CONTRACT_ADDRESS_SET,
  TOKEN_REGISTER_ADDRESS_SET,
  ZERO_ADDRESS,
} from '../../constants';
import { ButterFee, VaultBalance } from '../../types/responseTypes';
import { TokenRegister } from '../../libs/TokenRegister';
import { BigNumber, ethers } from 'ethers';
import { getTokenByAddressAndChainId } from '../../utils/tokenUtil';
import { ButterJsonRpcProvider } from '../../types/paramTypes';
import { ID_TO_SUPPORTED_TOKEN } from '../../constants/supported_tokens';
import { asciiToString, getHexAddress } from '../../utils';
import { VaultToken } from '../../libs/VaultToken';
import { EVMCrossChainService } from '../../libs/mcs/EVMCrossChainService';
import MCS_EVM_METADATA from '../../abis/MAPCrossChainService.json';
import { connect } from 'near-api-js';
import { CodeResult } from 'near-api-js/lib/providers/provider';
import { GET_MCS_TOKENS } from '../../constants/near_method_names';
import {
  batchGetRelayChainToken,
  batchGetToChainToken,
} from '../../utils/batchRequestUtils';
import Web3 from 'web3';
import TokenRegisterMetadata from '../../abis/TokenRegister.json';

/**
 * get fee for bridging srcToken to targetChain
 * @param srcToken
 * @param targetChain
 * @param amount
 * @param rpcProvider use default rpcProvider when not specified
 */
export async function getBridgeFee(
  srcToken: BaseCurrency,
  targetChain: string,
  amount: string,
  rpcProvider: ButterJsonRpcProvider
): Promise<ButterFee> {
  const chainId: string = rpcProvider.chainId.toString();

  const mapChainId: string = rpcProvider.chainId.toString();
  const mapProvider = new ethers.providers.JsonRpcProvider(
    rpcProvider.url ? rpcProvider.url : ID_TO_DEFAULT_PROVIDER(mapChainId)
  );
  const tokenRegister = new TokenRegister(
    TOKEN_REGISTER_ADDRESS_SET[chainId]!,
    mapProvider
  );
  let feeAmount = '';
  if (IS_MAP(srcToken.chainId)) {
    const tokenAddress = srcToken.isNative
      ? srcToken.wrapped.address
      : srcToken.address;
    feeAmount = await tokenRegister.getTokenFee(
      tokenAddress,
      amount,
      targetChain
    );
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
    const feeAmountInMappingToken = await tokenRegister.getTokenFee(
      mapTokenAddress,
      amount,
      targetChain
    );
    const feeAmountBN = BigNumber.from(feeAmountInMappingToken);
    const ratio = BigNumber.from(amount).div(BigNumber.from(relayChainAmount));
    feeAmount = feeAmountBN.mul(ratio).toString();
  }
  return Promise.resolve({
    feeToken: srcToken,
    amount: feeAmount.toString(),
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
    rpcProvider.url ? rpcProvider.url : ID_TO_DEFAULT_PROVIDER(mapChainId)
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

  const tokenBalance = await vaultToken.getVaultBalance(toChainId.toString());
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
    rpcProvider.url ? rpcProvider.url : ID_TO_DEFAULT_PROVIDER(mapChainId)
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
    : ID_TO_DEFAULT_PROVIDER(provider.chainId.toString());
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
  const rpcUrl = ID_TO_RPC_URL(chainId);
  const rpcProvider = new ethers.providers.JsonRpcProvider(rpcUrl);
  if (IS_MAP(chainId)) {
    const tokenRegister = new TokenRegister(
      TOKEN_REGISTER_ADDRESS_SET[chainId]!,
      rpcProvider
    );
    return tokenRegister.checkMintable(tokenAddress);
  } else if (IS_NEAR(chainId)) {
    const accountId = MCS_CONTRACT_ADDRESS_SET[ID_TO_CHAIN_ID(chainId)];
    const connectionConfig = {
      networkId: ID_TO_NEAR_NETWORK(chainId),
      nodeUrl: ID_TO_RPC_URL(chainId),
    };
    const near = await connect(connectionConfig);
    const response: CodeResult = await near.connection.provider.query({
      request_type: 'call_function',
      finality: 'final',
      account_id: accountId,
      method_name: GET_MCS_TOKENS,
      args_base64: 'e30=',
    });
    console.log('token address', tokenAddress);
    const mcsTokenSet = JSON.parse(asciiToString(response.result));
    for (let i = 0; i < mcsTokenSet.length; i++) {
      if (
        getHexAddress(mcsTokenSet[i][0].toLowerCase(), chainId, false) ===
        tokenAddress.toLowerCase()
      ) {
        return true;
      }
    }
    return false;
  } else {
    const mcs = new EVMCrossChainService(
      MCS_CONTRACT_ADDRESS_SET[ID_TO_CHAIN_ID(chainId)],
      MCS_EVM_METADATA.abi,
      rpcProvider
    );
    return mcs.isMintable(tokenAddress);
  }
}
