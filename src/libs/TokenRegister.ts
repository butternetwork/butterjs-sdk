import { ethers, Signer } from 'ethers';
import TokenRegisterMetadata from '../abis/TokenRegister.json';
import { Provider, TransactionReceipt } from '@ethersproject/abstract-provider';

export class TokenRegister {
  private contract: ethers.Contract;

  constructor(contractAddress: string, signerOrProvider: Signer | Provider) {
    this.contract = new ethers.Contract(
      contractAddress,
      TokenRegisterMetadata.abi,
      signerOrProvider
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
