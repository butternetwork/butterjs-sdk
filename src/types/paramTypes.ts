import { ethers, Signer } from 'ethers';
import { Provider } from '@ethersproject/abstract-provider';
import { Eth } from 'web3-eth';
import { Contract } from 'web3-eth-contract';
import { TransactionReceipt } from 'web3-core';
import { TransactionReceipt as EthersTransactionReceipt } from '@ethersproject/abstract-provider';
import { NearNetworkConfig } from './requestTypes';
import { WalletConnection } from 'near-api-js';

export type ButterProviderType = Signer | Provider | Eth;
export type ButterContractType = ethers.Contract | Contract;
export type ButterReceiptType = TransactionReceipt | EthersTransactionReceipt;
export type NearProviderType = NearNetworkConfig | WalletConnection;
export type ButterJsonRpcProvider = {
  url?: string; // use default if not present
  chainId: number;
};
