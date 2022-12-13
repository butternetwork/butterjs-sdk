import {
  Account,
  connect,
  ConnectedWalletAccount,
  KeyPair,
  Near,
} from 'near-api-js';
import {
  NearNetworkConfig,
  TransferOutOptions,
} from '../../types/requestTypes';
import { MOS_CONTRACT_ADDRESS_SET } from '../../constants/addresses';
import { ChainId, ID_TO_CHAIN_ID } from '../../constants/chains';
import {
  ADD_MCS_TOKEN_TO_CHAIN,
  ADD_NATIVE_TO_CHAIN,
  TRANSFER_OUT_NATIVE,
  TRANSFER_OUT_TOKEN,
} from '../../constants/near_method_names';
import BN from 'bn.js';
import { ChangeFunctionCallOptions } from 'near-api-js/lib/account';
import { IMapOmnichainService } from '../interfaces/IMapOmnichainService';
import { hexToDecimalArray } from '../../utils';
import {
  ButterTransactionReceipt,
  ButterTransactionResponse,
} from '../../types/responseTypes';
import {
  adaptNearReceipt,
  assembleNearTransactionResponse,
} from '../../utils/responseUtil';
import { FinalExecutionOutcome } from 'near-api-js/lib/providers';
import { NearProviderType } from '../../types/paramTypes';
export class NearOmnichainService implements IMapOmnichainService {
  provider: NearProviderType;

  /**
   * we treat account as class member cuz to initialize a near account, async is required
   * @param provider
   */
  constructor(provider: NearProviderType) {
    this.provider = provider;
  }

  /**
   * transfer out token(not native coin) from source chain to designated token on target chain
   * @param fromAddress
   * @param tokenAddress input token address
   * @param amount amount in minimal unit
   * @param toAddress target chain receiving address
   * @param toChainId target chain id
   * @param options see {@link TransferOutOptions} for more detail
   */
  async doTransferOutToken(
    fromAddress: string,
    tokenAddress: string,
    amount: string,
    toAddress: string,
    toChainId: string,
    options: TransferOutOptions
  ): Promise<ButterTransactionResponse> {
    let mosAccountId: string;
    let account: Account | ConnectedWalletAccount;
    if (this.provider instanceof NearNetworkConfig) {
      // get mos contract address
      mosAccountId =
        this.provider.networkId === 'testnet'
          ? MOS_CONTRACT_ADDRESS_SET[ChainId.NEAR_TESTNET]
          : MOS_CONTRACT_ADDRESS_SET[ChainId.NEAR_MAINNET];

      // prep near connection
      const near: Near = await connect(this.provider);
      account = await near.account(this.provider.fromAccount);
    } else {
      // this.provider._networkId;
      mosAccountId =
        this.provider._networkId === 'testnet'
          ? MOS_CONTRACT_ADDRESS_SET[ChainId.NEAR_TESTNET]
          : MOS_CONTRACT_ADDRESS_SET[ChainId.NEAR_MAINNET];
      account = this.provider.account();
    }
    try {
      // the receiving address on Near need be in the format of number array as input
      const decimalArrayAddress: number[] = hexToDecimalArray(
        toAddress,
        toChainId
      );
      // contract call option
      const nearCallOptions: ChangeFunctionCallOptions = {
        contractId: mosAccountId,
        methodName: TRANSFER_OUT_TOKEN,
        args: {
          token: tokenAddress,
          to: decimalArrayAddress,
          amount: amount,
          to_chain: toChainId,
        },
        attachedDeposit: new BN(1, 10),
      };

      // manual input gas if necessary
      if (options.gas != undefined) {
        nearCallOptions.gas = new BN(options.gas, 10);
      }
      const executionOutcome: FinalExecutionOutcome =
        await this._doNearFunctionCall(account, nearCallOptions);
      return assembleNearTransactionResponse(executionOutcome);
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
  ): Promise<ButterTransactionResponse> {
    let mosAccountId: string;
    let account: Account | ConnectedWalletAccount;
    if (this.provider instanceof NearNetworkConfig) {
      mosAccountId =
        this.provider.networkId === 'testnet'
          ? MOS_CONTRACT_ADDRESS_SET[ChainId.NEAR_TESTNET]
          : MOS_CONTRACT_ADDRESS_SET[ChainId.NEAR_MAINNET];

      const near: Near = await connect(this.provider);
      account = await near.account(this.provider.fromAccount);
    } else {
      mosAccountId = this.provider.getAccountId().endsWith('testnet')
        ? MOS_CONTRACT_ADDRESS_SET[ChainId.NEAR_TESTNET]
        : MOS_CONTRACT_ADDRESS_SET[ChainId.NEAR_MAINNET];
      account = this.provider.account();
    }
    try {
      const decimalArrayAddress: number[] = hexToDecimalArray(
        toAddress,
        toChainId
      );
      const nearCallOptions: ChangeFunctionCallOptions = {
        contractId: mosAccountId,
        methodName: TRANSFER_OUT_NATIVE,
        args: {
          to: decimalArrayAddress,
          to_chain: Number.parseInt(toChainId),
        },
        attachedDeposit: new BN(amount, 10),
      };
      if (options.gas != undefined) {
        nearCallOptions.gas = new BN(options.gas, 10);
      }

      const executionOutcome: FinalExecutionOutcome =
        await this._doNearFunctionCall(account, nearCallOptions);
      return assembleNearTransactionResponse(executionOutcome);
    } catch (error) {
      throw error;
    }
  }

  /**
   * add tochain to allowed transfer out chains.
   * @param toChainId
   */
  public async addNativeToChain(toChainId: string) {
    if (this.provider instanceof NearNetworkConfig) {
      const mosAccountId: string =
        this.provider.networkId === 'testnet'
          ? MOS_CONTRACT_ADDRESS_SET[ChainId.NEAR_TESTNET]
          : '';

      const near: Near = await connect(this.provider);
      const account = await near.account(this.provider.fromAccount);
      const nearCallOptions: ChangeFunctionCallOptions = {
        contractId: mosAccountId,
        methodName: ADD_NATIVE_TO_CHAIN,
        args: {
          to_chain: toChainId,
        },
      };

      return await this._doNearFunctionCall(account, nearCallOptions);
    }
  }

  public async addTokenToChain(tokenAddress: string, toChainId: number) {
    if (this.provider instanceof NearNetworkConfig) {
      const mosAccountId: string =
        this.provider.networkId === 'testnet'
          ? MOS_CONTRACT_ADDRESS_SET[ChainId.NEAR_TESTNET]
          : '';

      const near: Near = await connect(this.provider);
      const account = await near.account(this.provider.fromAccount);

      const nearCallOptions: ChangeFunctionCallOptions = {
        contractId: mosAccountId,
        methodName: ADD_MCS_TOKEN_TO_CHAIN,
        args: {
          token: tokenAddress,
          to_chain: toChainId,
        },
      };

      return await this._doNearFunctionCall(account, nearCallOptions);
    }
  }

  /**
   * call near smart contract
   * @param account
   * @param options
   * @private
   */
  private async _doNearFunctionCall(
    account: Account | ConnectedWalletAccount,
    options: ChangeFunctionCallOptions
  ): Promise<FinalExecutionOutcome> {
    let outcome: FinalExecutionOutcome;
    try {
      outcome = await account.functionCall(options);
    } catch (e) {
      console.log(e);
    }
    return outcome!;
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

  async addFungibleTokenToChain(
    tokenAddress: string,
    toChainId: string
  ): Promise<void> {
    if (this.provider instanceof NearNetworkConfig) {
      const mosAccountId: string =
        this.provider.networkId === 'testnet'
          ? MOS_CONTRACT_ADDRESS_SET[ChainId.NEAR_TESTNET]
          : '';

      const near: Near = await connect(this.provider);
      const account = await near.account(this.provider.fromAccount);

      const nearCallOptions: ChangeFunctionCallOptions = {
        contractId: mosAccountId,
        methodName: 'add_fungible_token_to_chain',
        args: {
          token: tokenAddress,
          to_chain: toChainId,
        },
        gas: new BN('300000000000000', 10),
      };

      const executionOutcome: FinalExecutionOutcome =
        await this._doNearFunctionCall(account, nearCallOptions);
    }
  }
}
