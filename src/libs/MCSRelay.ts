import { ContractTransaction, ethers, Signer } from 'ethers';
import MCSRelayABI from '../abis/MAPCrossChainServiceRelayABI.json';
class MCSRelay {
  private contract: ethers.Contract;

  constructor(contractAddress: string, provider: ethers.providers.Provider) {
    this.contract = new ethers.Contract(contractAddress, MCSRelayABI, provider);
  }

  async transferOutNative(
    toAddress: string,
    toChain: number,
    amount: string,
    signer: Signer
  ): Promise<void> {
    const transferOutTx: ContractTransaction =
      await this.contract.TransferOutNative(toAddress, toChain, signer);

    const receipt = await transferOutTx.wait();
    console.log(receipt);
  }

  async checkAuthToken(tokenAddress: string) {
    const tx = await this.contract.checkAuthToken(tokenAddress);
    console.log(tx);
  }
}
