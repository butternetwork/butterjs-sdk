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
  [ChainId.BSC_TEST]: '0x8A6aaDf40fB100f4a27c9ADA1B0F0d90eC91F35C',
  [ChainId.MAP_TEST]: '0x9D8ECF3aa8a93be0bb026fAd7529d9Be8F5849B9',
  [ChainId.POLYGON_TEST]: '0xA179d181cF855258Bc26a8623E1CE7a2e3fD3606',
  [ChainId.NEAR_TESTNET]: 'mos2.mfac.maplabs.testnet',
};

/**
 * TokenRegister Address: https://github.com/butternetwork/butter-mos-contracts/blob/master/evm/contracts/TokenRegister.sol
 */
export const TOKEN_REGISTER_ADDRESS_SET: { [chainId: string]: string } = {
  [ChainId.MAP_TEST]: '0x648349aDd3790813787746A7A569a87216944003',
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
