import { ChainId } from '../constants';

export const IS_MAINNET = (id: string): boolean => {
  switch (id) {
    case '1':
    case ChainId.MAP_MAINNET:
    case ChainId.BSC_MAINNET:
    case ChainId.POLYGON_MAINNET:
    case ChainId.NEAR_MAINNET:
      return true;
    default:
      return false;
  }
};
