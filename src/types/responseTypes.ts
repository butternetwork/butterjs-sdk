import { BigNumber } from '@ethersproject/bignumber';
import BN from 'bn.js';
import { BaseCurrency } from '../entities';

export interface ContractCallReceipt {
  to: string;
  from: string;
  gasUsed: string;
  transactionHash: string;
  blockHash?: string;
  blockNumber?: number;
}

export interface BarterFee {
  feeToken: BaseCurrency;
  amount: string;
  feeDistribution?: BarterFeeDistribution;
}

export type BarterFeeDistribution = {
  protocol: number;
  compensation: number;
  lp?: number;
};

export interface VaultBalance {
  token: BaseCurrency; // vault token
  balance: string; // amount in minimal uint
}
