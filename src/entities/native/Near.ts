import invariant from 'tiny-invariant';
import { Currency } from '../Currency';
import { NativeCurrency } from '../NativeCurrency';
import { Token } from '../Token';
import { ID_TO_CHAIN_ID, ZERO_ADDRESS } from '../../constants';
import { WCOIN } from '../wcoin';

/**
 * Near is the main usage of a 'native' currency, i.e. for Near mainnet and all testnets
 */
export class NearNativeCoin extends NativeCurrency {
  public constructor(chainId: string) {
    super(
      chainId,
      24,
      ZERO_ADDRESS,
      'NEAR',
      'NEAR',
      'https://cryptologos.cc/logos/near-protocol-near-logo.png'
    );
  }

  public get wrapped(): Token {
    const wnear = WCOIN(this.chainId);
    invariant(!!wnear, 'WRAPPED');
    return wnear;
  }

  public equals(other: Currency): boolean {
    return other.isNative && other.chainId === this.chainId;
  }
}
