import { Token } from './Token';
import { BaseCurrency } from './BaseCurrency';

export class Chain {
  public readonly chainId: string;
  public readonly chainName: string;
  public readonly rpc?: string;
  public readonly scanUrl?: string;
  public readonly chainLogo?: string;
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
