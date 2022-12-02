import { BaseCurrency } from '../entities';
import {
  BSC_TEST_MAP,
  BSC_TEST_MOST,
  BSC_TEST_NATIVE,
  BSC_TEST_WBNB,
  MAP_TEST_BNB,
  MAP_TEST_MOST,
  MAP_TEST_NATIVE,
  MAP_TEST_NEAR,
  MAP_TEST_WMAP,
  NEAR_TEST_MAP,
  NEAR_TEST_MOST,
  NEAR_TEST_NATIVE,
  NEAR_TEST_WNEAR,
} from './tokens';
import { ChainId } from './chains';

/** Chain Id to supported tokens */
export const ID_TO_SUPPORTED_TOKEN = (id: string): BaseCurrency[] => {
  switch (id) {
    case ChainId.MAP_TEST:
      return [
        MAP_TEST_MOST,
        // MAP_TEST_WMAP,
        MAP_TEST_NEAR,
        MAP_TEST_BNB,
        MAP_TEST_NATIVE,
      ];
    case ChainId.ETH_PRIV:
      return [];
    case ChainId.NEAR_TESTNET:
      return [NEAR_TEST_MOST, NEAR_TEST_MAP, NEAR_TEST_NATIVE];
    case ChainId.BSC_TEST:
      return [BSC_TEST_MOST, BSC_TEST_MAP, BSC_TEST_NATIVE];
    default:
      throw new Error(`Unknown chain id: ${id}`);
  }
};

/** Chain Id to all available tokens */
export const ID_TO_ALL_TOKEN = (id: string): BaseCurrency[] => {
  switch (id) {
    case ChainId.MAP_TEST:
      return [
        MAP_TEST_MOST,
        MAP_TEST_WMAP,
        MAP_TEST_NEAR,
        MAP_TEST_BNB,
        MAP_TEST_NATIVE,
      ];
    case ChainId.ETH_PRIV:
      return [];
    case ChainId.NEAR_TESTNET:
      return [NEAR_TEST_MOST, NEAR_TEST_MAP, NEAR_TEST_WNEAR, NEAR_TEST_NATIVE];
    case ChainId.BSC_TEST:
      return [BSC_TEST_MOST, BSC_TEST_WBNB, BSC_TEST_MAP, BSC_TEST_NATIVE];
    default:
      throw new Error(`Unknown chain id: ${id}`);
  }
};
