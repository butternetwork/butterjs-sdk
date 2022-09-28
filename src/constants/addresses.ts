import { BigNumber } from '@ethersproject/bignumber';
import { Token } from '../entities/Token';
import { ChainId } from './chains';

export const MCS_CONTRACT_ADDRESS_SET: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]: '',
  [ChainId.BSC]: '',
  [ChainId.ETH_PRIV]: '0xbD96b27fE75E1Ed108DcDaC64B8460154D4B6819',
  [ChainId.MAP]: '',
  [ChainId.MAP_TEST]: '0x1902347e9CCC4e4aa0cf0b19844bf528f0031642',
  [ChainId.NEAR_TESTNET]: 'mcs.xyli.testnet',
};

export const TOKEN_REGISTER_ADDRESS: string =
  '0x05EEf4f1dafE7E4BAbb17261ef538930fd2267e3';
