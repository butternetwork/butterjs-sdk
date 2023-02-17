import { Token } from '../entities';
import { BigNumber, Signer } from 'ethers';
import { KeyStore } from 'near-api-js/lib/key_stores';
import { Provider } from '@ethersproject/abstract-provider';
import { Eth } from 'web3-eth';
import { NearProviderType } from './paramTypes';
import {Currency} from "../beans";

export type BridgeRequestParam = {
  fromAddress: string;
  fromToken: Currency;
  fromChainId: string;
  toChainId: string;
  toAddress: string;
  amount: string;
  options: ButterTransactionOption;
};

export type SwapRequestParam = {
  fromAddress: string;
  fromToken: Currency;
  toAddress: string;
  toToken: Currency;
  amountIn: string; // in minimal uint
  swapRouteStr: string;
  slippage?: number; // in bps
  options: ButterTransactionOption;
};

export interface ButterCrossChainRoute {
  srcChain: ButterSwapRoute[];
  mapChain: ButterSwapRoute[];
  targetChain: ButterSwapRoute[];
  bridgeIn: any;
  bridgeOut: any;
}

export interface ButterSwapRoute {
  chainId: string;
  amountIn: string;
  amountOut: string;
  path: ButterPath[];
  dexName: string;
  tokenIn: Currency;
  tokenOut: Currency;
}

export interface ButterPath {
  id: string;
  tokenIn: PathToken;
  tokenOut: PathToken;
}

export interface PathToken {
  address: string;
  icon?: string;
  symbol?: string;
}

export type ButterTransactionOption = {
  signerOrProvider?: Signer | Provider | Eth; // When source chain is EVM provide Ethers.js Signer/Provider or Web3.js Eth info
  nearProvider?: NearProviderType; // mandatory when src chain is near
  gas?: string;
  gasPrice?: string;
};

export type BridgeOptions = {
  signerOrProvider?: Signer | Provider | Eth; // When source chain is EVM provide Ethers.js Signer/Provider or Web3.js Eth info
  nearProvider?: NearProviderType; // mandatory when src chain is near
  gas?: string;
};

export type AddTokenPairParam = {
  srcToken: Currency;
  targetToken: Currency;
  feeRate: FeeRate;
  mapNetwork: 'map-devnet' | 'map-testnet' | 'map-mainnet';
  mapSigner: Signer;
  nearConfig?: NearNetworkConfig;
  mapToken?: Token; // act as an intermediary, only mandatory when neither tokens from MAP chain
  srcSigner?: Signer; // only mandatory when src chain is EVM compatible
};

export class NearNetworkConfig {
  fromAccount: string;
  keyStore: KeyStore;
  nodeUrl: string;
  networkId: 'testnet' | 'mainnet';
  constructor(
    fromAccount: string,
    keyStore: KeyStore,
    nodeUrl: string,
    networkId: 'testnet' | 'mainnet'
  ) {
    this.fromAccount = fromAccount;
    this.keyStore = keyStore;
    this.nodeUrl = nodeUrl;
    this.networkId = networkId;
  }
}

export type TransactionOptions = {
  gas?: string;
};

export type FeeRate = {
  bps: number; // one hundredth of a percent
  highest: BigNumber; // highest fee in token amount
  lowest: BigNumber; // lowest fee in token amount
};

export interface ButterCoreParam {
  amountInArr: string[];
  paramsArr: string[];
  routerIndex: string[];
  inputOutAddre: [string, string];
}

export type ButterRouterParam = {
  coreSwapData: ButterCoreParam;
  targetSwapData: string;
  amount: string;
  toChainId: string;
  toAddress: string;
};
