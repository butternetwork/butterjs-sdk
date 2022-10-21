import { BigNumber } from '@ethersproject/bignumber';
import { Token } from '../entities/Token';
import { ChainId } from './chains';

/**
 * MCS contract address by chainId
 * smart contract source code:
 * {@link https://github.com/barternetwork/barter-mcs-contracts/blob/master/evm/contracts/MAPCrossChainServiceRelay.sol}
 * {@link https://github.com/barternetwork/barter-mcs-contracts/blob/master/evm/contracts/MAPCrossChainService.sol} */
export const MCS_CONTRACT_ADDRESS_SET: { [chainId in ChainId]: string } = {
  [ChainId.ETH_PRIV]: '0xe83402EdA0a296A7cF5E6fBC8ECBB424E85a8961',
  [ChainId.MAP]: '',
  [ChainId.MAP_TEST]: '0x27d00d295B045A4dB6511f1e88a4D7f79ec45F22',
  [ChainId.NEAR_TESTNET]: 'mcs1666317672030.xyli.testnet',
};

/**
 * TokenRegister Address: https://github.com/barternetwork/barter-mcs-contracts/blob/master/evm/contracts/TokenRegister.sol
 */
export const TOKEN_REGISTER_ADDRESS: string =
  '0x8349ba078eD557b439d71a4aACF3851988DBb175';

/**
 * Fee center address: https://github.com/barternetwork/barter-mcs-contracts/blob/master/evm/contracts/FeeCenter.sol
 */
export const FEE_CENTER_ADDRESS: string =
  '0xb5eB7285B756E8c438A673478F0189E47615eFCA';
