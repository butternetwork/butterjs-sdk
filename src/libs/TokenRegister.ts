import { BigNumber, ethers, Signer } from 'ethers';
import TokenRegisterMetadata from '../abis/TokenRegister.json';
import { Provider, TransactionReceipt } from '@ethersproject/abstract-provider';
import { ButterContractType, ButterProviderType } from '../types/paramTypes';
import { Eth } from 'web3-eth';
import {
  ButterFeeRate,
  ButterTransactionReceipt,
} from '../types/responseTypes';
import { adaptEthReceipt } from '../utils/responseUtil';
import { getHexAddress } from '../utils';
import {Currency} from "../beans";

export class TokenRegister {
  private readonly contract: ButterContractType;
  private readonly provider: ButterProviderType;
  constructor(contractAddress: string, signerOrProvider: ButterProviderType) {
    if (
      signerOrProvider instanceof Signer ||
      signerOrProvider instanceof Provider
    ) {
      this.contract = new ethers.Contract(
        contractAddress,
        TokenRegisterMetadata.abi,
        signerOrProvider
      );
    } else {
      this.contract = new signerOrProvider.Contract(
        TokenRegisterMetadata.abi as any,
        contractAddress
      );
    }
    this.provider = signerOrProvider;
  }

  async registerToken(
    sourceChain: string,
    sourceMapToken: string,
    mapToken: string
  ): Promise<ButterTransactionReceipt> {
    let regTokenTx;
    if (this.contract instanceof ethers.Contract) {
      regTokenTx = await this.contract.regToken(
        sourceChain,
        getHexAddress(sourceMapToken, sourceChain, true),
        mapToken
      );
      regTokenTx = await regTokenTx.wait();
    } else {
      regTokenTx = await this.contract.methods
        .regToken(sourceChain, sourceMapToken, mapToken)
        .send({ from: (this.provider as Eth).defaultAccount });
    }
    return adaptEthReceipt(regTokenTx);
  }

  async getToChainToken(
    tokenAddress: string,
    targetChain: string
  ): Promise<string> {
    if (this.contract instanceof ethers.Contract) {
      return await this.contract.getToChainToken(tokenAddress, targetChain);
    } else return '';
  }

  async getToChainAmount(
    token: Currency,
    amount: string,
    toChainId: string
  ): Promise<string> {
    if (this.contract instanceof ethers.Contract) {
      return await this.contract.getToChainAmount(
        getHexAddress(token.address, token.chainId, true),
        amount,
        toChainId
      );
    } else return '';
  }

  async getRelayChainToken(
    fromChain: string,
    fromToken: Currency
  ): Promise<string> {
    if (fromToken.isNative) {
      fromToken = fromToken.wrapped;
    }
    if (this.contract instanceof ethers.Contract) {
      return await this.contract.getRelayChainToken(
        fromChain,
        getHexAddress(fromToken.address, fromChain, false)
      );
    } else return '';
  }

  async getRelayChainAmount(
    tokenAddress: string,
    fromChain: string,
    amount: string
  ): Promise<string> {
    if (this.contract instanceof ethers.Contract) {
      return await this.contract.getRelayChainAmount(
        tokenAddress,
        fromChain,
        amount
      );
    } else return '';
  }

  async getVaultToken(tokenAddress: string): Promise<string> {
    if (this.contract instanceof ethers.Contract) {
      return await this.contract.getVaultToken(tokenAddress);
    } else return '';
  }

  async getFeeRate(
    tokenAddress: string,
    toChain: string
  ): Promise<ButterFeeRate> {
    if (this.contract instanceof ethers.Contract) {
      return (await this.contract.getToChainTokenInfo(tokenAddress, toChain))
        .feeRate;
    } else throw new Error('contract type not supported');
  }

  async getTokenFee(
    tokenAddress: string,
    amount: string,
    toChain: string
  ): Promise<string> {
    if (this.contract instanceof ethers.Contract) {
      return await this.contract.getTokenFee(
        tokenAddress,
        BigNumber.from(amount),
        BigNumber.from(toChain)
      );
    } else return '';
  }

  async checkMintable(tokenAddress: string): Promise<boolean> {
    if (this.contract instanceof ethers.Contract) {
      return await this.contract.checkMintable(tokenAddress);
    } else throw new Error('check mintable error');
  }
}
