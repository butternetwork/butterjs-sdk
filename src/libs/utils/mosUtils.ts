import {IMapOmnichainService} from '../interfaces/IMapOmnichainService';
import {IS_EVM, IS_MAP, IS_NEAR, MOS_CONTRACT,} from '../../constants';
import {RelayOmnichainService} from '../mos/RelayOmnichainService';
import {BridgeOptions} from '../../types';
import MOS_EVM_METADATA from '../../abis/MAPOmnichainService.json';
import MOS_MAP_METADATA from '../../abis/MAPOmnichainServiceRelay.json';
import {EVMOmnichainService} from '../mos/EVMOmnichainService';
import {NearOmnichainService} from '../mos/NearOmnichainService';

export function createMOSInstance(
  chainId: string,
  options: BridgeOptions
): IMapOmnichainService {
  if (IS_MAP(chainId)) {
    if (options.signerOrProvider == undefined) {
      throw new Error('signer is not provided for MAP chain');
    }
    return new RelayOmnichainService(
      MOS_CONTRACT(chainId),
      MOS_MAP_METADATA.abi,
      options.signerOrProvider
    );
  } else if (IS_EVM(chainId)) {
    if (options.signerOrProvider == undefined) {
      throw new Error(`signer is not provided for chain: ${chainId}`);
    }
    return new EVMOmnichainService(
        MOS_CONTRACT(chainId),
      MOS_EVM_METADATA.abi,
      options.signerOrProvider
    );
  } else if (IS_NEAR(chainId)) {
    if (options.nearProvider == undefined) {
      throw new Error('near config is not provided');
    }
    return new NearOmnichainService(options.nearProvider);
  } else throw new Error(`chainId: ${chainId} is not supported yet`);
}
