import {CHAIN_ID} from "./chains2";
import {
    BUTTER_ROUTER_ADDRESSES,
    MOS_CONTRACT_ADDRESSES,
    TOKEN_REGISTER_ADDRESSES,
    MOS_CONTRACT_NEAR_ADDRESSES
} from "./config";


export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

/**
 * MOS contract address by chainId
 * smart contract source code:
 * {@link https://github.com/butternetwork/butter-mos-contracts/blob/master/evmV2/contracts/MAPCrossChainServiceRelay.sol}
 * {@link https://github.com/butternetwork/
 * butter-mos-contracts/blob/master/evmV2/contracts/MAPCrossChainService.sol}
 * */
export const MOS_CONTRACT = (chainId: CHAIN_ID | string): string => {
    if (MOS_CONTRACT_ADDRESSES[chainId]) {
        return MOS_CONTRACT_ADDRESSES[chainId];
    }
    throw new Error(`Unsupport mos with chainId:${chainId}`)
}
export const MOS_CONTRACT_NEAR=(chainId: CHAIN_ID | string): any => {
    if (MOS_CONTRACT_NEAR_ADDRESSES[chainId]) {
        return MOS_CONTRACT_NEAR_ADDRESSES[chainId];
    }
    throw new Error(`Unsupport near mos with chainId:${chainId}`)
};
export const BUTTER_ROUTER = (chainId: CHAIN_ID | string): string => {
    if (BUTTER_ROUTER_ADDRESSES[chainId]) {
        return BUTTER_ROUTER_ADDRESSES[chainId];
    }
    throw new Error(`Unsupport router with chainId:${chainId}`)
}

/**
 * TokenRegister Address: https://github.com/butternetwork/butter-mos-contracts/blob/master/evm/contracts/TokenRegister.sol
 */
export const TOKEN_REGISTER = (chainId: CHAIN_ID | string): string => {
    if (TOKEN_REGISTER_ADDRESSES[chainId]) {
        return TOKEN_REGISTER_ADDRESSES[chainId];
    }
    throw new Error(`Unsupport token register with chainId:${chainId}`)
}
