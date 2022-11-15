import { ID_TO_SUPPORTED_TOKEN } from '../constants/supported_tokens';
import { BaseCurrency } from '../entities';
import { IS_NEAR } from '../constants';
import { getHexAddress } from './addressUtil';

export function getTokenByAddressAndChainId(
  tokenAddress: string,
  chainId: number
): BaseCurrency {
  const supportedToken: BaseCurrency[] = ID_TO_SUPPORTED_TOKEN(chainId);
  for (let i = 0; i < supportedToken.length; i++) {
    if (
      getHexAddress(supportedToken[i]!.address, chainId).toLowerCase() ===
      tokenAddress.toLowerCase()
    ) {
      return supportedToken[i]!;
    }
  }
  throw new Error(
    `Internal Error: could not find token ${tokenAddress} on chain: ${chainId}`
  );
}
