import { BigNumber } from '@ethersproject/bignumber';
import BN from 'bn.js';
import { BaseCurrency } from '../entities';
import {
  PromiEvent,
  TransactionReceipt as Web3TransactionReceipt,
} from 'web3-core';
import { AccountView } from 'near-api-js/lib/providers/provider';
import { Log } from '@ethersproject/abstract-provider';

export interface ButterTransactionReceipt {
  to: string;
  from: string;
  gasUsed: string;
  transactionHash: string;
  logs: Array<Log> | string[]; // string[] for near logs
  blockHash?: string;
  blockNumber?: number;
  success?: boolean; // 1 success, 0 failed
}

export interface ButterTransactionResponse {
  hash?: string;
  wait?: () => Promise<ButterTransactionReceipt>;
  promiReceipt?: PromiEvent<Web3TransactionReceipt>;
}

export type ButterFeeRate = {
  lowest: string;
  highest: string;
  rate: string; // bps
};

export interface ButterFee {
  feeToken: BaseCurrency;
  amount: string;
  feeRate: ButterFeeRate;
  feeDistribution?: ButterFeeDistribution;
}

export type ButterFeeDistribution = {
  protocol: string; // bps
  relayer: string; // bps
  lp: string; // bps
};

export type NearAccountState = {
  isValid: boolean;
  state?: AccountView;
  errMsg?: string;
};

export interface VaultBalance {
  token: BaseCurrency; // vault token
  balance: string; // amount in minimal uint
  isMintable: boolean; // is token mintable, if it is, then there is no need to show balance
}
