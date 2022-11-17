import { ButterContractType, ButterProviderType } from '../types/paramTypes';
import { ethers, Signer } from 'ethers';
import { Provider } from '@ethersproject/abstract-provider';
import VaultTokenMetadata from '../abis/VaultToken.json';
import { ButterTransactionReceipt } from '../types/responseTypes';
import { getHexAddress } from '../utils';
import { Eth } from 'web3-eth';
import { adaptEthReceipt } from '../utils/responseUtil';
import { BaseCurrency } from '../entities';

export class VaultToken {
  private readonly contract: ButterContractType;
  private readonly provider: ButterProviderType;
  constructor(contractAddress: string, signerOrProvider: ButterProviderType) {
    if (
      signerOrProvider instanceof Signer ||
      signerOrProvider instanceof Provider
    ) {
      this.contract = new ethers.Contract(
        contractAddress,
        VaultTokenMetadata.abi,
        signerOrProvider
      );
    } else {
      this.contract = new signerOrProvider.Contract(
        VaultTokenMetadata.abi as any,
        contractAddress
      );
    }
    this.provider = signerOrProvider;
  }

  async getVaultBalance(chainId: string): Promise<string> {
    if (this.contract instanceof ethers.Contract) {
      return await this.contract.vaultBalance(chainId);
    } else return '';
  }
}
