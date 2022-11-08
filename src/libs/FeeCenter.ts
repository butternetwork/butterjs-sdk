import { BigNumber, ethers, Signer } from 'ethers';
import FeeCenterMetadata from '../abis/FeeCenter.json';
import { Provider } from '@ethersproject/abstract-provider';
import { BarterContractType, BarterProviderType } from '../types/paramTypes';
import { BarterContractCallReceipt } from '../types/responseTypes';
import { adaptEthReceipt } from '../utils/responseUtil';

export class FeeCenter {
  private readonly contract: BarterContractType;
  private readonly provider: BarterProviderType;
  constructor(contractAddress: string, signerOrProvider: BarterProviderType) {
    if (
      signerOrProvider instanceof Signer ||
      signerOrProvider instanceof Provider
    ) {
      this.contract = new ethers.Contract(
        contractAddress,
        FeeCenterMetadata.abi,
        signerOrProvider
      );
    } else {
      this.contract = new signerOrProvider.Contract(
        FeeCenterMetadata.abi as any,
        contractAddress
      );
    }
    this.provider = signerOrProvider;
  }

  async setChainTokenGasFee(
    toChainId: number,
    tokenAddress: string,
    lowest: BigNumber,
    highest: BigNumber,
    proportion: number
  ): Promise<BarterContractCallReceipt> {
    let setCFTx;
    if (this.provider instanceof Signer || this.provider instanceof Provider) {
      setCFTx = await (this.contract as ethers.Contract).setChainTokenGasFee(
        toChainId,
        tokenAddress,
        lowest,
        highest,
        proportion
      );
      setCFTx = await setCFTx.wait();
    } else {
      setCFTx = await this.contract.methods
        .setChainTokenGasFee(
          toChainId,
          tokenAddress,
          lowest,
          highest,
          proportion
        )
        .send({ from: this.provider.defaultAccount });
    }
    return adaptEthReceipt(setCFTx);
  }

  async getTokenFee(
    toChainId: number,
    tokenAddress: string,
    amount: BigNumber
  ): Promise<string> {
    let tokenFee;
    if (this.provider instanceof Signer || this.provider instanceof Provider) {
      tokenFee = await (this.contract as ethers.Contract).getTokenFee(
        toChainId,
        tokenAddress,
        amount
      );
    } else {
      tokenFee = await this.contract.methods
        .getTokenFee(toChainId, tokenAddress, amount)
        .call();
    }
    return tokenFee.toString();
  }
}
