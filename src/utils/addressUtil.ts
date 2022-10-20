import { getAddress } from '@ethersproject/address';
import { ChainId, ID_TO_NETWORK_NAME } from '../constants/chains';
import { Token } from '../entities/Token';

/**
 * Validates an address and returns the parsed (checksummed) version of that address
 * @param address the unchecksummed hex address
 */
export function validateAndParseAddressByChainId(
  address: string,
  chainId: number
): string {
  switch (chainId) {
    case ChainId.MAP:
    case ChainId.ETH_PRIV:
    case ChainId.MAP_TEST: {
      try {
        return getAddress(address);
      } catch (error) {
        throw new Error(
          `${address} is not a valid address on ${ID_TO_NETWORK_NAME(chainId)}`
        );
      }
    }
    case ChainId.NEAR_TESTNET: {
      address = address.toLowerCase();
      const words: string[] = address.split('.');
      if (words[words.length - 1] != 'testnet') {
        throw new Error(
          `${address} is not a valid address on ${ID_TO_NETWORK_NAME(chainId)}`
        );
      }
      if (!/^[a-zA-Z\\.]+$/.test(address)) {
        throw new Error(
          `${address} is not a valid address on ${ID_TO_NETWORK_NAME(chainId)}`
        );
      }
      return address;
    }
    default: {
      throw new Error(`${ID_TO_NETWORK_NAME(chainId)} is not supported`);
    }
  }
}

export function validateToken(token: Token): string {
  return validateAndParseAddressByChainId(token.address, token.chainId);
}

/**
 * convert hex format address to decimal array
 * @param address
 * @param chainId
 */
export function hexToDecimalArray(
  address: string,
  chainId: number | string
): number[] {
  if (typeof chainId === 'string') {
    chainId = parseInt(chainId);
  }
  address = validateAndParseAddressByChainId(address, chainId);
  let ret: number[] = [];
  for (let i = 2; i < address.length; i = i + 2) {
    ret.push(parseInt(address.slice(i, i + 2), 16));
  }

  return ret;
}

export function decimalArrayToHex(decimals: number[]): string {
  let ret = '';
  for (let i = 0; i < decimals.length; i++) {
    ret += String.fromCharCode(decimals[i]!);
  }
  return ret;
}
