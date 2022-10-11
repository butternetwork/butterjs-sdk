import { BigNumber } from '@ethersproject/bignumber';
import { Token } from '../entities/Token';
import { ChainId } from './chains';

export const MCS_CONTRACT_ADDRESS_SET: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]: '',
  [ChainId.BSC]: '',
  [ChainId.ETH_PRIV]: '0x2A73b5736f71BdCb888DE1d444682b3abA62d969',
  [ChainId.MAP]: '',
  [ChainId.MAP_TEST]: '0xf0C4f447e361c14F9BF01F9805a78F51FCCb95BB',
  [ChainId.NEAR_TESTNET]: 'mcs.xyli.testnet',
};

export const TOKEN_REGISTER_ADDRESS: string =
  '0xE0c5F1100a8963ea428F5567509fFF853257F7b6';

export const FEE_CENTER_ADDRESS: string =
  '0x398986E4642fCabDbF6d318C4EeCE05027a0dF34';
