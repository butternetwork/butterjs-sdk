import { BigNumber } from '@ethersproject/bignumber';
import BN from 'bn.js';

export interface ContractCallReceipt {
  to: string;
  from: string;
  gasUsed: BN;
  transactionHash: string;
  blockHash?: string;
  blockNumber?: number;
}
