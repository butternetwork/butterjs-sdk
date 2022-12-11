import { ChainId } from './chains';

/**
 * MOS contract address by chainId
 * smart contract source code:
 * {@link https://github.com/butternetwork/butter-mos-contracts/blob/master/evmV2/contracts/MAPCrossChainServiceRelay.sol}
 * {@link https://github.com/butternetwork/
 * butter-mos-contracts/blob/master/evmV2/contracts/MAPCrossChainService.sol} */
export const MOS_CONTRACT_ADDRESS_SET: { [chainId in ChainId]: string } = {
  [ChainId.MAP_MAINNET]: '0x630105189c7114667a7179Aa57f07647a5f42B7F',
  [ChainId.BSC_MAINNET]: '0x630105189c7114667a7179Aa57f07647a5f42B7F',
  [ChainId.POLYGON_MAINNET]: '0x630105189c7114667a7179Aa57f07647a5f42B7F',
  [ChainId.NEAR_MAINNET]: 'mos.mfac.butternetwork.near',

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
  [ChainId.MAP_TEST]: '0x2a1E22c89754735c90f507844BDcd94A0193D986',
  [ChainId.MAP_MAINNET]: '0xff44790d336d3C004F2Dac7e401E4EA5680529dD',
};

export const BUTTER_ROUTER_ADDRESS_SET: { [chainId in ChainId]: string } = {
  [ChainId.MAP_MAINNET]: '',
  [ChainId.BSC_MAINNET]: '',
  [ChainId.POLYGON_MAINNET]: '',
  [ChainId.NEAR_MAINNET]: '',

  [ChainId.ETH_PRIV]: '',
  [ChainId.BSC_TEST]: '0x23727fdd88801b9d0A12DE64Ae9c91D671d17c33',
  [ChainId.MAP_TEST]: '',
  [ChainId.POLYGON_TEST]: '0x7A88B312893b56D1FA81bF16775536F9adb68329',
  [ChainId.NEAR_TESTNET]: '',
};
export const BUTTER_CORE_ADDRESS_SET: { [chainId in ChainId]: string } = {
  [ChainId.MAP_MAINNET]: '',
  [ChainId.BSC_MAINNET]: '',
  [ChainId.POLYGON_MAINNET]: '',
  [ChainId.NEAR_MAINNET]: '',

  [ChainId.ETH_PRIV]: '',
  [ChainId.BSC_TEST]: '0xA8d5352e8629B2FFE3d127142FB1D530f8b793eC',
  [ChainId.MAP_TEST]: '',
  [ChainId.POLYGON_TEST]: '0x448484ab100D9F374621eE1A520419CF21349F11',
  [ChainId.NEAR_TESTNET]: '',
};
export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
