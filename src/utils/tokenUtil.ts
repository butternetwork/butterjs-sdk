import { BaseCurrency } from '../entities';
import {
  BSC_MAINNET_USDC,
  BSC_TEST_MAP,
  BSC_TEST_MOST,
  BSC_TEST_NATIVE,
  BSC_TEST_WBNB,
  ChainId,
  IS_NEAR,
  MAP_TEST_BNB,
  MAP_TEST_MOST,
  MAP_TEST_NATIVE,
  MAP_TEST_NEAR,
  MAP_TEST_WMAP,
  POLYGON_TEST_MAP,
  POLYGON_TEST_MOST,
  POLYGON_TEST_WMATIC,
  NEAR_MAINNET_USDC,
  NEAR_TEST_MAP,
  NEAR_TEST_MOST,
  NEAR_TEST_NATIVE,
  NEAR_TEST_WNEAR,
  POLYGON_MAINNET_USDC,
  BSC_TEST_USDC,
  BSC_TEST_BMOS,
  POLYGON_TEST_BMOS,
  POLYGON_TEST_USDC,
  POLYGON_TEST_NATIVE,
  MAP_TEST_USDC,
  NEAR_TEST_USDC,
  ETH_GOERLI_NATIVE,
  ETH_GOERLI_USDC,
  ETH_GOERLI_WETH,
} from '../constants';
import { getHexAddress } from './addressUtil';

/**
 * get token entity from address and chain id
 * @param tokenAddress
 * @param chainId
 */
export function getTokenByAddressAndChainId(
  tokenAddress: string,
  chainId: string
): BaseCurrency {
  const allToken: BaseCurrency[] = ID_TO_ALL_TOKEN(chainId);
  for (let i = 0; i < allToken.length; i++) {
    if (
      getHexAddress(allToken[i]!.address, chainId, false).toLowerCase() ===
      tokenAddress.toLowerCase()
    ) {
      return allToken[i]!;
    }
  }
  throw new Error(
    `Internal Error: could not find token ${tokenAddress} on chain: ${chainId}`
  );
}

/** Chain Id to supported tokens */
export const ID_TO_SUPPORTED_TOKEN = (id: string): BaseCurrency[] => {
  switch (id) {
    case ChainId.MAP_MAINNET:
      return [];
    case ChainId.BSC_MAINNET:
      return [BSC_MAINNET_USDC];
    case ChainId.POLYGON_MAINNET:
      return [POLYGON_MAINNET_USDC];
    case ChainId.NEAR_MAINNET:
      return [NEAR_MAINNET_USDC];
    case ChainId.MAP_TEST:
      return [MAP_TEST_USDC];
    case ChainId.ETH_GOERLI:
      return [ETH_GOERLI_NATIVE, ETH_GOERLI_USDC];
    case ChainId.ETH_PRIV:
      return [];
    case ChainId.NEAR_TESTNET:
      return [NEAR_TEST_MOST, NEAR_TEST_MAP, NEAR_TEST_NATIVE];
    case ChainId.BSC_TEST:
      return [BSC_TEST_USDC, BSC_TEST_BMOS, BSC_TEST_NATIVE];
    case ChainId.POLYGON_TEST:
      return [POLYGON_TEST_USDC, POLYGON_TEST_BMOS, POLYGON_TEST_NATIVE];
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
        MAP_TEST_USDC,
      ];
    case ChainId.ETH_GOERLI:
      return [ETH_GOERLI_WETH, ETH_GOERLI_NATIVE, ETH_GOERLI_NATIVE];
    case ChainId.ETH_PRIV:
      return [];
    case ChainId.NEAR_TESTNET:
      return [
        NEAR_TEST_MOST,
        NEAR_TEST_MAP,
        NEAR_TEST_WNEAR,
        NEAR_TEST_NATIVE,
        NEAR_TEST_USDC,
      ];
    case ChainId.BSC_TEST:
      return [
        BSC_TEST_MOST,
        BSC_TEST_WBNB,
        BSC_TEST_MAP,
        BSC_TEST_NATIVE,
        BSC_TEST_USDC,
        BSC_TEST_BMOS,
      ];
    case ChainId.POLYGON_TEST:
      return [
        POLYGON_TEST_USDC,
        POLYGON_TEST_BMOS,
        POLYGON_TEST_MOST,
        POLYGON_TEST_WMATIC,
        POLYGON_TEST_MAP,
        MAP_TEST_NATIVE,
      ];
    default:
      throw new Error(`Unknown chain id: ${id}`);
  }
};
