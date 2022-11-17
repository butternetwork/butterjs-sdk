import { BaseCurrency } from '../../entities';
import {
  ChainId,
  ID_TO_CHAIN_ID,
  ID_TO_DEFAULT_PROVIDER,
  ID_TO_RPC_URL,
  IS_MAP,
  IS_NEAR,
  MCS_CONTRACT_ADDRESS_SET,
  NETWORK_NAME_TO_ID,
  TOKEN_REGISTER_ADDRESS_SET,
} from '../../constants';
import { ButterFee, VaultBalance } from '../../types/responseTypes';
import { TokenRegister } from '../../libs/TokenRegister';
import { BigNumber, ethers } from 'ethers';
import { RelayCrossChainService } from '../../libs/mcs/RelayCrossChainService';
import MCS_MAP_METADATA from '../../abis/MAPCrossChainServiceRelay.json';
import { getTokenByAddressAndChainId } from '../../utils/tokenUtil';
import { ButterJsonRpcProvider } from '../../types/paramTypes';
import { ID_TO_SUPPORTED_TOKEN } from '../../constants/supported_tokens';
import { getHexAddress } from '../../utils';
import { VaultToken } from '../../libs/VaultToken';
import { createMCSInstance } from '../../libs/utils/mcsUtils';
import { EVMCrossChainService } from '../../libs/mcs/EVMCrossChainService';
import MCS_EVM_METADATA from '../../abis/MAPCrossChainService.json';

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
  let totalFeeBySrcToken: string;
  const tokenRegister = new TokenRegister(
    TOKEN_REGISTER_ADDRESS_SET[chainId]!,
    mapProvider
  );
  const toMapFeeAmount = await tokenRegister.getTokenFee(
    getHexAddress(srcToken.address, srcToken.chainId, true),
    amount,
    rpcProvider.chainId.toString()
  );

  totalFeeBySrcToken = toMapFeeAmount;
  if (!IS_MAP(targetChain)) {
    const mapTokenAddress = await tokenRegister.getRelayChainToken(
      srcToken.chainId.toString(),
      srcToken
    );
    const adjustedAmount = await tokenRegister.getRelayChainAmount(
      srcToken,
      srcToken.chainId.toString(),
      BigNumber.from(amount).sub(BigNumber.from(toMapFeeAmount)).toString()
    );

    const feeAmount = await tokenRegister.getTokenFee(
      mapTokenAddress,
      adjustedAmount,
      targetChain.toString()
    );

    totalFeeBySrcToken = BigNumber.from(totalFeeBySrcToken)
      .add(BigNumber.from(feeAmount))
      .toString();
  }

  return Promise.resolve({
    feeToken: srcToken,
    amount: totalFeeBySrcToken.toString(),
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

  const mapTokenAddress = IS_MAP(fromChainId)
    ? fromToken.address
    : await tokenRegister.getRelayChainToken(fromChainId.toString(), fromToken);

  const vaultAddress = await tokenRegister.getVaultToken(mapTokenAddress);
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
  console.log('tochaintoken', toChainTokenAddress, 'id', toChainId);
  return Promise.resolve({
    token: getTokenByAddressAndChainId(toChainTokenAddress, toChainId),
    balance: tokenBalance.toString(),
    isMintable: await isTokenMintable(toChainTokenAddress, toChainId),
  });
}

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
  const mapTokenAddress = await tokenRegister.getRelayChainToken(
    srcToken.chainId.toString(),
    srcToken
  );
  let targetTokenAddress = mapTokenAddress;
  if (!IS_MAP(targetChainId)) {
    targetTokenAddress = await tokenRegister.getToChainToken(
      mapTokenAddress,
      targetChainId
    );
  }
  return targetTokenAddress;
}

export async function getTokenCandidates(
  fromChainId: string,
  toChainId: string,
  provider: ButterJsonRpcProvider
): Promise<BaseCurrency[]> {
  let ret = [];
  const fromChainTokenList = ID_TO_SUPPORTED_TOKEN(fromChainId);
  for (let i = 0; i < fromChainTokenList.length; i++) {
    const token: BaseCurrency = fromChainTokenList[i]!;
    if ((await getTargetTokenAddress(token, toChainId, provider)) != '0x') {
      ret.push(token);
    }
  }
  return ret;
}

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
    return true;
  } else {
    const mcs = new EVMCrossChainService(
      MCS_CONTRACT_ADDRESS_SET[ID_TO_CHAIN_ID(chainId)],
      MCS_EVM_METADATA.abi,
      rpcProvider
    );
    return mcs.isMintable(tokenAddress);
  }
}
