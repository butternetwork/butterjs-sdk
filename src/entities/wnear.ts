import { Token } from './Token';

/**
 * Known WETH9 implementation addresses, used in our implementation of Ether#wrapped
 */
export const WNEAR: { [chainId: number]: Token } = {
  [1313161555]: new Token(
    1313161555,
    'wrap.testnet',
    24,
    'WNEAR',
    'Wrapped NEar'
  ),
};
