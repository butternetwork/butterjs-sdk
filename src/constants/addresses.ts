import { ChainId } from './chains';

/**
 * MCS contract address by chainId
 * smart contract source code:
 * {@link https://github.com/barternetwork/barter-mcs-contracts/blob/master/evm/contracts/MAPCrossChainServiceRelay.sol}
 * {@link https://github.com/barternetwork/barter-mcs-contracts/blob/master/evm/contracts/MAPCrossChainService.sol} */
export const MCS_CONTRACT_ADDRESS_SET: { [chainId in ChainId]: string } = {
  [ChainId.ETH_PRIV]: '0x43130059C655314d7ba7eDfb8299d26FbDE726F1',
  [ChainId.MAP]: '',
  [ChainId.BSC_TEST]: '0xD25B7697964d917d9f17597Df095D855EDC14d93',
  [ChainId.MAP_TEST]: '0x7aE623A58EEe843AC0BdeB20Ddef451B145fd6Ba',
  [ChainId.NEAR_TESTNET]: 'mcs1668040897000.xyli.testnet',
};

/**
 * TokenRegister Address: https://github.com/barternetwork/barter-mcs-contracts/blob/master/evm/contracts/TokenRegister.sol
 */
export const TOKEN_REGISTER_ADDRESS_SET: { [chainId: number]: string } = {
  212: '0xcD7146a50e32360F7ec3b6A7e342DFA31de7556b',
};

/**
 * Fee center address: https://github.com/barternetwork/barter-mcs-contracts/blob/master/evm/contracts/FeeCenter.sol
 */
export const FEE_CENTER_ADDRESS_SET: { [chainId: number]: string } = {
  212: '0xB689eE3c8443d543dc7862eB8096f91EE316161B',
};

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
