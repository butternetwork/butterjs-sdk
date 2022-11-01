import { BigNumber, ethers, Signer } from 'ethers';
import FeeCenterMetadata from '../abis/FeeCenter.json';
import { Provider, TransactionReceipt } from '@ethersproject/abstract-provider';

export class FeeCenter {
  private contract: ethers.Contract;

  constructor(contractAddress: string, signerOrProvider: Signer | Provider) {
    this.contract = new ethers.Contract(
      contractAddress,
      FeeCenterMetadata.abi,
      signerOrProvider
    );
  }

  async setChainTokenGasFee(
    toChainId: number,
    tokenAddress: string,
    lowest: BigNumber,
    highest: BigNumber,
    proportion: number
  ): Promise<TransactionReceipt> {
    const setCFTx = await this.contract.setChainTokenGasFee(
      toChainId,
      tokenAddress,
      lowest,
      highest,
      proportion
    );
    return setCFTx;
  }

  async getTokenFee(
    toChainId: number,
    tokenAddress: string,
    amount: BigNumber
  ): Promise<BigNumber> {
    const fee = await this.contract.getTokenFee(
      toChainId,
      tokenAddress,
      amount
    );
    return fee;
  }

  async getVaultToken(tokenAddress: string): Promise<string> {
    return await this.contract.getVaultToken(tokenAddress);
  }
}
