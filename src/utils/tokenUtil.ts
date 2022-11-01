import { ID_TO_SUPPORTED_TOKEN } from '../constants/supported_tokens';
import { BaseCurrency } from '../entities';

export function getTokenByAddressAndChainId(
  tokenAddress: string,
  chainId: number
): BaseCurrency {
  const supportedToken: BaseCurrency[] = ID_TO_SUPPORTED_TOKEN(chainId);
  for (let i = 0; i < supportedToken.length; i++) {
    if (
      supportedToken[i]!.address.toLowerCase() === tokenAddress.toLowerCase()
    ) {
      return supportedToken[i]!;
    }
  }
  throw new Error(
    `Internal Error: could not find token ${tokenAddress} on chain: ${chainId}`
  );
}
