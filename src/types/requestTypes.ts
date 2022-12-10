import { Token } from '../entities';
import { ChainId } from '../constants/chains';
import { BigNumber, Signer } from 'ethers';
import { KeyStore } from 'near-api-js/lib/key_stores';
import { BaseCurrency } from '../entities/BaseCurrency';
import { Provider } from '@ethersproject/abstract-provider';
import { Eth } from 'web3-eth';
import { NearProviderType } from './paramTypes';

export type BridgeRequestParam = {
  fromAddress: string;
  fromToken: BaseCurrency;
  fromChainId: string;
  toChainId: string;
  toAddress: string;
  amount: string;
  options: BridgeOptions;
};

export type SwapRequestParam = {
  fromAddress: string;
  fromToken: BaseCurrency;
  toAddress: string;
  toToken: BaseCurrency;
  amountIn: string;
  swapRoute: ButterCrossChainRoute;
  options: SwapOptions;
};

export type ButterCrossChainRoute = {
  srcRoute: ButterSwapRoute[];
  mapRoute: ButterSwapRoute[];
  targetRoute: ButterSwapRoute[];
};

export type ButterSwapRoute = {
  chainId: string;
  amountIn: string;
  amountOut: string;
  path: ButterPath[];
  dexName: string;
  tokenIn: BaseCurrency;
  tokenOut: BaseCurrency;
};

export type ButterPath = {
  tokenIn: PathToken;
  tokenOut: PathToken;
  poolId: string;
};

export type PathToken = {
  address: string;
  icon?: string;
  symbol?: string;
};

export type SwapOptions = {
  signerOrProvider?: Signer | Provider | Eth; // When source chain is EVM provide Ethers.js Signer/Provider or Web3.js Eth info
  nearProvider?: NearProviderType; // mandatory when src chain is near
  gas?: string;
};

export type BridgeOptions = {
  signerOrProvider?: Signer | Provider | Eth; // When source chain is EVM provide Ethers.js Signer/Provider or Web3.js Eth info
  nearProvider?: NearProviderType; // mandatory when src chain is near
  gas?: string;
};

export type AddTokenPairParam = {
  srcToken: BaseCurrency;
  targetToken: BaseCurrency;
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

export type TransferOutOptions = {
  gas?: string;
};

export type FeeRate = {
  bps: number; // one hundredth of a percent
  highest: BigNumber; // highest fee in token amount
  lowest: BigNumber; // lowest fee in token amount
};
