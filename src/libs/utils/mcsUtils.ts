import { IMapCrossChainService } from '../interfaces/IMapCrossChainService';
import { ChainId, ID_TO_CHAIN_ID } from '../../constants/chains';
import { RelayCrossChainService } from '../mcs/RelayCrossChainService';
import { MCS_CONTRACT_ADDRESS_SET } from '../../constants/addresses';
import { Signer } from 'ethers';
import { NearNetworkConfig } from '../../types/requestTypes';
import MCS_EVM_METADATA from '../../abis/MAPCrossChainService.json';
import MCS_MAP_METADATA from '../../abis/MAPCrossChainServiceRelay.json';
import { EVMCrossChainService } from '../mcs/EVMCrossChainService';
import { NearCrossChainService } from '../mcs/NearCrossChainService';

export function createMCSInstance(
  chainId: number,
  signer?: Signer,
  nearConfig?: NearNetworkConfig
): IMapCrossChainService {
  switch (chainId) {
    case ChainId.MAP:
    case ChainId.MAP_TEST:
      if (signer == undefined) {
        throw new Error('signer is not provided for MAP chain');
      }
      return new RelayCrossChainService(
        MCS_CONTRACT_ADDRESS_SET[ID_TO_CHAIN_ID(chainId)],
        MCS_MAP_METADATA.abi,
        signer
      );
    case ChainId.ETH_PRIV:
      if (signer == undefined) {
        throw new Error(`signer is not provided for chain: ${chainId}`);
      }
      return new EVMCrossChainService(
        MCS_CONTRACT_ADDRESS_SET[ID_TO_CHAIN_ID(chainId)],
        MCS_EVM_METADATA.abi,
        signer
      );
    case ChainId.NEAR_TESTNET:
      if (nearConfig == undefined) {
        throw new Error('near config is not provided');
      }
      return new NearCrossChainService(nearConfig);
    default:
      throw new Error(`chainId: ${chainId} is not supported yet`);
  }
}
