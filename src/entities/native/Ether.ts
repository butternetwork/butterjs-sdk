import invariant from 'tiny-invariant';
import { Currency } from '../Currency';
import { NativeCurrency } from '../NativeCurrency';
import { Token } from '../Token';
import { WETH9 } from '../weth9';
import { ZERO_ADDRESS } from '../../constants';

/**
 * Ether is the main usage of a 'native' currency, i.e. for Ethereum mainnet and all testnets
 */
export class Ether extends NativeCurrency {
  public constructor(chainId: number) {
    super(chainId, 18, ZERO_ADDRESS, 'ETH', 'Ether');
  }

  public get wrapped(): Token {
    const weth9 = WETH9[this.chainId];
    invariant(!!weth9, 'WRAPPED');
    return weth9;
  }

  private static _etherCache: { [chainId: number]: Ether } = {};

  public static onChain(chainId: number): Ether {
    return (
      this._etherCache[chainId] ??
      (this._etherCache[chainId] = new Ether(chainId))
    );
  }

  public equals(other: Currency): boolean {
    return other.isNative && other.chainId === this.chainId;
  }
}
