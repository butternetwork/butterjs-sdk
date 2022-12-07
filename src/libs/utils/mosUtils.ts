import { IMapOmnichainService } from '../interfaces/IMapOmnichainService';
import { ChainId, ID_TO_CHAIN_ID } from '../../constants/chains';
import { RelayOmnichainService } from '../mos/RelayOmnichainService';
import { MOS_CONTRACT_ADDRESS_SET } from '../../constants/addresses';
import { Signer } from 'ethers';
import { BridgeOptions, NearNetworkConfig } from '../../types/requestTypes';
import MOS_EVM_METADATA from '../../abis/MAPOmnichainService.json';
import MOS_MAP_METADATA from '../../abis/MAPOmnichainServiceRelay.json';
import { EVMOmnichainService } from '../mos/EVMOmnichainService';
import { NearOmnichainService } from '../mos/NearOmnichainService';

export function createMOSInstance(
  chainId: string,
  options: BridgeOptions
): IMapOmnichainService {
  switch (chainId) {
    case ChainId.MAP:
    case ChainId.MAP_TEST:
      if (options.signerOrProvider == undefined) {
        throw new Error('signer is not provided for MAP chain');
      }
      return new RelayOmnichainService(
        MOS_CONTRACT_ADDRESS_SET[ID_TO_CHAIN_ID(chainId)],
        MOS_MAP_METADATA.abi,
        options.signerOrProvider
      );
    case ChainId.ETH_PRIV:
    case ChainId.MATIC_TEST:
    case ChainId.BSC_TEST:
      if (options.signerOrProvider == undefined) {
        throw new Error(`signer is not provided for chain: ${chainId}`);
      }
      return new EVMOmnichainService(
        MOS_CONTRACT_ADDRESS_SET[ID_TO_CHAIN_ID(chainId)],
        MOS_EVM_METADATA.abi,
        options.signerOrProvider
      );
    case ChainId.NEAR_TESTNET:
      if (options.nearProvider == undefined) {
        throw new Error('near config is not provided');
      }
      return new NearOmnichainService(options.nearProvider);
    default:
      throw new Error(`chainId: ${chainId} is not supported yet`);
  }
}
