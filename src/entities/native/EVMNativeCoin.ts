import invariant from 'tiny-invariant';
import { Currency } from '../Currency';
import { NativeCurrency } from '../NativeCurrency';
import { Token } from '../Token';
import { WETH9 } from '../weth9';
import { ZERO_ADDRESS } from '../../constants';

/**
 * EVMNativCoin is the main usage of a 'native' currency, i.e. for Ethereum mainnet and all testnets
 */
export class EVMNativeCoin extends NativeCurrency {
  public constructor(
    chainId: number,
    decimal: number,
    symbol?: string,
    name?: string,
    logo?: string
  ) {
    super(chainId, decimal, ZERO_ADDRESS, symbol, name, logo);
  }

  public get wrapped(): Token {
    const weth9 = WETH9[this.chainId];
    invariant(!!weth9, 'WRAPPED');
    return weth9;
  }

  private static _etherCache: { [chainId: number]: EVMNativeCoin } = {};

  public equals(other: Currency): boolean {
    return other.isNative && other.chainId === this.chainId;
  }
}
