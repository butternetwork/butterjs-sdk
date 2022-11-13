import { Account, connect, KeyPair, Near } from 'near-api-js';
import {
  NearNetworkConfig,
  TransferOutOptions,
} from '../../types/requestTypes';
import { MCS_CONTRACT_ADDRESS_SET } from '../../constants/addresses';
import { ChainId, ID_TO_CHAIN_ID } from '../../constants/chains';
import {
  ADD_MCS_TOKEN_TO_CHAIN,
  ADD_NATIVE_TO_CHAIN,
  TRANSFER_OUT_NATIVE,
  TRANSFER_OUT_TOKEN,
} from '../../constants/near_method_names';
import BN from 'bn.js';
import { ChangeFunctionCallOptions } from 'near-api-js/lib/account';
import { IMapCrossChainService } from '../interfaces/IMapCrossChainService';
import { hexToDecimalArray } from '../../utils';
import {
  BarterTransactionReceipt,
  BarterTransactionResponse,
} from '../../types/responseTypes';
import { adaptNearReceipt } from '../../utils/responseUtil';
import { FinalExecutionOutcome } from 'near-api-js/lib/providers';
export class NearCrossChainService implements IMapCrossChainService {
  config: NearNetworkConfig;

  /**
   * we treat account as class member cuz to initialize a near account, async is required
   * @param config
   */
  constructor(config: NearNetworkConfig) {
    this.config = config;
  }

  /**
   * transfer out token(not native coin) from source chain to designated token on target chain
   * @param tokenAddress input token address
   * @param amount amount in minimal unit
   * @param toAddress target chain receiving address
   * @param toChainId target chain id
   * @param gasEstimation
   * @param options see {@link TransferOutOptions} for more detail
   */
  async doTransferOutToken(
    fromAddress: string,
    tokenAddress: string,
    amount: string,
    toAddress: string,
    toChainId: string,
    options: TransferOutOptions
  ): Promise<BarterTransactionResponse> {
    try {
      // get mcs contract address
      const mcsAccountId: string =
        this.config.networkId === 'testnet'
          ? MCS_CONTRACT_ADDRESS_SET[ChainId.NEAR_TESTNET]
          : '';

      // prep near connection
      const near: Near = await connect(this.config);
      const account = await near.account(this.config.fromAccount);

      // the receiving address on Near need be in the format of number array as input
      const decimalArrayAddress: number[] = hexToDecimalArray(
        toAddress,
        toChainId
      );

      // contract call option
      const nearCallOptions: ChangeFunctionCallOptions = {
        contractId: mcsAccountId,
        methodName: TRANSFER_OUT_TOKEN,
        args: {
          token: tokenAddress,
          to: decimalArrayAddress,
          amount: amount,
          to_chain: toChainId,
        },
        attachedDeposit: new BN(amount, 10),
      };

      // manual input gas if necessary
      if (options.gas != undefined) {
        nearCallOptions.gas = new BN(options.gas, 10);
      }

      // return adaptNearReceipt(
      //   await this._doNearFunctionCall(account, nearCallOptions)
      // );
      return <BarterTransactionResponse>{};
    } catch (error) {
      throw error;
    }
  }

  /**
   * transfer out native coin from source chain to designated token on target chain
   * @param fromAddress
   * @param toAddress target chain receiving address
   * @param toChainId target chain id
   * @param amount amount to bridge in minimal unit
   * @param options see {@link TransferOutOptions} for more detail
   */
  async doTransferOutNative(
    fromAddress: string,
    toAddress: string,
    toChainId: string,
    amount: string,
    options: TransferOutOptions
  ): Promise<BarterTransactionResponse> {
    try {
      const mcsAccountId: string =
        this.config.networkId === 'testnet'
          ? MCS_CONTRACT_ADDRESS_SET[ChainId.NEAR_TESTNET]
          : '';

      const near: Near = await connect(this.config);
      const account = await near.account(this.config.fromAccount);

      const decimalArrayAddress: number[] = hexToDecimalArray(
        toAddress,
        toChainId
      );

      const nearCallOptions: ChangeFunctionCallOptions = {
        contractId: mcsAccountId,
        methodName: TRANSFER_OUT_NATIVE,
        args: {
          to: decimalArrayAddress,
          to_chain: toChainId,
        },
        attachedDeposit: new BN(amount, 10),
      };
      if (options.gas != undefined) {
        nearCallOptions.gas = new BN(options.gas, 10);
      }

      // return adaptNearReceipt(
      //   await this._doNearFunctionCall(account, nearCallOptions)
      // );
      return <BarterTransactionResponse>{};
    } catch (error) {
      throw error;
    }
  }

  /**
   * add tochain to allowed transfer out chains.
   * @param toChainId
   */
  public async addNativeToChain(toChainId: number) {
    const mcsAccountId: string =
      this.config.networkId === 'testnet'
        ? MCS_CONTRACT_ADDRESS_SET[ChainId.NEAR_TESTNET]
        : '';

    const near: Near = await connect(this.config);
    const account = await near.account(this.config.fromAccount);
    const nearCallOptions: ChangeFunctionCallOptions = {
      contractId: mcsAccountId,
      methodName: ADD_NATIVE_TO_CHAIN,
      args: {
        to_chain: toChainId,
      },
    };

    return await this._doNearFunctionCall(account, nearCallOptions);
  }

  public async addTokenToChain(tokenAddress: string, toChainId: number) {
    const mcsAccountId: string =
      this.config.networkId === 'testnet'
        ? MCS_CONTRACT_ADDRESS_SET[ChainId.NEAR_TESTNET]
        : '';

    const near: Near = await connect(this.config);
    const account = await near.account(this.config.fromAccount);

    const nearCallOptions: ChangeFunctionCallOptions = {
      contractId: mcsAccountId,
      methodName: ADD_MCS_TOKEN_TO_CHAIN,
      args: {
        token: tokenAddress,
        to_chain: toChainId,
      },
    };

    return await this._doNearFunctionCall(account, nearCallOptions);
  }

  /**
   * call near smart contract
   * @param account
   * @param options
   * @private
   */
  private async _doNearFunctionCall(
    account: Account,
    options: ChangeFunctionCallOptions
  ): Promise<FinalExecutionOutcome> {
    const outcome = await account.functionCall(options);
    return outcome;
  }

  doDepositOutToken(
    tokenAddress: string,
    from: string,
    to: string,
    amount: string,
    options?: TransferOutOptions
  ): Promise<string> {
    return Promise.resolve('');
  }

  gasEstimateTransferOutNative(
    fromAddress: string,
    toAddress: string,
    toChainId: string,
    amount: string,
    options?: TransferOutOptions
  ): Promise<string> {
    return Promise.resolve('');
  }

  gasEstimateTransferOutToken(
    fromAddress: string,
    tokenAddress: string,
    amount: string,
    toAddress: string,
    toChainId: string,
    options?: TransferOutOptions
  ): Promise<string> {
    return Promise.resolve('');
  }
}
