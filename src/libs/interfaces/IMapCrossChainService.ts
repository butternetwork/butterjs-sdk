import { TransferOutOptions } from '../../types/requestTypes';
import { BarterTransactionResponse } from '../../types/responseTypes';
import BN from 'bn.js';
import { PromiEvent, TransactionReceipt } from 'web3-core';

/**
 * MAP cross-chain service interface.
 */
export interface IMapCrossChainService {
  /**
   * transfer out token(not native coin) from source chain to designated token on target chain
   * @param fromAddress
   * @param tokenAddress input token address
   * @param amount amount in minimal unit
   * @param toAddress target chain receiving address
   * @param toChainId target chain id
   * @param options see {@link TransferOutOptions} for more detail
   */
  doTransferOutToken(
    fromAddress: string,
    tokenAddress: string,
    amount: string,
    toAddress: string,
    toChainId: string,
    options?: TransferOutOptions
  ): Promise<BarterTransactionResponse>;

  gasEstimateTransferOutToken(
    fromAddress: string,
    tokenAddress: string,
    amount: string,
    toAddress: string,
    toChainId: string,
    options?: TransferOutOptions
  ): Promise<string>;

  /**
   * transfer out native coin from source chain to designated token on target chain
   * @param fromAddress
   * @param toAddress target chain receiving address
   * @param toChainId target chain id
   * @param amount amount to bridge in minimal unit
   * @param options see {@link TransferOutOptions} for more detail
   */
  doTransferOutNative(
    fromAddress: string,
    toAddress: string,
    toChainId: string,
    amount: string,
    options?: TransferOutOptions
  ): Promise<BarterTransactionResponse>;

  gasEstimateTransferOutNative(
    fromAddress: string,
    toAddress: string,
    toChainId: string,
    amount: string,
    options?: TransferOutOptions
  ): Promise<string>;

  /**
   * TODO: In development
   * @param tokenAddress
   * @param from
   * @param to
   * @param amount
   * @param options
   */
  doDepositOutToken(
    tokenAddress: string,
    from: string,
    to: string,
    amount: string,
    options?: TransferOutOptions
  ): Promise<string>;
}
