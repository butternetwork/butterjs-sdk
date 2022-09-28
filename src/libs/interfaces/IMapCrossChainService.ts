export interface IMapCrossChainService {
  doTransferOutToken(
    tokenAddress: string,
    amount: string,
    toAddress: string,
    toChain: string
  ): Promise<void>;

  doTransferOutNative(
    toAddress: string,
    toChain: string,
    amount: string
  ): Promise<void>;

  doDepositOutToken(
    tokenAddress: string,
    from: string,
    to: string,
    amount: string
  ): Promise<void>;
}
