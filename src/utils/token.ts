import {Currency} from '../beans';
import {AVAILABLE_TOKENS, CHAIN_ID, IS_NEAR} from "../constants";
import {getHexAddress} from "./common";

/**
 * get token entity from address and chain id
 * @param address contract address
 * @param chainId
 */
export function getToken(address: string, chainId: string|CHAIN_ID): Currency {
  const tokens = AVAILABLE_TOKENS(chainId);
  address = address.toLowerCase();
  for (const token of tokens) {
    let tokenAddress=token.address;
    let address1 = getHexAddress(token.address,token.chainId, !IS_NEAR(token.chainId));
    let address2 = getHexAddress(address,chainId, !IS_NEAR(chainId));
    if (address2 === address1){
      return  JSON.parse(JSON.stringify(token));
    }
  }
  throw new Error(
    `Internal Error: could not find token ${address} on chain: ${chainId}`
  );
}

