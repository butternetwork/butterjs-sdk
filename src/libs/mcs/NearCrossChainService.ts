import { Account, connect, KeyPair, Near } from 'near-api-js';
import {
  NearNetworkConfig,
  TransferOutOptions,
} from '../../types/requestTypes';
import { MCS_CONTRACT_ADDRESS_SET } from '../../constants/addresses';
import { ChainId, ID_TO_CHAIN_ID } from '../../constants/chains';
import {
  TRANSFER_OUT_NATIVE,
  TRANSFER_OUT_TOKEN,
} from '../../constants/near_method_names';
import BN from 'bn.js';
import { ChangeFunctionCallOptions } from 'near-api-js/lib/account';
import { IMapCrossChainService } from '../interfaces/IMapCrossChainService';
export class NearCrossChainService implements IMapCrossChainService {
  config: NearNetworkConfig;

  constructor(config: NearNetworkConfig) {
    this.config = config;
  }

  async doTransferOutToken(
    tokenAddress: string,
    amount: string,
    toAddress: number[],
    toChainId: string,
    options: TransferOutOptions
  ): Promise<string> {
    const fromAccountId = options.fromAccount;
    if (fromAccountId == undefined) {
      throw new Error('from account must be provided for near');
    }
    try {
      const mcsAccountId: string =
        this.config.networkId === 'testnet'
          ? MCS_CONTRACT_ADDRESS_SET[ChainId.NEAR_TESTNET]
          : '';

      const near: Near = await connect(this.config);
      const account = await near.account(fromAccountId);

      const nearCallOptions: ChangeFunctionCallOptions = {
        contractId: mcsAccountId,
        methodName: TRANSFER_OUT_TOKEN,
        args: {
          token: tokenAddress,
          to: toAddress,
          amount: amount,
          to_chain: toChainId,
        },
        attachedDeposit: new BN(amount, 10),
      };
      if (options.gas != undefined) {
        nearCallOptions.gas = new BN(options.gas, 10);
      }

      return await this._doNearFunctionCall(account, nearCallOptions);
    } catch (error) {
      throw error;
    }
  }

  async doTransferOutNative(
    toAddress: number[],
    toChainId: string,
    amount: string,
    options: TransferOutOptions
  ): Promise<string> {
    const fromAccountId = options.fromAccount;
    if (fromAccountId == undefined) {
      throw new Error('from account must be provided for near');
    }
    try {
      const mcsAccountId: string =
        this.config.networkId === 'testnet'
          ? MCS_CONTRACT_ADDRESS_SET[ChainId.NEAR_TESTNET]
          : '';

      const near: Near = await connect(this.config);
      const account = await near.account(fromAccountId);

      const nearCallOptions: ChangeFunctionCallOptions = {
        contractId: mcsAccountId,
        methodName: TRANSFER_OUT_NATIVE,
        args: {
          to: toAddress,
          to_chain: toChainId,
        },
        attachedDeposit: new BN(amount, 10),
      };
      if (options.gas != undefined) {
        nearCallOptions.gas = new BN(options.gas, 10);
      }

      return await this._doNearFunctionCall(account, nearCallOptions);
    } catch (error) {
      throw error;
    }
  }

  private async _doNearFunctionCall(
    account: Account,
    options: ChangeFunctionCallOptions
  ): Promise<string> {
    const response = await account.functionCall(options);
    return response.transaction.hash;
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
}
