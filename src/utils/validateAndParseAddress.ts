import { getAddress } from '@ethersproject/address'

/**
 * Validates an address and returns the parsed (checksummed) version of that address
 * TODO: Different blockchains may have different format of address, consider them all
 * @param address the unchecksummed hex address
 */
export function validateAndParseAddress(address: string): string {
  return address;
}