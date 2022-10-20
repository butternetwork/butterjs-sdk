import { BigNumber } from '@ethersproject/bignumber';
import { Token } from '../entities/Token';
import { ChainId } from './chains';

/**
 * MCS contract address by chainId
 * smart contract source code:
 * {@link https://github.com/barternetwork/barter-mcs-contracts/blob/master/evm/contracts/MAPCrossChainServiceRelay.sol}
 * {@link https://github.com/barternetwork/barter-mcs-contracts/blob/master/evm/contracts/MAPCrossChainService.sol} */
export const MCS_CONTRACT_ADDRESS_SET: { [chainId in ChainId]: string } = {
  [ChainId.ETH_PRIV]: '0x5AAa74B6b5b871B95a45d4D70334565f1E835b9B',
  [ChainId.MAP]: '',
  [ChainId.MAP_TEST]: '0x20C836cdeD399cc368eaA8e4a22f80b2bA659E16',
  [ChainId.NEAR_TESTNET]: 'mcs1666139971341.xyli.testnet',
};

/**
 * TokenRegister Address: https://github.com/barternetwork/barter-mcs-contracts/blob/master/evm/contracts/TokenRegister.sol
 */
export const TOKEN_REGISTER_ADDRESS: string =
  '0x9e15942C4e01238c1cBB75542FDaC85EFcB4eE48';

/**
 * Fee center address: https://github.com/barternetwork/barter-mcs-contracts/blob/master/evm/contracts/FeeCenter.sol
 */
export const FEE_CENTER_ADDRESS: string =
  '0x65C1C6c175244fFb206B66D33A333197dDc5ed7f';
