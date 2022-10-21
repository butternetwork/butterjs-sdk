import { BigNumber, ethers, Signer } from 'ethers';
import TokenRegisterMetadata from '../abis/TokenRegister.json';

export class TokenRegister {
  private contract: ethers.Contract;

  constructor(contractAddress: string, signer: Signer) {
    this.contract = new ethers.Contract(
      contractAddress,
      TokenRegisterMetadata.abi,
      signer
    );
  }

  async registerToken(
    sourceChain: number,
    sourceMapToken: string,
    mapToken: string
  ) {
    const gas: BigNumber = await this.contract.estimateGas.regToken!(
      sourceChain,
      sourceMapToken,
      mapToken
    );

    const regTokenTx = await this.contract.regToken(
      sourceChain,
      sourceMapToken,
      mapToken
    );
    console.log(regTokenTx);
  }

  async getTargetToken(
    sourceChain: number,
    sourceToken: string,
    targetChain: number
  ): Promise<string> {
    const tokenAddress: string = await this.contract.getTargetToken(
      sourceChain,
      sourceToken,
      targetChain
    );
    return tokenAddress;
  }
}
