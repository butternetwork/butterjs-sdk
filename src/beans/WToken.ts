import { Token } from './Token';
import {
  ChainId,

  BSC_MAINNET_WBNB,
  BSC_TEST_WBNB,
  ETH_PRIV_WETH,
  MAP_MAINNET_WMAP,
  MAP_TEST_WMAP,
  POLYGON_TEST_WMATIC,
  NEAR_MAINNET_WNEAR,
  NEAR_TEST_WNEAR,
  POLYGON_MAINNET_WMATIC,
  ETH_GOERLI_WETH,
} from '../constants';

/**
 * Known WToken implementation addresses, used in our implementation of EVMNativCoin#wrapped
 */
export const WToken = (id: string): Token => {
  switch (id) {
    case ChainId.MAP_MAINNET:
      return MAP_MAINNET_WMAP;
    case ChainId.BSC_MAINNET:
      return BSC_MAINNET_WBNB;
    case ChainId.POLYGON_MAINNET:
      return POLYGON_MAINNET_WMATIC;
    case ChainId.NEAR_MAINNET:
      return NEAR_MAINNET_WNEAR;
    case ChainId.ETH_PRIV:
      return ETH_PRIV_WETH;
    case ChainId.MAP_TEST:
      return MAP_TEST_WMAP;
    case ChainId.ETH_GOERLI:
      return ETH_GOERLI_WETH;
    case ChainId.BSC_TEST:
      return BSC_TEST_WBNB;
    case ChainId.NEAR_TESTNET:
      return NEAR_TEST_WNEAR;
    case ChainId.POLYGON_TEST:
      return POLYGON_TEST_WMATIC;
    default:
      throw new Error('could not find wrapped token for chain id: ' + id);
  }
};
