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
import {createVLog} from "../../utils/common";

const vlog = createVLog('ButterRouter');

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
   * @param isNative
   * @param options
   */
  async entrance(
    fromAddress: string,
    coreParam: ButterCoreParam,
    targetSwapData: string,
    amount: string,
    toChain: string,
    targetToAddress: string,
    isNative: boolean,
    options: TransactionOptions
  ): Promise<ButterTransactionResponse> {
    vlog('entrance',{fromAddress,coreParam,targetSwapData,amount,toChain,targetToAddress,isNative,options})
    let txHash: string;
    if (this.contract instanceof EthersContract) {
      let ethersOptions: any = {
        gasLimit: options.gas,
      };
      if (isNative) {
        ethersOptions.value = amount;
      }
      const entranceTx: ContractTransaction = await this.contract.entrance(
        coreParam,
        targetSwapData,
        amount,
        toChain,
        targetToAddress,
        ethersOptions
      );
      txHash = entranceTx.hash;
      return assembleEVMTransactionResponse(txHash!, this.provider);
      // receipt = await entranceTx.wait();
    } else {
      let web3JSOptions: any = {
        from: fromAddress,
        gas: Number.parseInt(options.gas!.toString()),
      };

      if (isNative) {
        web3JSOptions.value = amount;
      }
      const promiReceipt: PromiEvent<Web3TransactionReceipt> =
        this.contract.methods
          .entrance(coreParam, targetSwapData, amount, toChain, targetToAddress)
          .send(web3JSOptions);
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
    targetToAddress: string,
    isNative: boolean
  ): Promise<string> {
    vlog('gasEstimateEntrance',{fromAddress,coreParam,targetSwapData,amount,toChain,targetToAddress,isNative})
    let estimatedGas = '';
    if (this.contract instanceof EthersContract) {
      const gas: BigNumber = await this.contract.estimateGas.entrance!(
        coreParam,
        targetSwapData,
        amount,
        toChain,
        targetToAddress,
        {
          value: isNative ? amount : undefined,
        }
      );
      estimatedGas = gas.toString();
    } else {
      const gas = await this.contract.methods
        .entrance(coreParam, targetSwapData, amount, toChain, targetToAddress)
        .estimateGas({
          from: fromAddress,
          value: isNative ? amount : undefined,
        });
      estimatedGas = gas.toString();
    }
    return estimatedGas;
  }
}
