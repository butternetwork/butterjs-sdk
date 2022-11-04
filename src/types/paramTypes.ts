import { ethers, Signer } from 'ethers';
import { Provider } from '@ethersproject/abstract-provider';
import { Eth } from 'web3-eth';
import { Contract } from 'web3-eth-contract';
import { TransactionReceipt } from 'web3-core';
import { TransactionReceipt as EthersTransactionReceipt } from '@ethersproject/abstract-provider';

export type BarterProviderType = Signer | Provider | Eth;
export type BarterContractType = ethers.Contract | Contract;
export type BarterReceiptType = TransactionReceipt | EthersTransactionReceipt;

export type BarterJsonRpcProvider = {
  url?: string; // use default if not present
  chainId: number;
};
