import { BigNumber } from '@ethersproject/bignumber';
import { Token } from '../entities/Token';
import { ChainId } from './chains';
import { ethers } from 'ethers';

/**
 * MCS contract address by chainId
 * smart contract source code:
 * {@link https://github.com/barternetwork/barter-mcs-contracts/blob/master/evm/contracts/MAPCrossChainServiceRelay.sol}
 * {@link https://github.com/barternetwork/barter-mcs-contracts/blob/master/evm/contracts/MAPCrossChainService.sol} */
export const MCS_CONTRACT_ADDRESS_SET: { [chainId in ChainId]: string } = {
  [ChainId.ETH_PRIV]: '0x43130059C655314d7ba7eDfb8299d26FbDE726F1',
  [ChainId.MAP]: '',
  [ChainId.MAP_TEST]: '0xf0C4f447e361c14F9BF01F9805a78F51FCCb95BB',
  [ChainId.NEAR_TESTNET]: 'mcs1666756751219.xyli.testnet',
};

/**
 * TokenRegister Address: https://github.com/barternetwork/barter-mcs-contracts/blob/master/evm/contracts/TokenRegister.sol
 */
export const TOKEN_REGISTER_ADDRESS_SET: { [chainId: number]: string } = {
  212: '0xF21C6a69e34D4aB54CB6907B134394ced64b1319',
};

/**
 * Fee center address: https://github.com/barternetwork/barter-mcs-contracts/blob/master/evm/contracts/FeeCenter.sol
 */
export const FEE_CENTER_ADDRESS_SET: { [chainId: number]: string } = {
  212: '0xE0c5F1100a8963ea428F5567509fFF853257F7b6',
};

export const ZERO_ADDRESS = ethers.constants.AddressZero;
