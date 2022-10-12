import { TransferOutOptions } from '../../types/requestTypes';

export interface IMapCrossChainService {
  doTransferOutToken(
    tokenAddress: string,
    amount: string,
    toAddress: string,
    toChainId: string,
    options?: TransferOutOptions
  ): Promise<string>;

  doTransferOutNative(
    toAddress: string,
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
