import {Currency} from '../beans';
import {AVAILABLE_TOKENS, CHAIN_ID} from "../constants";

/**
 * get token entity from address and chain id
 * @param address contract address
 * @param chainId
 */
export function getToken(address: string, chainId: string|CHAIN_ID): Currency {
  const tokens = AVAILABLE_TOKENS(chainId);
  address = address.toLowerCase();
  for (const token of tokens) {
    if (token.address.toLowerCase() === address){
      return  JSON.parse(JSON.stringify(token));
    }
  }
  throw new Error(
    `Internal Error: could not find token ${address} on chain: ${chainId}`
  );
}

