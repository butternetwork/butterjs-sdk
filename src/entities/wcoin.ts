import { Token } from './Token';
import {
  BSC_TEST_WBNB,
  ChainId,
  ETH_PRIV_WETH,
  MAP_TEST_WMAP,
  MATIC_TEST_WMATIC,
  NEAR_TEST_WNEAR,
} from '../constants';

/**
 * Known Wcoin implementation addresses, used in our implementation of EVMNativCoin#wrapped
 */
export const WCOIN = (id: string): Token => {
  switch (id) {
    case ChainId.ETH_PRIV:
      return ETH_PRIV_WETH;
    case ChainId.MAP_TEST:
      return MAP_TEST_WMAP;
    case ChainId.BSC_TEST:
      return BSC_TEST_WBNB;
    case ChainId.NEAR_TESTNET:
      return NEAR_TEST_WNEAR;
    case ChainId.MAP:
      return MAP_TEST_WMAP;
    case ChainId.MATIC_TEST:
      return MATIC_TEST_WMATIC;
    default:
      throw new Error('could not find wrapped token for chain id: ' + id);
  }
};
