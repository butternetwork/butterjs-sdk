import invariant from 'tiny-invariant';
import { Currency } from '../Currency';
import { NativeCurrency } from '../NativeCurrency';
import { Token } from '../Token';
import { WNEAR } from '../wnear';
import { ZERO_ADDRESS } from '../../constants';

/**
 * Near is the main usage of a 'native' currency, i.e. for Near mainnet and all testnets
 */
export class NearNativeCoin extends NativeCurrency {
  public constructor(chainId: number) {
    super(chainId, 24, ZERO_ADDRESS, 'NEAR', 'NEAR');
  }

  public get wrapped(): Token {
    const wnear = WNEAR[this.chainId];
    invariant(!!wnear, 'WRAPPED');
    return wnear;
  }

  public equals(other: Currency): boolean {
    return other.isNative && other.chainId === this.chainId;
  }
}
