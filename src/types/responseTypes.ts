import { BigNumber } from '@ethersproject/bignumber';
import BN from 'bn.js';
import { BaseCurrency } from '../entities';
import {
  PromiEvent,
  TransactionReceipt as Web3TransactionReceipt,
} from 'web3-core';

export interface ButterTransactionReceipt {
  to: string;
  from: string;
  gasUsed: string;
  transactionHash: string;
  blockHash?: string;
  blockNumber?: number;
  success?: boolean; // 1 success, 0 failed
}

export interface ButterTransactionResponse {
  hash?: string;
  wait?: () => Promise<ButterTransactionReceipt>;
  promiReceipt?: PromiEvent<Web3TransactionReceipt>;
}

export interface ButterFee {
  feeToken: BaseCurrency;
  amount: string;
  feeDistribution?: ButterFeeDistribution;
}

export type ButterFeeDistribution = {
  protocol: number;
  compensation: number;
  lp?: number;
};

export interface VaultBalance {
  token: BaseCurrency; // vault token
  balance: string; // amount in minimal uint
}
