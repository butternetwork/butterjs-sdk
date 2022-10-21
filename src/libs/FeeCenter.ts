import { BigNumber, ethers, Signer } from 'ethers';
import FeeCenterMetadata from '../abis/FeeCenter.json';

export class FeeCenter {
  private contract: ethers.Contract;

  constructor(contractAddress: string, signer: Signer) {
    this.contract = new ethers.Contract(
      contractAddress,
      FeeCenterMetadata.abi,
      signer
    );
  }

  async setChainTokenGasFee(
    toChainId: number,
    tokenAddress: string,
    lowest: BigNumber,
    highest: BigNumber,
    proportion: number
  ) {
    const setCFTx = await this.contract.setChainTokenGasFee(
      toChainId,
      tokenAddress,
      lowest,
      highest,
      proportion
    );
    console.log(setCFTx);
  }
}
