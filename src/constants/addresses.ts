import { BigNumber } from '@ethersproject/bignumber';
import { Token } from '../entities/token';
import { ChainId } from './chains';

export const MCSContractAddresses: {[chainId in ChainId] : string} = {
    [ChainId.MAINNET] : "",
    [ChainId.BSC] : "",
    [ChainId.ETH_PRIV] : "0x27A51306c2b727d068c1B6E9895c6d160Edd21B3",
    [ChainId.MAP] : "",
    [ChainId.MAP_TEST] : "0x03e148c46f3704F81991ad11AC9A84970b965e81",
}

export const TokenRegisterAddress: string = "0x05EEf4f1dafE7E4BAbb17261ef538930fd2267e3";
