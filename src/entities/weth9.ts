import { Token } from './Token';

/**
 * Known WETH9 implementation addresses, used in our implementation of Ether#wrapped
 */
export const WETH9: { [chainId: number]: Token } = {
  [1]: new Token(
    1,
    '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    18,
    'WETH',
    'Wrapped Ether'
  ),
  [34434]: new Token(
    34434,
    '0xB59B98DF47432371A36A8F83fC7fd8371ec1300B',
    18,
    'WETH',
    'Wrapped Ether'
  ),
};
