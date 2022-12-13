import {
  BigNumber,
  Contract as EthersContract,
  ContractTransaction,
  ethers,
  Signer,
} from 'ethers';
import { Eth } from 'web3-eth';
import { IMapOmnichainService } from '../interfaces/IMapOmnichainService';
import { ButterTransactionResponse } from '../../types/responseTypes';
import { assembleEVMTransactionResponse } from '../../utils/responseUtil';

import { Provider } from '@ethersproject/abstract-provider';
import { TransactionReceipt as Web3TransactionReceipt } from 'web3-core';
import { TransferOutOptions } from '../../types';
import { ButterContractType, ButterProviderType } from '../../types/paramTypes';
import { PromiEvent } from 'web3-core';

/**
 * EVM Omnichain Chain Service smart contracts abstraction
 */
export class EVMOmnichainService implements IMapOmnichainService {
  contract: ButterContractType;
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
    let txHash: string;
    if (this.contract instanceof EthersContract) {
      const transferOutTx: ContractTransaction =
        await this.contract.transferOutToken(
          tokenAddress,
          toAddress,
          amount,
          toChainId,
          {
            gasLimit: options.gas,
            gasPrice:
              options.gasPrice === undefined
                ? await this.provider.getGasPrice()
                : options.gasPrice,
          }
        );
      txHash = transferOutTx.hash;
      return assembleEVMTransactionResponse(txHash!, this.provider);
      // receipt = await transferOutTx.wait();
    } else {
      const promiReceipt: PromiEvent<Web3TransactionReceipt> =
        this.contract.methods
          .transferOutToken(tokenAddress, toAddress, amount, toChainId)
          .send({
            from: fromAddress,
            gas: Number.parseInt(options.gas!.toString()),
            gasPrice:
              options.gasPrice === undefined
                ? await this.provider.getGasPrice()
                : options.gasPrice,
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
    let txHash: string;
    if (this.contract instanceof EthersContract) {
      const transferOutTx: ContractTransaction =
        await this.contract.transferOutNative(toAddress, toChainId, {
          // gasLimit: options.gas,
          value: amount,
        });

      txHash = transferOutTx.hash;
      return assembleEVMTransactionResponse(txHash!, this.provider);
    } else {
      const promiReceipt: PromiEvent<Web3TransactionReceipt> =
        this.contract.methods.transferOutNative(toAddress, toChainId).send({
          value: amount,
          from: fromAddress,
          gas: Number.parseInt(options.gas!.toString()),
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
        }
      );
      estimatedGas = gas.toString();
    } else {
      const gas = await this.contract.methods
        .transferOutNative(toAddress, toChainId)
        .estimateGas({ value: amount });
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
    let txHash;
    if (this.contract instanceof EthersContract) {
      const depositOutTx: ContractTransaction =
        await this.contract.depositOutToken(tokenAddress, from, to, amount);

      const receipt = await depositOutTx.wait();
      txHash = receipt.transactionHash;
    } else {
      const eth = this.provider as Eth;
      const receipt = await this.contract.methods
        .depositOutToken(tokenAddress, from, to, amount)
        .send({
          from: eth.defaultAccount,
        });
      txHash = receipt.transactionHash;
    }
    return txHash;
  }

  async doSetCanBridgeToken(
    tokenAddress: string,
    toChainId: string,
    canBridge: boolean
  ) {
    if (this.contract instanceof EthersContract) {
      const tx: ContractTransaction = await this.contract.setCanBridgeToken(
        tokenAddress,
        toChainId,
        canBridge
      );
      const receipt = await tx.wait();
    } else {
      throw new Error('provided not supported');
    }
  }

  async isMintable(tokenAddress: string): Promise<boolean> {
    if (this.contract instanceof EthersContract) {
      return await this.contract.isMintable(tokenAddress);
    } else {
      throw new Error('provided not supported');
    }
  }
}
