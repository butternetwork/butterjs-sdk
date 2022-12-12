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
import { ButterCoreParam, TransactionOptions } from '../../types';
import { ButterContractType, ButterProviderType } from '../../types/paramTypes';
import { PromiEvent } from 'web3-core';

/**
 * EVM Omnichain Chain Service smart contracts abstraction
 */
export class ButterRouter {
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
   * @param coreParam
   * @param targetSwapData
   * @param amount amount in minimal unit
   * @param toChain
   * @param targetToAddress
   * @param options
   */
  async entrance(
    fromAddress: string,
    coreParam: ButterCoreParam,
    targetSwapData: string,
    amount: string,
    toChain: string,
    targetToAddress: string,
    options: TransactionOptions
  ): Promise<ButterTransactionResponse> {
    let txHash: string;
    if (this.contract instanceof EthersContract) {
      const entranceTx: ContractTransaction = await this.contract.entrance(
        coreParam,
        targetSwapData,
        amount,
        toChain,
        targetToAddress,
        { gasLimit: options.gas }
      );
      txHash = entranceTx.hash;
      return assembleEVMTransactionResponse(txHash!, this.provider);
      // receipt = await entranceTx.wait();
    } else {
      const promiReceipt: PromiEvent<Web3TransactionReceipt> =
        this.contract.methods
          .entrance(coreParam, targetSwapData, amount, toChain, targetToAddress)
          .send({
            from: fromAddress,
            gas: Number.parseInt(options.gas!.toString()),
          });
      return <ButterTransactionResponse>{
        promiReceipt: promiReceipt,
      };
    }
  }

  async gasEstimateEntrance(
    fromAddress: string,
    coreParam: ButterCoreParam,
    targetSwapData: string,
    amount: string,
    toChain: string,
    targetToAddress: string
  ): Promise<string> {
    // gas estimation
    let estimatedGas = '';
    if (this.contract instanceof EthersContract) {
      // console.log('access param', coreParam);
      // console.log('swapData', targetSwapData);
      // console.log('amount', amount);
      // console.log('toChain', toChain);
      // console.log('tagetToAddress', targetToAddress);

      const gas: BigNumber = await this.contract.estimateGas.entrance!(
        coreParam,
        targetSwapData,
        amount,
        toChain,
        targetToAddress
      );
      estimatedGas = gas.toString();
    } else {
      const gas = await this.contract.methods
        .entrance(coreParam, targetSwapData, amount, toChain, targetToAddress)
        .estimateGas({ from: fromAddress });
      estimatedGas = gas.toString();
    }
    return estimatedGas;
  }
}
