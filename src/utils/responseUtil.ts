import { BarterContractCallReceipt } from '../types/responseTypes';
import { FinalExecutionOutcome } from 'near-api-js/lib/providers';
import { BarterReceiptType } from '../types/paramTypes';

export function adaptEthReceipt(
  transactionReceipt: BarterReceiptType
): BarterContractCallReceipt {
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
): BarterContractCallReceipt {
  return {
    to: finalExecutionOutcome.transaction.receiver_id,
    from: finalExecutionOutcome.transaction.signer_id,
    gasUsed:
      finalExecutionOutcome.transaction_outcome.outcome.gas_burnt.toString(),

    transactionHash: finalExecutionOutcome.transaction.hash,
  };
}
