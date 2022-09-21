import { ContractTransaction, ethers } from 'ethers';
import MCSRelayABI from '../abis/MAPCrossChainServiceRelayABI.json';
import { ContractReceipt } from '@ethersproject/contracts/src.ts';

export class MCSRelay {
  private contract: ethers.Contract;

  constructor(contractAddress: string, signer: ethers.Signer) {
    this.contract = new ethers.Contract(contractAddress, MCSRelayABI, signer);
  }

  async transferOutNative(
    toAddress: string,
    toChain: number,
    amount: string
  ): Promise<ContractReceipt> {
    const transferOutTx: ContractTransaction =
      await this.contract.transferOutNative(toAddress, toChain, {
        value: amount,
      });

    return await transferOutTx.wait();
  }

  async checkAuthToken(tokenAddress: string) {
    const tx = await this.contract.checkAuthToken(tokenAddress);
    console.log(tx);
  }
}
