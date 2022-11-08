import { Token } from '../entities';
import { ChainId } from '../constants/chains';
import { BigNumber, Signer } from 'ethers';
import { KeyStore } from 'near-api-js/lib/key_stores';
import { BaseCurrency } from '../entities/BaseCurrency';
import { Provider } from '@ethersproject/abstract-provider';
import { Eth } from 'web3-eth';

export type BridgeRequestParam = {
  fromToken: BaseCurrency;
  fromChainId: ChainId;
  toChainId: ChainId;
  toAddress: string;
  amount: string;
  options: BridgeOptions;
};

export type SwapRequestParam = {
  fromToken: BaseCurrency;
  toToken: BaseCurrency;
  amountIn: string;
  amountOutMin: string;
  tradeType: number; // 0 for EXACT_IN, 1 for EXACT_OUT
  options: SwapOptions;
};

export type SwapOptions = {
  signerOrProvider?: Signer | Provider | Eth; // When source chain is EVM provide Ethers.js Signer/Provider infor or Web3.js Eth info
  nearConfig?: NearNetworkConfig; // mandatory when src chain is near
  useAggregator?: boolean; // whether Barter's Smart Router Aggregator or not
  gas?: string;
};

export type BridgeOptions = {
  signerOrProvider?: Signer | Provider | Eth; // When source chain is EVM provide Ethers.js Signer/Provider infor or Web3.js Eth info
  nearConfig?: NearNetworkConfig; // mandatory when src chain is near
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

export type NearNetworkConfig = {
  fromAccount: string;
  keyStore: KeyStore;
  nodeUrl: string;
  networkId: 'testnet' | 'mainnet';
};

export type TransferOutOptions = {
  gas?: string;
};

export type FeeRate = {
  bps: number; // one hundredth of a percent
  highest: BigNumber; // highest fee in token amount
  lowest: BigNumber; // lowest fee in token amount
};
