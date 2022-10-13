import { Token } from '../entities';
import { ChainId } from '../constants/chains';
import { Signer } from 'ethers';
import { KeyStore } from 'near-api-js/lib/key_stores';
import { BaseCurrency } from '../entities/BaseCurrency';

export type BridgeRequestParam = {
  token: BaseCurrency;
  fromChainId: ChainId;
  toChainId: ChainId;
  toAddress: string;
  amount: string;
  signer?: Signer; // when src is evm chain;
  nearConfig?: NearNetworkConfig; // when src chain is near chain
};

export type AddTokenPairParam = {
  srcToken: Token;
  targetToken: Token;
  feeBP: number; // one hundredth of a percent
  mapNetwork: 'map-devnet' | 'map-testnet' | 'map-mainnet';
  mapToken?: Token; // act as an intermediary, only mandatory when neither tokens from MAP chain
  mapSigner: Signer;
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
