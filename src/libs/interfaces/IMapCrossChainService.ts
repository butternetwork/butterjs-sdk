import { TransferOutOptions } from '../../types/requestTypes';
import { ContractCallReceipt } from '../../types/responseTypes';
import BN from 'bn.js';

/**
 * MAP cross-chain service interface.
 */
export interface IMapCrossChainService {
  /**
   * transfer out token(not native coin) from source chain to designated token on target chain
   * @param tokenAddress input token address
   * @param amount amount in minimal unit
   * @param toAddress target chain receiving address
   * @param toChainId target chain id
   * @param gasEstimation do gas estimate or not
   * @param options see {@link TransferOutOptions} for more detail
   */
  doTransferOutToken(
    tokenAddress: string,
    amount: string,
    toAddress: string,
    toChainId: string,
    gasEstimation: boolean,
    options?: TransferOutOptions
  ): Promise<ContractCallReceipt | BN>;

  /**
   * transfer out native coin from source chain to designated token on target chain
   * @param toAddress target chain receiving address
   * @param toChainId target chain id
   * @param amount amount to bridge in minimal unit
   * @param gasEstimation do gas estimate or not
   * @param options see {@link TransferOutOptions} for more detail
   */
  doTransferOutNative(
    toAddress: string,
    toChainId: string,
    amount: string,
    gasEstimation: boolean,
    options?: TransferOutOptions
  ): Promise<ContractCallReceipt | BN>;

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
