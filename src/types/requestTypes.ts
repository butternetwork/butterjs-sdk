import { Token } from '../entities';
import { ChainId } from '../constants/chains';
import { Signer } from 'ethers';

export type BridgeRequestParam = {
  token: Token;
  fromChainId: ChainId;
  toChainId: ChainId;
  toAddress: string;
  amount: string;
  signer: Signer;
};
