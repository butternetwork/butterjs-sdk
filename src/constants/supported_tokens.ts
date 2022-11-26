import { BaseCurrency } from '../entities';
import {
  BSC_TEST_MAP,
  BSC_TEST_MOST,
  BSC_TEST_NATIVE,
  BSC_TEST_NEAR,
  BSC_TEST_WBNB,
  ETH_PRIV_NATIVE,
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
import {
  BSC_TEST_CHAIN,
  ChainId,
  MAP_MAINNET_CHAIN,
  MAP_TEST_CHAIN,
} from './chains';

export const ID_TO_SUPPORTED_TOKEN = (id: string): BaseCurrency[] => {
  switch (id) {
    case MAP_TEST_CHAIN.chainId:
      return [
        MAP_TEST_MOST,
        // MAP_TEST_WMAP,
        MAP_TEST_NEAR,
        MAP_TEST_BNB,
        MAP_TEST_NATIVE,
      ];
    case '34434':
      return [];
    case ChainId.NEAR_TESTNET:
      return [NEAR_TEST_MOST, NEAR_TEST_MAP, NEAR_TEST_NATIVE];
    case ChainId.BSC_TEST:
      return [BSC_TEST_MOST, BSC_TEST_MAP, BSC_TEST_NATIVE];
    case ChainId.MAP_MAINNET:
      return [];
    case ChainId.BSC_MAINNET:
      return [];
    case ChainId.NEAR_MAINNET:
      return [];
    default:
      throw new Error(`Unknown chain id: ${id}`);
  }
};

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
    case '34434':
      return [];
    case ChainId.NEAR_TESTNET:
      return [NEAR_TEST_MOST, NEAR_TEST_MAP, NEAR_TEST_WNEAR, NEAR_TEST_NATIVE];
    case ChainId.BSC_TEST:
      return [BSC_TEST_MOST, BSC_TEST_WBNB, BSC_TEST_MAP, BSC_TEST_NATIVE];

    case ChainId.MAP_MAINNET:
      return [];
    case ChainId.BSC_MAINNET:
      return [];
    case ChainId.NEAR_MAINNET:
      return [];
    default:
      throw new Error(`Unknown chain id: ${id}`);
  }
};
