import { BaseCurrency } from '../../entities';
import {
  ChainId,
  FEE_CENTER_ADDRESS_SET,
  ID_TO_CHAIN_ID,
  ID_TO_DEFAULT_PROVIDER,
  IS_MAP,
  MCS_CONTRACT_ADDRESS_SET,
  NETWORK_NAME_TO_ID,
  TOKEN_REGISTER_ADDRESS_SET,
} from '../../constants';
import { BarterFee, VaultBalance } from '../../types/responseTypes';
import { FeeCenter } from '../../libs/FeeCenter';
import { Provider } from '@ethersproject/abstract-provider';
import { TokenRegister } from '../../libs/TokenRegister';
import { BigNumber, ethers } from 'ethers';
import { RelayCrossChainService } from '../../libs/mcs/RelayCrossChainService';
import MCS_MAP_METADATA from '../../abis/MAPCrossChainServiceRelay.json';
import { getTokenByAddressAndChainId } from '../../utils/tokenUtil';
import { BarterJsonRpcProvider } from '../../types/paramTypes';
import { ID_TO_SUPPORTED_TOKEN } from '../../constants/supported_tokens';
import { getHexAddress } from '../../utils';

/**
 * get fee for bridging srcToken to targetChain
 * @param srcToken
 * @param targetChain
 * @param amount
 * @param rpcProvider use default rpcProvider when not specified
 */
export async function getBridgeFee(
  srcToken: BaseCurrency,
  targetChain: number,
  amount: string,
  rpcProvider: BarterJsonRpcProvider
): Promise<BarterFee> {
  const chainId: number = rpcProvider.chainId;

  const mapChainId: number = rpcProvider.chainId;
  const mapProvider = new ethers.providers.JsonRpcProvider(
    rpcProvider.url ? rpcProvider.url : ID_TO_DEFAULT_PROVIDER(mapChainId)
  );
  const feeCenter = new FeeCenter(
    FEE_CENTER_ADDRESS_SET[chainId]!,
    mapProvider
  );

  const tokenRegister = new TokenRegister(
    TOKEN_REGISTER_ADDRESS_SET[chainId]!,
    mapProvider
  );
  console.log('src token', srcToken);
  const targetTokenAddress = await tokenRegister.getTargetToken(
    srcToken.chainId,
    srcToken.address,
    targetChain
  );

  console.log('target token addr', targetTokenAddress);

  const tokenFee = await feeCenter.getTokenFee(
    targetChain,
    getHexAddress(targetTokenAddress, targetChain),
    BigNumber.from(amount)
  );

  return Promise.resolve({
    feeToken: srcToken,
    amount: tokenFee.toString(),
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
  fromChainId: number,
  fromToken: BaseCurrency,
  toChainId: number,
  rpcProvider: BarterJsonRpcProvider
): Promise<VaultBalance> {
  if (fromChainId != fromToken.chainId) {
    throw new Error("Request Error: chainId and token.chainId doesn't match");
  }

  const mapChainId: number = rpcProvider.chainId;
  const provider = new ethers.providers.JsonRpcProvider(
    rpcProvider.url ? rpcProvider.url : ID_TO_DEFAULT_PROVIDER(mapChainId)
  );

  const tokenRegister = new TokenRegister(
    TOKEN_REGISTER_ADDRESS_SET[mapChainId]!,
    provider
  );

  const mapTokenAddress = IS_MAP(fromChainId)
    ? fromToken.address
    : await tokenRegister.getTargetToken(
        fromChainId,
        fromToken.address,
        mapChainId
      );
  const mcsContractAddress: string =
    MCS_CONTRACT_ADDRESS_SET[ID_TO_CHAIN_ID(mapChainId)];
  const mapMCS = new RelayCrossChainService(
    mcsContractAddress,
    MCS_MAP_METADATA.abi,
    provider
  );

  const tokenBalance = await mapMCS.getVaultBalance(toChainId, mapTokenAddress);
  const toChainTokenAddress = await tokenRegister.getTargetToken(
    fromChainId,
    fromToken.address,
    toChainId
  );

  if (toChainTokenAddress === '0x') {
    throw new Error(
      'Internal Error: Cannot find corresponding target token on target chain'
    );
  }

  return Promise.resolve({
    token: getTokenByAddressAndChainId(toChainTokenAddress, toChainId),
    balance: tokenBalance,
  });
}

export async function getTargetToken(
  srcToken: BaseCurrency,
  targetChainId: number,
  rpcProvider: BarterJsonRpcProvider
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
  targetChainId: number,
  rpcProvider: BarterJsonRpcProvider
): Promise<string> {
  const mapChainId: number = rpcProvider.chainId;
  const provider = new ethers.providers.JsonRpcProvider(
    rpcProvider.url ? rpcProvider.url : ID_TO_DEFAULT_PROVIDER(mapChainId)
  );
  const tokenRegister = new TokenRegister(
    TOKEN_REGISTER_ADDRESS_SET[mapChainId]!,
    provider
  );

  const targetTokenAddress = await tokenRegister.getTargetToken(
    srcToken.chainId,
    srcToken.address,
    targetChainId
  );
  console.log(
    'get target token address',
    srcToken.chainId,
    srcToken.address,
    targetChainId,
    targetTokenAddress
  );

  return targetTokenAddress;
}

export async function getTokenCandidates(
  fromChainId: number,
  toChainId: number,
  provider: BarterJsonRpcProvider
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
