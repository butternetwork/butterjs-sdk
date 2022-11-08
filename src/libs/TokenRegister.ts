import { ethers, Signer } from 'ethers';
import TokenRegisterMetadata from '../abis/TokenRegister.json';
import { Provider, TransactionReceipt } from '@ethersproject/abstract-provider';
import { BarterContractType, BarterProviderType } from '../types/paramTypes';
import { Eth } from 'web3-eth';
import { BarterContractCallReceipt } from '../types/responseTypes';
import { adaptEthReceipt } from '../utils/responseUtil';

export class TokenRegister {
  private readonly contract: BarterContractType;
  private readonly provider: BarterProviderType;
  constructor(contractAddress: string, signerOrProvider: BarterProviderType) {
    if (
      signerOrProvider instanceof Signer ||
      signerOrProvider instanceof Provider
    ) {
      this.contract = new ethers.Contract(
        contractAddress,
        TokenRegisterMetadata.abi,
        signerOrProvider
      );
    } else {
      this.contract = new signerOrProvider.Contract(
        TokenRegisterMetadata.abi as any,
        contractAddress
      );
    }
    this.provider = signerOrProvider;
  }

  async registerToken(
    sourceChain: number,
    sourceMapToken: string,
    mapToken: string
  ): Promise<BarterContractCallReceipt> {
    let regTokenTx;
    if (this.contract instanceof ethers.Contract) {
      regTokenTx = await this.contract.regToken(
        sourceChain,
        sourceMapToken,
        mapToken
      );
      regTokenTx = await regTokenTx.wait();
    } else {
      regTokenTx = await this.contract.methods
        .regToken(sourceChain, sourceMapToken, mapToken)
        .send({ from: (this.provider as Eth).defaultAccount });
    }
    return adaptEthReceipt(regTokenTx);
  }

  async getTargetToken(
    sourceChain: number,
    sourceToken: string,
    targetChain: number
  ): Promise<string> {
    if (this.contract instanceof ethers.Contract) {
      return await this.contract.getTargetToken(
        sourceChain,
        sourceToken,
        targetChain
      );
    } else return '';
  }
}
