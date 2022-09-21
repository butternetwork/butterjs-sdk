import { ContractTransaction, ethers, Signer } from 'ethers';
import MCSRelayABI from '../abis/MAPCrossChainServiceRelayABI.json';

export class MCSEVM {
  private contract: ethers.Contract;

  constructor(contractAddress: string, provider: ethers.providers.Provider) {
    this.contract = new ethers.Contract(contractAddress, MCSRelayABI, provider);
  }

  async doTransferOutToken(
    signer: Signer,
    tokenAddress: string,
    amount: string,
    toAddress: string,
    toChain: string
  ): Promise<void> {
    const transferOutTx: ContractTransaction =
      await this.contract.transferOutToken(
        tokenAddress,
        toAddress,
        amount,
        toChain,
        signer
      );

    const receipt = await transferOutTx.wait();
    console.log(receipt);
  }

  async doTransferOutNative(
    signer: Signer,
    toAddress: string,
    toChain: string,
    amount: string
  ): Promise<void> {
    const transferOutTx: ContractTransaction =
      await this.contract.transferOutNative(toAddress, toChain, signer, {
        value: amount,
      });

    const receipt = await transferOutTx.wait();
    console.log(receipt);
  }

  async doDepositOutToken(
    signer: Signer,
    tokenAddress: string,
    from: string,
    to: string,
    amount: string
  ): Promise<void> {
    const depositOutTx: ContractTransaction =
      await this.contract.depositOutToken(
        tokenAddress,
        from,
        to,
        amount,
        signer
      );

    const receipt = await depositOutTx.wait();
    console.log(receipt);
  }
}
