export class Chain {
  public readonly chainId: number;
  public readonly chainName: string;
  public readonly rpc?: string;
  public readonly scanUrl?: string;
  public readonly chainLogo?: string;

  constructor(
    chainId: number,
    chainName: string,
    rpc?: string,
    scanUrl?: string,
    chainLogo?: string
  ) {
    this.chainId = chainId;
    this.chainName = chainName;
    if (rpc) {
      this.rpc = rpc;
    }
    if (scanUrl) {
      this.scanUrl = scanUrl;
    }
    if (chainLogo) {
      this.chainLogo = chainLogo;
    }
  }
}
