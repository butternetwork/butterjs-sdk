import { ChainId } from './chains';

/**
 * MCS contract address by chainId
 * smart contract source code:
 * {@link https://github.com/butternetwork/butter-mcs-contracts/blob/master/evmV2/contracts/MAPCrossChainServiceRelay.sol}
 * {@link https://github.com/butternetwork/
 * butter-mos-contracts/blob/master/evmV2/contracts/MAPCrossChainService.sol} */
export const MCS_CONTRACT_ADDRESS_SET: { [chainId in ChainId]: string } = {
  [ChainId.ETH_PRIV]: '0x43130059C655314d7ba7eDfb8299d26FbDE726F1',
  [ChainId.MAP]: '',
  [ChainId.BSC_TEST]: '0x220bE51C717c4E257Cb8e96be8591740336623F8',
  [ChainId.MAP_TEST]: '0xB6c1b689291532D11172Fb4C204bf13169EC0dCA',
  [ChainId.NEAR_TESTNET]: 'mos2.mfac.maplabs.testnet',
};

/**
 * TokenRegister Address: https://github.com/butternetwork/butter-mcs-contracts/blob/master/evm/contracts/TokenRegister.sol
 */
export const TOKEN_REGISTER_ADDRESS_SET: { [chainId: string]: string } = {
  [ChainId.MAP_TEST]: '0xc81Fe3f111d44b5469B9179D3b40B99A2527cF7A',
};

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
