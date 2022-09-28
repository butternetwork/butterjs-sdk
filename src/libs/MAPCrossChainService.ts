import {
  Contract,
  ContractInterface,
  ContractTransaction,
  ethers,
  Signer,
} from 'ethers';
import { IMapCrossChainService } from './interfaces/IMapCrossChainService';

export class MAPCrossChainService implements IMapCrossChainService {
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

  async doSetIdTable(chainId: string, id: string): Promise<string> {
    const setIdTableTx: ContractTransaction = await this.contract.setIdTable(
      chainId,
      id
    );

    const receipt = await setIdTableTx.wait();
    return receipt.transactionHash;
  }

  async doSetNearHash(hash: string): Promise<string> {
    const setNearHashTx: ContractTransaction = await this.contract.setNearHash(
      hash
    );

    const receipt = await setNearHashTx.wait();
    return receipt.transactionHash;
  }

  async doSetTokenOtherChainDecimals(
    selfTokenAddress: string,
    chainId: string,
    decimals: string
  ): Promise<string> {
    const tx: ContractTransaction =
      await this.contract.setTokenOtherChainDecimals(
        selfTokenAddress,
        chainId,
        decimals
      );

    const receipt = await tx.wait();
    return receipt.transactionHash;
  }

  async doAddAuthToken(tokens: string[]): Promise<string> {
    const addAuthTokenTx: ContractTransaction =
      await this.contract.addAuthToken(tokens);

    const receipt = await addAuthTokenTx.wait();
    return receipt.transactionHash;
  }

  async setBridgeAddress(
    chainId: string,
    bridgeAddress: string
  ): Promise<string> {
    const tx: ContractTransaction = await this.contract.setBridgeAddress(
      chainId,
      bridgeAddress
    );

    const receipt = await tx.wait();
    return receipt.transactionHash;
  }
}
