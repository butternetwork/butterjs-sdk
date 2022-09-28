import { getAddress } from '@ethersproject/address';
import { ChainId, ID_TO_NETWORK_NAME } from '../constants/chains';

/**
 * Validates an address and returns the parsed (checksummed) version of that address
 * TODO: Different blockchains may have different format of address, consider them all
 * @param address the unchecksummed hex address
 */
export function validateAndParseAddressByChainId(
  address: string,
  chainId: number
): string {
  switch (chainId) {
    case ChainId.MAINNET:
    case ChainId.BSC:
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
      break;
    }
    case ChainId.NEAR_TESTNET: {
      // TODO: validate near address
      return address;
    }
    default: {
      throw new Error(`${ID_TO_NETWORK_NAME(chainId)} is not supported`);
    }
  }
}

export function hexToDecimalArray(address: string, chainId: number): number[] {
  address = validateAndParseAddressByChainId(address, chainId);
  let ret: number[] = [];
  for (let i = 2; i < address.length; i = i + 2) {
    ret.push(parseInt(address.slice(i, i + 2), 16));
  }

  return ret;
}
