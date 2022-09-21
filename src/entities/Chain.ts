export class Chain {
  public readonly chainId: number;
  public readonly chainName: string;
  public readonly isMAP: boolean;
  public readonly isEVM: boolean;

  public constructor(
    chainId: number,
    chainName: string,
    isMAP: boolean,
    isEVM: boolean
  ) {
    this.chainId = chainId;
    this.chainName = chainName;
    this.isMAP = isMAP;
    this.isEVM = isEVM;
  }
}
