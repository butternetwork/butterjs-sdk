import { TransactionOptions } from '../../types/requestTypes';
import { ButterTransactionResponse } from '../../types/responseTypes';
import BN from 'bn.js';
import { PromiEvent, TransactionReceipt } from 'web3-core';

/**
 * MAP cross-chain service interface.
 */
export interface IMapOmnichainService {
  /**
   * transfer out token(not native coin) from source chain to designated token on target chain
   * @param fromAddress
   * @param tokenAddress input token address
   * @param amount amount in minimal unit
   * @param toAddress target chain receiving address
   * @param toChainId target chain id
   * @param options see {@link TransactionOptions} for more detail
   */
  doTransferOutToken(
    fromAddress: string,
    tokenAddress: string,
    amount: string,
    toAddress: string,
    toChainId: string,
    options?: TransactionOptions
  ): Promise<ButterTransactionResponse>;

  /**
   * transfer out native coin from source chain to designated token on target chain
   * @param fromAddress
   * @param toAddress target chain receiving address
   * @param toChainId target chain id
   * @param amount amount to bridge in minimal unit
   * @param options see {@link TransactionOptions} for more detail
   */
  doTransferOutNative(
    fromAddress: string,
    toAddress: string,
    toChainId: string,
    amount: string,
    options?: TransactionOptions
  ): Promise<ButterTransactionResponse>;

  /**
   * transfer out token(not native coin) from source chain to designated token on target chain
   * @param fromAddress
   * @param tokenAddress input token address
   * @param amount amount in minimal unit
   * @param toAddress target chain receiving address
   * @param toChainId target chain id
   * @param swapData
   * @param options see {@link TransactionOptions} for more detail
   */
  doSwapOutToken(
    fromAddress: string,
    tokenAddress: string,
    amount: string,
    toAddress: string,
    toChainId: string,
    swapData: string,
    options?: TransactionOptions
  ): Promise<ButterTransactionResponse>;

  /**
   * transfer out native coin from source chain to designated token on target chain
   * @param fromAddress
   * @param toAddress target chain receiving address
   * @param toChainId target chain id
   * @param amount amount to bridge in minimal unit
   * @param swapData
   * @param options see {@link TransactionOptions} for more detail
   */
  doSwapOutNative(
    fromAddress: string,
    toAddress: string,
    toChainId: string,
    amount: string,
    swapData: string,
    options?: TransactionOptions
  ): Promise<ButterTransactionResponse>;

  gasEstimateTransferOutToken(
    fromAddress: string,
    tokenAddress: string,
    amount: string,
    toAddress: string,
    toChainId: string,
    options?: TransactionOptions
  ): Promise<string>;

  gasEstimateTransferOutNative(
    fromAddress: string,
    toAddress: string,
    toChainId: string,
    amount: string,
    options?: TransactionOptions
  ): Promise<string>;

  gasEstimateSwapOutToken(
    fromAddress: string,
    tokenAddress: string,
    amount: string,
    toAddress: string,
    toChainId: string,
    swapData: string
  ): Promise<string>;

  gasEstimateSwapOutNative(
    fromAddress: string,
    toAddress: string,
    toChainId: string,
    amount: string,
    swapData: string
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
    amount: string
  ): Promise<string>;
}
