import { ethers, Signer } from 'ethers';
import TokenRegisterMetadata from '../abis/TokenRegister.json';
import { TransactionReceipt } from '@ethersproject/abstract-provider';

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
  ): Promise<TransactionReceipt> {
    const regTokenTx = await this.contract.regToken(
      sourceChain,
      sourceMapToken,
      mapToken
    );

    return regTokenTx;
  }

  async getTargetToken(
    sourceChain: number,
    sourceToken: string,
    targetChain: number
  ): Promise<string> {
    return await this.contract.getTargetToken(
      sourceChain,
      sourceToken,
      targetChain
    );
  }
}
