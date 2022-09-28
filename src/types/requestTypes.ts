import { Token } from '../entities';
import { ChainId } from '../constants/chains';
import { Signer } from 'ethers';
import { KeyStore } from 'near-api-js/lib/key_stores';

export type BridgeRequestParam = {
  token: Token;
  fromChainId: ChainId;
  toChainId: ChainId;
  toAddress: string;
  amount: string;
  signer: Signer;
};

export type NEARNetworkConfig = {
  keyStore: KeyStore;
  nodeUrl: string;
  networkId: string; // testnet | mainnet
};
