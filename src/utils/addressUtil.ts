import { getAddress } from '@ethersproject/address';
import {
  ChainId,
  ID_TO_NETWORK_NAME,
  IS_EVM,
  IS_NEAR,
} from '../constants/chains';
import { Token } from '../entities/Token';
import { ZERO_ADDRESS } from '../constants';

/**
 * Validates an address and returns the parsed (checksummed) version of that address
 * @param address the unchecksummed hex address
 */
export function validateAndParseAddressByChainId(
  address: string,
  chainId: string
): string {
  switch (chainId) {
    case ChainId.MAP:
    case ChainId.ETH_PRIV:
    case ChainId.BSC_TEST:
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
      if (words[words.length - 1] != 'testnet' && address.length != 32) {
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
export function hexToDecimalArray(address: string, chainId: string): number[] {
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

export function getHexAddress(
  address: string,
  chainId: string,
  isAddress: boolean
): string {
  if (IS_EVM(chainId)) {
    return address;
  } else if (IS_NEAR(chainId)) {
    return address.startsWith('0x') ? address : asciiToHex(address, isAddress);
  } else {
    throw new Error(`chain id: ${chainId} not supported`);
  }
}

/**
 * @param input
 * @param hexLength
 */
export function asciiToHex(input: string, isAddress: boolean): string {
  let hexArr = [];
  for (let i = 0; i < input.length; i++) {
    let hex = Number(input.charCodeAt(i)).toString(16);
    hexArr.push(hex);
  }
  let res = hexArr.join('');
  if (isAddress) {
    if (res.length > 40) {
      res = res.substring(0, 40);
    } else if (res.length < 40) {
      let diff = 40 - res.length;
      for (let i = 0; i < diff; i++) {
        res = '0' + res;
      }
    }
  }
  return '0x' + res;
}

export function asciiToString(input: number[]): string {
  let ret = '';
  for (let i = 0; i < input.length; i++) {
    ret += String.fromCharCode(input[i]!);
  }
  return ret;
}
