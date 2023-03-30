import {BaseContract} from './base';
import ABI from '../../abis/TokenRegister.json';
import {Signer} from "ethers";
import {Provider} from "@ethersproject/abstract-provider";
import {address, bytes, uint256} from "../../types";

export class TokenRegister extends BaseContract {

    constructor(address: string, provider?: Signer | Provider) {
        super(address, ABI.abi, provider);
    }

    registerToken(_token: address, _vaultToken: address, _mintable: boolean) {
    }

    getRelayChainAmount(_token: address, _fromChain: uint256, _amount: uint256) {
    }

    getRelayChainToken(_fromChain: uint256, _fromToken: bytes) {
    }

    getVaultToken(_token: address) {
    }

    getToChainToken(_token: address, _toChain: uint256) {
    }

    getToChainAmount(_token: address, _amount: uint256, _toChain: uint256) {
    }

    getToChainTokenInfo(_token: address, _toChain: uint256) {
    }

    getTokenFee(_token: address, _amount: uint256, _toChain: uint256) {
    }

    getFeeAmountAndInfo(_fromToken: bytes, _fromAmount: uint256, _toChain: uint256) {
    }


}
