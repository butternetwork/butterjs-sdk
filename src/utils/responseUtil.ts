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
    gasUsed: new BN(transactionReceipt.gasUsed.toString(), 10),
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
    gasUsed: new BN(
      finalExecutionOutcome.transaction_outcome.outcome.gas_burnt,
      10
    ),
    transactionHash: finalExecutionOutcome.transaction.hash,
  };
}
