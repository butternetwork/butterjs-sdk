import {Signer, Contract} from 'ethers';
import {Provider} from '@ethersproject/abstract-provider';
import {ContractFunction} from "@ethersproject/contracts/src.ts";

export class BaseContract {

    readonly [key: string]: ContractFunction | any;

    private readonly contract: Contract;
    private readonly provider?: Signer | Provider|any;

    constructor(address: string, abi: any[], provider?: Signer | Provider|any) {
        this.contract = new Contract(
            address, abi, provider
        );
        this.provider = provider;
        for (let i = 0; i < abi.length; i++) {
            let item = abi[i];
            let {name, type, inputs} = item;
            if (type === 'function') {
                if (this[name]){continue;}
                if (inputs && inputs.length > 0) {
                    // @ts-ignore
                    this[name]
                        = (...params: any[]) => this.contract[name](...params);
                } else {
                    // @ts-ignore
                    this[name]
                        = () => this.contract[name]();
                }
            }
        }

    }

    callMethod(name: string, ...params: any[]) {
        return this.contract[name](...params);
    }

}
