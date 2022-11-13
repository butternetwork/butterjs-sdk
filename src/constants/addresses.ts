import { ChainId } from './chains';

/**
 * MCS contract address by chainId
 * smart contract source code:
 * {@link https://github.com/barternetwork/barter-mcs-contracts/blob/master/evm/contracts/MAPCrossChainServiceRelay.sol}
 * {@link https://github.com/barternetwork/barter-mcs-contracts/blob/master/evm/contracts/MAPCrossChainService.sol} */
export const MCS_CONTRACT_ADDRESS_SET: { [chainId in ChainId]: string } = {
  [ChainId.ETH_PRIV]: '0x43130059C655314d7ba7eDfb8299d26FbDE726F1',
  [ChainId.MAP]: '',
  [ChainId.BSC_TEST]: '0x86CBE739888bFbC0bcA6e2D6106cfC5B3B1F69A5',
  [ChainId.MAP_TEST]: '0x3c09AF7eb25904Ec62F37540044A48da1a24269A',
  [ChainId.NEAR_TESTNET]: 'mcs1668056999328.xyli.testnet',
};

/**
 * TokenRegister Address: https://github.com/barternetwork/barter-mcs-contracts/blob/master/evm/contracts/TokenRegister.sol
 */
export const TOKEN_REGISTER_ADDRESS_SET: { [chainId: number]: string } = {
  212: '0xa3b46aC7100E78Cd3a68acF2C878d3dc2714103e',
};

/**
 * Fee center address: https://github.com/barternetwork/barter-mcs-contracts/blob/master/evm/contracts/FeeCenter.sol
 */
export const FEE_CENTER_ADDRESS_SET: { [chainId: number]: string } = {
  212: '0xfe20e986561d3d1C8a8d900e84e72C1c869deA26',
};

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
