import {
  BigNumber,
  Contract as EthersContract,
  ContractInterface,
  ContractTransaction,
  ethers,
  Signer,
} from 'ethers';
import { Contract as Web3Contract } from 'web3-eth-contract';
import { TransactionReceipt as Web3TransactionReceipt } from 'web3-core';
import { IMapCrossChainService } from '../interfaces/IMapCrossChainService';
import {
  ButterTransactionReceipt,
  ButterTransactionResponse,
} from '../../types/responseTypes';
import {
  adaptEthReceipt,
  assembleEVMTransactionResponse,
} from '../../utils/responseUtil';
import { Provider } from '@ethersproject/abstract-provider';
import { Eth } from 'web3-eth';
import { TransferOutOptions } from '../../types';
import { ButterProviderType } from '../../types/paramTypes';
import { PromiEvent } from 'web3-core';

export class RelayCrossChainService implements IMapCrossChainService {
  contract: EthersContract | Web3Contract;
  provider: ButterProviderType;

  constructor(
    contractAddress: string,
    abi: any,
    signerOrProvider: ButterProviderType
  ) {
    if (
      signerOrProvider instanceof Signer ||
      signerOrProvider instanceof Provider
    ) {
      this.contract = new ethers.Contract(
        contractAddress,
        abi,
        signerOrProvider
      );
    } else {
      this.contract = new signerOrProvider.Contract(abi, contractAddress);
    }
    this.provider = signerOrProvider;
  }

  /**
   * transfer out token(not native coin) from source chain to designated token on target chain
   * @param fromAddress
   * @param tokenAddress input token address
   * @param amount amount in minimal unit
   * @param toAddress target chain receiving address
   * @param toChainId target chain id
   * @param options
   */
  async doTransferOutToken(
    fromAddress: string,
    tokenAddress: string,
    amount: string,
    toAddress: string,
    toChainId: string,
    options: TransferOutOptions
  ): Promise<ButterTransactionResponse> {
    let txHash;
    if (this.contract instanceof EthersContract) {
      const transferOutTx: ContractTransaction =
        await this.contract.transferOutToken(
          tokenAddress,
          toAddress,
          amount,
          toChainId
        );
      txHash = transferOutTx.hash;
      return assembleEVMTransactionResponse(txHash!, this.provider);
    } else {
      const promiReceipt: PromiEvent<Web3TransactionReceipt> =
        this.contract.methods
          .transferOutToken(tokenAddress, toAddress, amount, toChainId)
          .send({
            from: fromAddress,
            gas: options.gas,
          });
      return <ButterTransactionResponse>{
        promiReceipt: promiReceipt,
      };
    }
  }

  async gasEstimateTransferOutToken(
    fromAddress: string,
    tokenAddress: string,
    amount: string,
    toAddress: string,
    toChainId: string
  ): Promise<string> {
    // gas estimation
    let estimatedGas = '';
    if (this.contract instanceof EthersContract) {
      const gas: BigNumber = await this.contract.estimateGas.transferOutToken!(
        tokenAddress,
        toAddress,
        amount,
        toChainId
      );
      estimatedGas = gas.toString();
    } else {
      const gas = await this.contract.methods
        .transferOutToken(tokenAddress, toAddress, amount, toChainId)
        .estimateGas({ from: fromAddress });
      estimatedGas = gas.toString();
    }
    return estimatedGas;
  }

  /**
   * transfer out native coin from source chain to designated token on target chain
   * @param fromAddress
   * @param toAddress target chain receiving address
   * @param toChainId target chain id
   * @param amount amount to bridge in minimal unit
   * @param options
   */
  async doTransferOutNative(
    fromAddress: string,
    toAddress: string,
    toChainId: string,
    amount: string,
    options: TransferOutOptions
  ): Promise<ButterTransactionResponse> {
    let txHash;
    if (this.contract instanceof EthersContract) {
      console.log(
        'relay transfer out',
        toAddress,
        fromAddress,
        toChainId,
        amount
      );
      const transferOutTx: ContractTransaction =
        await this.contract.transferOutNative(toAddress, toChainId, {
          value: amount,
        });

      txHash = transferOutTx.hash;
      return assembleEVMTransactionResponse(txHash!, this.provider);
    } else {
      const promiReceipt: PromiEvent<Web3TransactionReceipt> =
        this.contract.methods.transferOutToken(toAddress, toChainId).send({
          value: amount,
          from: fromAddress,
          gas: options.gas,
        });
      return <ButterTransactionResponse>{
        promiReceipt: promiReceipt,
      };
    }
  }

  async gasEstimateTransferOutNative(
    fromAddress: string,
    toAddress: string,
    toChainId: string,
    amount: string
  ): Promise<string> {
    // gas estimation
    let estimatedGas;
    if (this.contract instanceof EthersContract) {
      const gas = await this.contract.estimateGas.transferOutNative!(
        toAddress,
        toChainId,
        {
          value: amount,
          from: fromAddress,
        }
      );
      estimatedGas = gas.toString();
    } else {
      const gas = await this.contract.methods
        .transferOutNative(toAddress, toChainId)
        .estimateGas({ from: fromAddress, value: amount });
      estimatedGas = gas.toString();
    }
    return estimatedGas;
  }

  async doDepositOutToken(
    tokenAddress: string,
    from: string,
    to: string,
    amount: string
  ): Promise<string> {
    if (this.contract instanceof EthersContract) {
      const depositOutTx: ContractTransaction =
        await this.contract.depositOutToken(tokenAddress, from, to, amount);

      const receipt = await depositOutTx.wait();
      return receipt.transactionHash;
    } else {
      throw new Error('provider not supported');
    }
  }

  /**
   * set id table
   * @param chainId
   * @param id
   */
  // async doSetIdTable(chainId: string, id: string): Promise<string> {
  //   const setIdTableTx: ContractTransaction = await this.contract.setIdTable(
  //     chainId,
  //     id
  //   );
  //
  //   const receipt = await setIdTableTx.wait();
  //   return receipt.transactionHash;
  // }
  //
  // async doSetNearHash(hash: string): Promise<string> {
  //   const setNearHashTx: ContractTransaction = await this.contract.setNearHash(
  //     hash
  //   );
  //
  //   const receipt = await setNearHashTx.wait();
  //   return receipt.transactionHash;
  // }

  /**
   * specify token decimal for the convertion of different token on different chain
   * @param selfTokenAddress
   * @param chainId
   * @param decimals
   */
  async doSetTokenOtherChainDecimals(
    selfTokenAddress: string,
    chainId: string,
    decimals: number
  ): Promise<string> {
    if (this.contract instanceof EthersContract) {
      const tx: ContractTransaction =
        await this.contract.setTokenOtherChainDecimals(
          selfTokenAddress,
          chainId,
          decimals
        );

      const receipt = await tx.wait();
      return receipt.transactionHash;
    } else {
      throw new Error('need ethers provider');
    }
  }

  async doAddAuthToken(tokens: string[]): Promise<string> {
    if (this.contract instanceof EthersContract) {
      const addAuthTokenTx: ContractTransaction =
        await this.contract.addAuthToken(tokens);

      const receipt = await addAuthTokenTx.wait();
      return receipt.transactionHash;
    } else {
      throw new Error('need ethers provider');
    }
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
    if (this.contract instanceof EthersContract) {
      const tx: ContractTransaction = await this.contract.setBridgeAddress(
        chainId,
        bridgeAddress
      );

      const receipt = await tx.wait();
      return receipt.transactionHash;
    } else {
      throw new Error('need ethers provider');
    }
  }
  async setVaultBalance(
    toChain: number,
    address: string,
    amount: string
  ): Promise<string> {
    if (this.contract instanceof EthersContract) {
      const tx: ContractTransaction = await this.contract.setVaultBalance(
        toChain,
        address,
        amount
      );

      const receipt = await tx.wait();
      return receipt.transactionHash;
    } else {
      throw new Error('need ethers provider');
    }
  }
  async getVaultBalance(
    toChainId: number,
    tokenAddress: string
  ): Promise<string> {
    if (this.contract instanceof EthersContract) {
      const balance: BigNumber = await this.contract.vaultBalance(
        toChainId,
        tokenAddress
      );

      return Promise.resolve(balance.toString());
    } else {
      throw new Error('need ethers provider');
    }
  }
}
