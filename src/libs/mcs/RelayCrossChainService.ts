import {
  Contract,
  ContractInterface,
  ContractTransaction,
  ethers,
  Signer,
} from 'ethers';
import { IMapCrossChainService } from '../interfaces/IMapCrossChainService';

export class RelayCrossChainService implements IMapCrossChainService {
  contract: Contract;

  constructor(
    contractAddress: string,
    abi: ContractInterface,
    signer: ethers.Signer
  ) {
    this.contract = new ethers.Contract(contractAddress, abi, signer);
  }

  /**
   * transfer out token(not native coin) from source chain to designated token on target chain
   * @param tokenAddress input token address
   * @param amount amount in minimal unit
   * @param toAddress target chain receiving address
   * @param toChainId target chain id
   */
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
        toChainId,
        { gasLimit: 5000000 }
      );
    const receipt = await transferOutTx.wait();
    return receipt.transactionHash;
  }

  /**
   * transfer out native coin from source chain to designated token on target chain
   * @param toAddress target chain receiving address
   * @param toChainId target chain id
   * @param amount amount to bridge in minimal unit
   */
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

  /**
   * set id table
   * @param chainId
   * @param id
   */
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

  /**
   * specify token decimal for the convertion of different token on different chain
   * @param selfTokenAddress
   * @param chainId
   * @param decimals
   */
  async doSetTokenOtherChainDecimals(
    selfTokenAddress: string,
    chainId: number,
    decimals: number
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

  /**
   * set accepted bridge address
   * @param chainId chain id of the bridge address is residing on
   * @param bridgeAddress bridge address
   */
  async doSetBridgeAddress(
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
