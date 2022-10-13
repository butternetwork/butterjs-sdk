import { Token } from './Token';

/**
 * Wrapped Near implementation addresses, used in our implementation of Near#wrapped
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
