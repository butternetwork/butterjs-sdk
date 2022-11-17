import { Token } from './Token';

/**
 * Known WETH9 implementation addresses, used in our implementation of EVMNativCoin#wrapped
 */
export const WETH9: { [chainId: string]: Token } = {
  ['34434']: new Token(
    '34434',
    '0xB59B98DF47432371A36A8F83fC7fd8371ec1300B',
    18,
    'WETH',
    'Wrapped EVMNativCoin'
  ),
};
