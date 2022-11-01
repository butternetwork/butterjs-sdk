import {
  BigNumber,
  Contract,
  ContractInterface,
  ContractTransaction,
  ethers,
  Signer,
} from 'ethers';
import { IMapCrossChainService } from '../interfaces/IMapCrossChainService';
import { ContractCallReceipt } from '../../types/responseTypes';
import { adaptEtherReceipt } from '../../utils/responseUtil';
import BN from 'bn.js';
import { Provider } from '@ethersproject/abstract-provider';
import { BaseCurrency } from '../../entities';

export class RelayCrossChainService implements IMapCrossChainService {
  contract: Contract;

  constructor(
    contractAddress: string,
    abi: ContractInterface,
    signerOrProvider: Signer | Provider
  ) {
    this.contract = new ethers.Contract(contractAddress, abi, signerOrProvider);
  }

  /**
   * transfer out token(not native coin) from source chain to designated token on target chain
   * @param tokenAddress input token address
   * @param amount amount in minimal unit
   * @param toAddress target chain receiving address
   * @param toChainId target chain id
   * @param gasEstimation
   */
  async doTransferOutToken(
    tokenAddress: string,
    amount: string,
    toAddress: string,
    toChainId: string,
    gasEstimation: boolean
  ): Promise<ContractCallReceipt | BN> {
    if (gasEstimation) {
      const gas = await this.contract.estimateGas.transferOutToken!(
        tokenAddress,
        toAddress,
        amount,
        toChainId,
        { gasLimit: 5000000 }
      );

      return new BN(gas.toString(), 10);
    }

    const transferOutTx: ContractTransaction =
      await this.contract.transferOutToken(
        tokenAddress,
        toAddress,
        amount,
        toChainId,
        { gasLimit: 5000000 }
      );
    const receipt = await transferOutTx.wait();
    return adaptEtherReceipt(receipt);
  }

  /**
   * transfer out native coin from source chain to designated token on target chain
   * @param toAddress target chain receiving address
   * @param toChainId target chain id
   * @param amount amount to bridge in minimal unit
   * @param gasEstimation
   */
  async doTransferOutNative(
    toAddress: string,
    toChainId: string,
    amount: string,
    gasEstimation: boolean
  ): Promise<ContractCallReceipt | BN> {
    if (gasEstimation) {
      const gas = await this.contract.estimateGas.transferOutNative!(
        toAddress,
        toChainId,
        {
          value: amount,
        }
      );

      return new BN(gas.toString(), 10);
    }

    const transferOutTx: ContractTransaction =
      await this.contract.transferOutNative(toAddress, toChainId, {
        value: amount,
      });

    const receipt = await transferOutTx.wait();
    return adaptEtherReceipt(receipt);
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
        ethers.constants.AddressZero,
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

  async getVaultBalance(
    toChainId: number,
    tokenAddress: string
  ): Promise<string> {
    const balance: BigNumber = await this.contract.vaultBalance(
      toChainId,
      tokenAddress
    );

    return Promise.resolve(balance.toString());
  }
}
