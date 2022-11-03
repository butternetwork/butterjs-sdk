import { BaseCurrency } from '../entities';
import {
  ETH_PRIV_LMAP,
  ETH_PRIV_NATIVE,
  ETH_PRIV_NEAR,
  ETH_PRIV_WETH,
  MAP_TEST_METH,
  MAP_TEST_NATIVE,
  MAP_TEST_NEAR,
  MAP_TEST_WMAP,
  NEAR_TEST_NATIVE,
} from './tokens';

export const ID_TO_SUPPORTED_TOKEN = (id: number): BaseCurrency[] => {
  switch (id) {
    case 212:
      return [MAP_TEST_METH, MAP_TEST_NATIVE, MAP_TEST_NEAR, MAP_TEST_WMAP];
    case 34434:
      return [ETH_PRIV_NEAR, ETH_PRIV_WETH, ETH_PRIV_NATIVE, ETH_PRIV_LMAP];
    case 1313161555:
      return [NEAR_TEST_NATIVE];
    default:
      throw new Error(`Unknown chain id: ${id}`);
  }
};
