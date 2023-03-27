import {getAddress} from '@ethersproject/address';
import {IS_EVM, IS_NEAR, NEAR_CONNECT,} from '../constants';
import {Token} from '../beans';
import {connect} from 'near-api-js';
import {NearAccountState} from '../types';
import Decimal from "decimal.js";

/**
 * Validates an address and returns the parsed (checksummed) version of that address
 * @param address the unchecksummed hex address
 */
export function validateAndParseAddressByChainId(address: string, chainId: string): string {
  if (IS_EVM(chainId)) {
    try {
      return getAddress(address);
    } catch (error) {
      throw new Error(
        `${address} is not a valid address on ${chainId}`
      );
    }
  } else if (IS_NEAR(chainId)) {
    return address;
  } else {
    throw new Error(`${chainId} is not supported`);
  }
}

/**
 * Near account rules
 * minimum length is 2
 * maximum length is 64
 * Account ID consists of Account ID parts separated by .
 * Account ID part consists of lowercase alphanumeric symbols separated by either _ or -.
 * Account ID that is 64 characters long and consists of lowercase hex characters is a specific implicit account ID.
 * @param accountId
 * @param chainId
 */
export async function verifyNearAccountId(accountId: string, chainId: string): Promise<NearAccountState> {
  const connectionConfig = NEAR_CONNECT(chainId);
  // @ts-ignore
  const near = await connect(connectionConfig);
  const account = await near.account(accountId);
  console.log('verifyNearAccountId',accountId,account);
  try {
    return {
      isValid: true,
      state: await account.state(),
    };
  } catch (e) {
    console.log('verifyNearAccountId',accountId,e);
    return {
      isValid: false,
      // @ts-ignore
      errMsg: e.message,
    };
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

export function getHexAddress(address: string, chainId: string, isAddress: boolean): string {
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
 * @param isAddress
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

export function toDecimalsNumber(from:string|number,decimals:number,fixed?:any){
  let de = new Decimal(from).mul(Math.pow(10,decimals));
  if (fixed){
    return de.toFixed(fixed);
  }
  return de.toString();
}
export function fromDecimalsNumber(from:string|number,decimals:any,fixed?:any){
  let de = new Decimal(from).div(Math.pow(10,decimals));
  if (fixed){
    return de.toFixed(fixed);
  }
  return de.toString();
}

export function createVLog(tag:string){
  const vlog = (...data:any[]) => {
    console.log(`🐣🦚[${tag}] `,...data);
  }
  return vlog;
}
