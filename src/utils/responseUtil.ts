import { TransactionReceipt } from '@ethersproject/abstract-provider';
import { ContractCallReceipt } from '../types/responseTypes';
import BN from 'bn.js';
import { FinalExecutionOutcome } from 'near-api-js/lib/providers';

export function adaptEtherReceipt(
  transactionReceipt: TransactionReceipt
): ContractCallReceipt {
  return {
    to: transactionReceipt.to,
    from: transactionReceipt.from,
    gasUsed: transactionReceipt.gasUsed.toString(),
    blockHash: transactionReceipt.blockHash,
    transactionHash: transactionReceipt.transactionHash,
    blockNumber: transactionReceipt.blockNumber,
  };
}

export function adaptNearReceipt(
  finalExecutionOutcome: FinalExecutionOutcome
): ContractCallReceipt {
  return {
    to: finalExecutionOutcome.transaction.receiver_id,
    from: finalExecutionOutcome.transaction.signer_id,
    gasUsed:
      finalExecutionOutcome.transaction_outcome.outcome.gas_burnt.toString(),

    transactionHash: finalExecutionOutcome.transaction.hash,
  };
}
