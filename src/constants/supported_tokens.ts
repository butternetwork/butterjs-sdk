import { BaseCurrency } from '../entities';
import {
  BSC_TEST_MAP,
  BSC_TEST_MOST,
  BSC_TEST_NATIVE,
  BSC_TEST_NEAR,
  BSC_TEST_WBNB,
  ETH_PRIV_LMAP,
  ETH_PRIV_NATIVE,
  ETH_PRIV_NEAR,
  ETH_PRIV_WETH,
  MAP_TEST_BNB,
  MAP_TEST_METH,
  MAP_TEST_MOST,
  MAP_TEST_NATIVE,
  MAP_TEST_NEAR,
  MAP_TEST_WMAP,
  NEAR_TEST_MAP,
  NEAR_TEST_MOST,
  NEAR_TEST_NATIVE,
  NEAR_TEST_WNEAR,
} from './tokens';
import { BSC_TEST_CHAIN } from './chains';

export const ID_TO_SUPPORTED_TOKEN = (id: string): BaseCurrency[] => {
  switch (id) {
    case '212':
      return [
        MAP_TEST_MOST,
        // MAP_TEST_WMAP,
        MAP_TEST_NEAR,
        MAP_TEST_BNB,
        MAP_TEST_NATIVE,
      ];
    case '34434':
      return [];
    case '5566818579631833089':
      return [NEAR_TEST_MOST, NEAR_TEST_MAP, NEAR_TEST_NATIVE];
    case '97':
      return [BSC_TEST_MOST, BSC_TEST_MAP, BSC_TEST_NATIVE];
    default:
      throw new Error(`Unknown chain id: ${id}`);
  }
};

export const ID_TO_ALL_TOKEN = (id: string): BaseCurrency[] => {
  switch (id) {
    case '212':
      return [
        MAP_TEST_MOST,
        MAP_TEST_WMAP,
        MAP_TEST_NEAR,
        MAP_TEST_BNB,
        MAP_TEST_NATIVE,
      ];
    case '34434':
      return [];
    case '5566818579631833089':
      return [NEAR_TEST_MOST, NEAR_TEST_MAP, NEAR_TEST_WNEAR, NEAR_TEST_NATIVE];
    case '97':
      return [BSC_TEST_MOST, BSC_TEST_WBNB, BSC_TEST_MAP, BSC_TEST_NATIVE];
    default:
      throw new Error(`Unknown chain id: ${id}`);
  }
};
