import { ChainId } from './chains';

/**
 * MOS contract address by chainId
 * smart contract source code:
 * {@link https://github.com/butternetwork/butter-mos-contracts/blob/master/evmV2/contracts/MAPCrossChainServiceRelay.sol}
 * {@link https://github.com/butternetwork/
 * butter-mos-contracts/blob/master/evmV2/contracts/MAPCrossChainService.sol} */
export const MOS_CONTRACT_ADDRESS_SET: { [chainId in ChainId]: string } = {
  [ChainId.MAP_MAINNET]: '',
  [ChainId.BSC_MAINNET]: '',
  [ChainId.POLYGON_MAINNET]: '',
  [ChainId.NEAR_MAINNET]: '',

  [ChainId.ETH_PRIV]: '0x43130059C655314d7ba7eDfb8299d26FbDE726F1',
  [ChainId.BSC_TEST]: '0x99429764FE9ec59f273f0D3032dC4276746f56a2',
  [ChainId.MAP_TEST]: '0x2599Ba29774B01ED26bCf1b8aB92b5Ce90362EBD',
  [ChainId.POLYGON_TEST]: '0x2680f8D0b18C0fae32521A14A4666d317D305126',
  [ChainId.NEAR_TESTNET]: 'mos2.mfac.maplabs.testnet',
};

/**
 * TokenRegister Address: https://github.com/butternetwork/butter-mos-contracts/blob/master/evm/contracts/TokenRegister.sol
 */
export const TOKEN_REGISTER_ADDRESS_SET: { [chainId: string]: string } = {
  [ChainId.MAP_TEST]: '0x54404d6BE9176a188071EEd90db71A2Ec8176040',
  [ChainId.MAP_MAINNET]: '',
};

export const BUTTER_ROUTER_ADDRESS_SET: { [chainId in ChainId]: string } = {
  [ChainId.MAP_MAINNET]: '',
  [ChainId.BSC_MAINNET]: '',
  [ChainId.POLYGON_MAINNET]: '',
  [ChainId.NEAR_MAINNET]: '',

  [ChainId.ETH_PRIV]: '0x43130059C655314d7ba7eDfb8299d26FbDE726F1',
  [ChainId.BSC_TEST]: '0x99429764FE9ec59f273f0D3032dC4276746f56a2',
  [ChainId.MAP_TEST]: '',
  [ChainId.POLYGON_TEST]: '0x2680f8D0b18C0fae32521A14A4666d317D305126',
  [ChainId.NEAR_TESTNET]: '',
};
export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
