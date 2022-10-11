import {
  Contract,
  ContractInterface,
  ContractTransaction,
  ethers,
  Signer,
} from 'ethers';
import { IMapCrossChainService } from '../interfaces/IMapCrossChainService';
import { TransferOutOptions } from '../../types/requestTypes';

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
    toChainId: string
  ): Promise<string> {
    const transferOutTx: ContractTransaction =
      await this.contract.transferOutToken(
        tokenAddress,
        toAddress,
        amount,
        toChainId
      );

    const receipt = await transferOutTx.wait();
    return receipt.transactionHash;
  }

  async doTransferOutNative(
    toAddress: string,
    toChainId: string,
    amount: string
  ): Promise<string> {
    const transferOutTx: ContractTransaction =
      await this.contract.transferOutNative(toAddress, toChainId, {
        value: amount,
      });

    const receipt = await transferOutTx.wait();
    return receipt.transactionHash;
  }

  async doDepositOutToken(
    tokenAddress: string,
    from: string,
    to: string,
    amount: string
  ): Promise<string> {
    const depositOutTx: ContractTransaction =
      await this.contract.depositOutToken(tokenAddress, from, to, amount);

    const receipt = await depositOutTx.wait();
    return receipt.transactionHash;
  }

  async doSetCanBridgeToken(
    tokenAddress: string,
    toChainId: number,
    canBridge: boolean
  ) {
    const tx: ContractTransaction = await this.contract.setCanBridgeToken(
      tokenAddress,
      toChainId,
      canBridge
    );
    const receipt = await tx.wait();
    console.log(receipt);
  }
}
