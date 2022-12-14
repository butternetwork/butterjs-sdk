import { Account, connect, ConnectedWalletAccount, Near } from 'near-api-js';
import {
  NearNetworkConfig,
  TransactionOptions,
} from '../../types/requestTypes';
import { MOS_CONTRACT_ADDRESS_SET } from '../../constants/addresses';
import { ChainId } from '../../constants/chains';
import {
  ADD_MCS_TOKEN_TO_CHAIN,
  ADD_NATIVE_TO_CHAIN,
  FT_TRANSFER_CALL,
  SWAP_OUT_NATIVE,
  TRANSFER_OUT_NATIVE,
  TRANSFER_OUT_TOKEN,
  VALID_MCS_TOKEN_OUT,
} from '../../constants/near_method_names';
import BN from 'bn.js';
import {
  ChangeFunctionCallOptions,
  FunctionCallOptions,
  ViewFunctionCallOptions,
} from 'near-api-js/lib/account';
import { IMapOmnichainService } from '../interfaces/IMapOmnichainService';
import { hexToDecimalArray } from '../../utils';
import { ButterTransactionResponse } from '../../types/responseTypes';
import { assembleNearTransactionResponse } from '../../utils/responseUtil';
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
   * @param options see {@link TransactionOptions} for more detail
   */
  async doTransferOutToken(
    fromAddress: string,
    tokenAddress: string,
    amount: string,
    toAddress: string,
    toChainId: string,
    options: TransactionOptions
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

      // check if token is mintable
      const isMintable: boolean = await this._checkMintable(
        mosAccountId,
        tokenAddress,
        toChainId,
        account
      );

      let nearTransferOutOptions: ChangeFunctionCallOptions;
      // contract call option
      if (isMintable) {
        nearTransferOutOptions = {
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
      } else {
        const msg = {
          type: 'Transfer',
          to: decimalArrayAddress,
          to_chain: toChainId,
        };

        console.log('msg', JSON.stringify(msg));
        nearTransferOutOptions = {
          contractId: tokenAddress,
          methodName: FT_TRANSFER_CALL,
          args: {
            receiver_id: mosAccountId,
            amount: amount,
            msg: JSON.stringify(msg),
          },
          attachedDeposit: new BN(1, 10),
        };
      }

      // manual input gas if necessary
      if (options.gas != undefined) {
        nearTransferOutOptions.gas = new BN(options.gas, 10);
      } else {
        nearTransferOutOptions.gas = new BN('300000000000000', 10);
      }
      const executionOutcome: FinalExecutionOutcome =
        await this._doNearFunctionCall(account, nearTransferOutOptions);

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
   * @param options see {@link TransactionOptions} for more detail
   */
  async doTransferOutNative(
    fromAddress: string,
    toAddress: string,
    toChainId: string,
    amount: string,
    options: TransactionOptions
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

  async doSwapOutToken(
    fromAddress: string,
    tokenAddress: string,
    amount: string,
    toAddress: string,
    toChainId: string,
    msg: string,
    options: TransactionOptions
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

      const nearTransferOutOptions: FunctionCallOptions = {
        contractId: tokenAddress,
        methodName: FT_TRANSFER_CALL,
        args: {
          receiver_id: mosAccountId,
          amount: amount,
          msg: msg,
        },
        attachedDeposit: new BN(1, 10),
      };

      // manual input gas if necessary
      nearTransferOutOptions.gas = new BN('300000000000000', 10);

      const executionOutcome: FinalExecutionOutcome =
        await this._doNearFunctionCall(account, nearTransferOutOptions);

      return assembleNearTransactionResponse(executionOutcome);
    } catch (error) {
      throw error;
    }
  }

  async doSwapOutNative(
    fromAddress: string,
    toAddress: string,
    toChainId: string,
    amount: string,
    swapInfo: string,
    options: TransactionOptions
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
        methodName: SWAP_OUT_NATIVE,
        args: {
          to: decimalArrayAddress,
          to_chain: toChainId,
          swap_info: JSON.parse(swapInfo),
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
          : MOS_CONTRACT_ADDRESS_SET[ChainId.NEAR_MAINNET];

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
          : MOS_CONTRACT_ADDRESS_SET[ChainId.NEAR_MAINNET];

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

  private async _doNearViewFunctionCall(
    account: Account | ConnectedWalletAccount,
    options: ViewFunctionCallOptions
  ) {
    let result;
    try {
      result = await account.viewFunctionV2(options);
    } catch (e) {
      console.log(e);
    }
    return result;
  }

  doDepositOutToken(
    tokenAddress: string,
    from: string,
    to: string,
    amount: string,
    options?: TransactionOptions
  ): Promise<string> {
    return Promise.resolve('not implemented');
  }

  gasEstimateTransferOutNative(
    fromAddress: string,
    toAddress: string,
    toChainId: string,
    amount: string,
    options?: TransactionOptions
  ): Promise<string> {
    return Promise.resolve('not supported');
  }

  gasEstimateTransferOutToken(
    fromAddress: string,
    tokenAddress: string,
    amount: string,
    toAddress: string,
    toChainId: string,
    options?: TransactionOptions
  ): Promise<string> {
    return Promise.resolve('not supported');
  }

  gasEstimateSwapOutNative(
    fromAddress: string,
    toAddress: string,
    toChainId: string,
    amount: string,
    swapData: string,
    options?: TransactionOptions
  ): Promise<string> {
    return Promise.resolve('not supported');
  }

  gasEstimateSwapOutToken(
    fromAddress: string,
    tokenAddress: string,
    toAddress: string,
    toChainId: string,
    amount: string,
    swapData: string,
    options?: TransactionOptions
  ): Promise<string> {
    return Promise.resolve('not supported');
  }

  private async _checkMintable(
    mosAccountId: string,
    tokenAddress: string,
    toChainId: string,
    account: Account | ConnectedWalletAccount
  ): Promise<boolean> {
    const nearCheckMintableOptions: ViewFunctionCallOptions = {
      contractId: mosAccountId,
      methodName: VALID_MCS_TOKEN_OUT,
      args: {
        token: tokenAddress,
        to_chain: toChainId,
      },
    };
    return await this._doNearViewFunctionCall(
      account,
      nearCheckMintableOptions
    );
  }

  async addFungibleTokenToChain(
    tokenAddress: string,
    toChainId: string
  ): Promise<void> {
    if (this.provider instanceof NearNetworkConfig) {
      const mosAccountId: string =
        this.provider.networkId === 'testnet'
          ? MOS_CONTRACT_ADDRESS_SET[ChainId.NEAR_TESTNET]
          : MOS_CONTRACT_ADDRESS_SET[ChainId.NEAR_MAINNET];

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
