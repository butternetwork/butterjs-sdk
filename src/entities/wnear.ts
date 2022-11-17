import { Token } from './Token';

/**
 * Wrapped Near implementation addresses, used in our implementation of Near#wrapped
 */
export const WNEAR: { [chainId: string]: Token } = {
  ['5566818579631833089']: new Token(
    '5566818579631833089',
    'wrap.testnet',
    24,
    'WNEAR',
    'Wrapped NEar'
  ),
};
