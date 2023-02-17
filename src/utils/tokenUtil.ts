import {Currency} from "../beans";
import {AVAILABLE_TOKENS, CHAIN_ID, SUPPORT_TOKENS,} from '../constants';

export const findToken = (chainId: CHAIN_ID | string, address: string): Currency => {
    let currencies = AVAILABLE_TOKENS(chainId);
    for (const currency of currencies) {
        if (currency.address.toLowerCase() === address.toLowerCase()) {
            return currency;
        }
    }
    throw new Error(
        `Internal Error: could not find token ${address} on chain: ${chainId}`
    );
}
export const findSupportTokens = (chainId: CHAIN_ID | string): Currency[] => {
    return SUPPORT_TOKENS(chainId);
}
export const findAvailableTokens = (chainId: CHAIN_ID | string): Currency[] => {
    return AVAILABLE_TOKENS(chainId);
}
