import {
  ButterTransactionReceipt,
  ButterTransactionResponse,
} from '../types/responseTypes';
import { FinalExecutionOutcome } from 'near-api-js/lib/providers';
import { ButterProviderType, ButterReceiptType } from '../types/paramTypes';
import { NearNetworkConfig } from '../types';
import { Signer } from 'ethers';
import { Provider } from '@ethersproject/abstract-provider';

/**
 * adapt different receipt into unified butter transaction receipt
 * @param transactionReceipt
 */
export function adaptEthReceipt(
  transactionReceipt: ButterReceiptType
): ButterTransactionReceipt {
  return {
    to: transactionReceipt.to,
    from: transactionReceipt.from,
    gasUsed: transactionReceipt.gasUsed.toString(),
    blockHash: transactionReceipt.blockHash,
    transactionHash: transactionReceipt.transactionHash,
    blockNumber: transactionReceipt.blockNumber,
    logs: transactionReceipt.logs,
  };
}

export function adaptNearReceipt(
  finalExecutionOutcome: FinalExecutionOutcome
): ButterTransactionReceipt {
  return {
    to: finalExecutionOutcome.transaction.receiver_id,
    from: finalExecutionOutcome.transaction.signer_id,
    gasUsed:
      finalExecutionOutcome.transaction_outcome.outcome.gas_burnt.toString(),

    transactionHash: finalExecutionOutcome.transaction.hash,
    logs: finalExecutionOutcome.transaction_outcome.outcome.logs,
  };
}

export function assembleNearTransactionResponse(
  executionOutcome: FinalExecutionOutcome
): ButterTransactionResponse {
  return <ButterTransactionResponse>{
    hash: executionOutcome.transaction.hash,
    wait: async (): Promise<ButterTransactionReceipt> => {
      return Promise.resolve(adaptNearReceipt(executionOutcome));
    },
  };
}

export function assembleEVMTransactionResponse(
  transactionHash: string,
  provider: ButterProviderType
): ButterTransactionResponse {
  return <ButterTransactionResponse>{
    hash: transactionHash!,
    wait: async (): Promise<ButterTransactionReceipt> => {
      if (provider instanceof Signer) {
        const receipt = await provider.provider?.waitForTransaction(
          transactionHash
        );
        return Promise.resolve(adaptEthReceipt(receipt!));
      } else if (provider instanceof Provider) {
        const receipt = await provider.waitForTransaction(transactionHash);
        return Promise.resolve(adaptEthReceipt(receipt));
      } else {
        const receipt = await provider.getTransactionReceipt(transactionHash);
        return Promise.resolve(adaptEthReceipt(receipt!));
      }
    },
  };
}
