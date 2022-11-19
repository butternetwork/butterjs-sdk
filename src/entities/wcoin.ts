import { Token } from './Token';
import {
  BSC_TEST_WBNB,
  ChainId,
  ChainName,
  MAP_TEST_WMAP,
  NEAR_TEST_WNEAR,
} from '../constants';

/**
 * Known Wcoin implementation addresses, used in our implementation of EVMNativCoin#wrapped
 */
export const WCOIN = (id: string): Token => {
  switch (id) {
    case ChainId.ETH_PRIV:
      return new Token(
        '34434',
        '0xB59B98DF47432371A36A8F83fC7fd8371ec1300B',
        18,
        'WETH',
        'Wrapped EVMNativCoin'
      );
    case ChainId.MAP_TEST:
      return MAP_TEST_WMAP;
    case ChainId.BSC_TEST:
      return BSC_TEST_WBNB;
    case ChainId.NEAR_TESTNET:
      return NEAR_TEST_WNEAR;
    case ChainId.MAP:
      return MAP_TEST_WMAP;
    default:
      throw new Error('could not find wrapped token for chain id: ' + id);
  }
};
