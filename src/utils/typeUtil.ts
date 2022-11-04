import { BarterProviderType } from '../types/paramTypes';
import { Signer } from 'ethers';
import { Provider } from '@ethersproject/abstract-provider';

export function isEthersProvider(provider: BarterProviderType): boolean {
  return provider instanceof Signer || provider instanceof Provider;
}
