import { BaseCurrency } from '../../entities';
import {
  ChainId,
  FEE_CENTER_ADDRESS_SET,
  ID_TO_CHAIN_ID,
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

/**
 * get fee for bridging srcToken to targetChain
 * @param srcToken
 * @param targetChain
 * @param amount
 * @param mapProvider
 */
export async function getBridgeFee(
  srcToken: BaseCurrency,
  targetChain: number,
  amount: string,
  mapProvider: Provider
): Promise<BarterFee> {
  const chainId: number = (await mapProvider.getNetwork()).chainId;
  const feeCenter = new FeeCenter(
    FEE_CENTER_ADDRESS_SET[chainId]!,
    mapProvider
  );

  const tokenRegister = new TokenRegister(
    TOKEN_REGISTER_ADDRESS_SET[chainId]!,
    mapProvider
  );

  const targetTokenAddress = await tokenRegister.getTargetToken(
    srcToken.chainId,
    srcToken.address,
    targetChain
  );

  const tokenFee = await feeCenter.getTokenFee(
    targetChain,
    targetTokenAddress,
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
 * @param mapProvider
 */
export async function getVaultBalance(
  fromChainId: number,
  fromToken: BaseCurrency,
  toChainId: number,
  mapProvider: Provider
): Promise<VaultBalance> {
  if (fromChainId != fromToken.chainId) {
    throw new Error("Request Error: chainId and token.chainId doesn't match");
  }

  const mapChainId: number = (await mapProvider.getNetwork()).chainId;

  const tokenRegister = new TokenRegister(
    TOKEN_REGISTER_ADDRESS_SET[mapChainId]!,
    mapProvider
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
    mapProvider
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
