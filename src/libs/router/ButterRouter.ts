import {
    Contract as EthersContract,
    ContractTransaction,
    BigNumber, ethers, Signer,
} from 'ethers';
import {assembleEVMTransactionResponse, createVLog} from '../../utils';

import {
    ButterCoreParam,
    TransactionOptions,
    ButterContractType,
    ButterProviderType,
    ButterTransactionResponse
} from '../../types';
import Decimal from "decimal.js";
import {Provider} from '@ethersproject/abstract-provider';
import {TransactionReceipt as Web3TransactionReceipt, PromiEvent} from 'web3-core';

/**
 * EVM Omnichain Chain Service smart contracts abstraction
 */

const vlog = createVLog('ButterRouter');

export interface ButterRouterType {
    /**
     * contract address
     */
    contract: string,
    abi: any,
    signerOrProvider: ButterProviderType
}

export class ButterRouter {
    contract: ButterContractType;
    provider: ButterProviderType;

    constructor(contract: string, abi: any, signerOrProvider: ButterProviderType) {
        if (
            signerOrProvider instanceof Signer ||
            signerOrProvider instanceof Provider
        ) {
            this.contract = new ethers.Contract(
                contract,
                abi,
                signerOrProvider
            );
        } else {
            this.contract = new signerOrProvider.Contract(abi, contract);
        }
        this.provider = signerOrProvider;
    }

    static from(config: ButterRouterType): ButterRouter {
        return new ButterRouter(config.contract, config.abi, config.signerOrProvider);
    }

    /**
     * transfer out token(not native coin) from source chain to designated token on target chain
     * @param from from address
     * @param to  to address
     * @param amount
     * @param toChain to chain id
     * @param coreData
     * @param swapData target swap data
     * @param options
     */
    async entrance(from: string, to: string, amount: string | number, toChain: string,
                   coreData: ButterCoreParam, swapData: string, options: TransactionOptions): Promise<ButterTransactionResponse> {
        vlog('entrance', {from, to, amount, toChain, coreData, swapData, options})

        let _options: any = {};
        if (options.isNative) {
            _options.value = amount;
        }
        if (this.contract instanceof EthersContract) {
            if (options.gas) {
                _options.gasLimit = options.gas;
            }

            const entranceTx: ContractTransaction = await this.contract.entrance(
                coreData, swapData, amount, toChain, to, _options);
            return assembleEVMTransactionResponse(entranceTx.hash!, this.provider);
        } else {
            _options.from = from;
            _options.gas = new Decimal(options.gas + '').toFixed(0);
            const promiReceipt: PromiEvent<Web3TransactionReceipt> =
                this.contract.methods
                    .entrance(coreData, swapData, amount, toChain, to)
                    .send(_options);
            return <ButterTransactionResponse>{
                promiReceipt: promiReceipt,
            };
        }

    }

    async estimateGas(from: string, to: string, amount: string | number, toChain: string,
                      coreData: ButterCoreParam, swapData: string, options: TransactionOptions): Promise<string> {
        let estimateGas = '';
        if (this.contract instanceof EthersContract) {
            const gas: BigNumber = await this.contract.estimateGas.entrance!(
                coreData,
                swapData,
                amount,
                toChain,
                to,
                {value: options.isNative ? amount : undefined,}
            );
            estimateGas = gas.toString();
        } else {
            const gas = await this.contract.methods
                .entrance(coreData, swapData, amount, toChain, to)
                .estimateGas({
                    from: from,
                    value: options.isNative ? amount : undefined,
                });
            estimateGas = gas.toString();
        }
        return estimateGas;
    }
}
