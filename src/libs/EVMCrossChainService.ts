import {
  Contract,
  ContractInterface,
  ContractTransaction,
  ethers,
  Signer,
} from 'ethers';
import MCSRelayABI from '../abis/MAPCrossChainServiceRelayABI.json';
import { IMapCrossChainService } from './interfaces/IMapCrossChainService';

export class EVMCrossChainService implements IMapCrossChainService {
  contract: Contract;

  constructor(
    contractAddress: string,
    abi: ContractInterface,
    signer: ethers.Signer
  ) {
    this.contract = new ethers.Contract(contractAddress, abi, signer);
  }

  async doTransferOutToken(
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
        toChain
      );

    const receipt = await transferOutTx.wait();
    console.log(receipt);
  }

  async doTransferOutNative(
    toAddress: string,
    toChain: string,
    amount: string
  ): Promise<void> {
    const transferOutTx: ContractTransaction =
      await this.contract.transferOutNative(toAddress, toChain, {
        value: amount,
      });

    const receipt = await transferOutTx.wait();
    console.log(receipt.transactionHash);
  }

  async doDepositOutToken(
    tokenAddress: string,
    from: string,
    to: string,
    amount: string
  ): Promise<void> {
    const depositOutTx: ContractTransaction =
      await this.contract.depositOutToken(tokenAddress, from, to, amount);

    const receipt = await depositOutTx.wait();
    console.log(receipt);
  }
}
