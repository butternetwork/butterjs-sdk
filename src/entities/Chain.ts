/**
 * Represents a chain with some metadata.
 */
export class Chain {
  /** chain id, we use string because some non-evm chain might have larger chainId that we defiend*/
  public readonly chainId: string;

  /** name of the chain */
  public readonly chainName: string;

  /** chain rpc uri */
  public readonly rpc?: string;

  /** chain scan url */
  public readonly scanUrl?: string;

  /** chain logo */
  public readonly chainLogo?: string;

  /** chain symbol **/
  public readonly symbol?: string;

  constructor(
    chainId: string,
    chainName: string,
    rpc?: string,
    scanUrl?: string,
    chainLogo?: string,
    symbol?: string
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
    if (symbol) {
      this.symbol = symbol;
    }
  }
}
