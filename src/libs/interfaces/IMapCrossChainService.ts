import { TransferOutOptions } from '../../types/requestTypes';

export interface IMapCrossChainService {
  doTransferOutToken(
    tokenAddress: string,
    amount: string,
    toAddress: string | number[],
    toChainId: string,
    options?: TransferOutOptions
  ): Promise<string>;

  doTransferOutNative(
    toAddress: string | number[],
    toChainId: string,
    amount: string,
    options?: TransferOutOptions
  ): Promise<string>;

  doDepositOutToken(
    tokenAddress: string,
    from: string,
    to: string,
    amount: string,
    options?: TransferOutOptions
  ): Promise<string>;
}
