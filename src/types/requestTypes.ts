import { Token } from '../entities';
import { ChainId } from '../constants/chains';
import { BigNumber, Signer } from 'ethers';
import { KeyStore } from 'near-api-js/lib/key_stores';
import { BaseCurrency } from '../entities/BaseCurrency';

export type BridgeRequestParam = {
  token: BaseCurrency;
  fromChainId: ChainId;
  toChainId: ChainId;
  toAddress: string;
  amount: string;
  gasEstimate: boolean; // whether a gas estimate operation or not
  options: BridgeOptions;
};

export type BridgeOptions = {
  signer?: Signer; // mandatory when src chain is evm chain(or ethers.js compatible)
  nearConfig?: NearNetworkConfig; // mandatory when src chain is near
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
