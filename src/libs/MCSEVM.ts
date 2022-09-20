import { ContractTransaction, ethers, Signer } from 'ethers';
import MCSRelayABI from '../abis/MAPCrossChainServiceRelayABI.json';

class MCSEVM {
  private contract: ethers.Contract;

  constructor(contractAddress: string, provider: ethers.providers.Provider) {
    this.contract = new ethers.Contract(contractAddress, MCSRelayABI, provider);
  }

  async transferOutToken(
    signer: Signer,
    tokenAddress: string,
    amount: string,
    toAddress: string,
    toChain: string
  ): Promise<void> {
    const transferOutTx: ContractTransaction =
      await this.contract.TransferOutToken(
        tokenAddress,
        toAddress,
        amount,
        toChain,
        signer
      );

    const receipt = await transferOutTx.wait();
    console.log(receipt);
  }
}
