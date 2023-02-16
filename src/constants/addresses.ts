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
  [ChainId.ETH_GOERLI]: '0x2e2D0FBF6c69B21a56d49ca3A31fEB8Df923f2FB',
  [ChainId.BSC_TEST]: '0x6858B990A504D7Fc41D0BBB5178c4675518BDA27',
  [ChainId.MAP_TEST]: '0xb4fCfdD492202c91A7eBaf887642F437a07A2664',
  [ChainId.POLYGON_TEST]: '0x6858B990A504D7Fc41D0BBB5178c4675518BDA27',
  [ChainId.NEAR_TESTNET]: 'mos.map007.testnet',
};

/**
 * TokenRegister Address: https://github.com/butternetwork/butter-mos-contracts/blob/master/evm/contracts/TokenRegister.sol
 */
export const TOKEN_REGISTER_ADDRESS_SET: { [chainId: string]: string } = {
  [ChainId.MAP_TEST]: '0x636fCd559cc620dd7233aFD3c3556f63Bd39e721',
  [ChainId.MAP_MAINNET]: '0xff44790d336d3C004F2Dac7e401E4EA5680529dD',
};

export const BUTTER_ROUTER_ADDRESS_SET: { [chainId in ChainId]: string } = {
  [ChainId.MAP_MAINNET]: '',
  [ChainId.BSC_MAINNET]: '',
  [ChainId.POLYGON_MAINNET]: '',
  [ChainId.NEAR_MAINNET]: '',

  [ChainId.ETH_PRIV]: '',
  [ChainId.ETH_GOERLI]: '0x8A75D36796f823d21284C79A5Ab80ACaA90BB77a',
  [ChainId.BSC_TEST]: '0x9920f3d762C13b1AbbC8c3D8425C61B0EAe9213b',
  [ChainId.MAP_TEST]: '',
  [ChainId.POLYGON_TEST]: '0x409425E311eda1DbfBe6480dC230C40bf1eA276D',
  [ChainId.NEAR_TESTNET]: '',
};

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
