import { connect, KeyPair, Near } from 'near-api-js';
import { NEARNetworkConfig } from '../types/requestTypes';
import { MCS_CONTRACT_ADDRESS_SET } from '../constants/addresses';
import { ChainId, ID_TO_CHAIN_ID } from '../constants/chains';
import { TRANSFER_OUT_NATIVE } from '../constants/near_method_names';
import BN from 'bn.js';
export class NearCrossChainService {
  config: NEARNetworkConfig;

  constructor(config: NEARNetworkConfig) {
    this.config = config;
  }

  async doTransferOutNative(
    fromAccountId: string,
    toAddress: number[],
    toChainId: number,
    amount: BN
  ): Promise<string> {
    try {
      const near: Near = await connect(this.config);

      const mcsAccountId: string =
        this.config.networkId === 'testnet'
          ? MCS_CONTRACT_ADDRESS_SET[ChainId.NEAR_TESTNET]
          : '';

      const account = await near.account(fromAccountId);

      const response = await account.functionCall({
        contractId: mcsAccountId,
        methodName: TRANSFER_OUT_NATIVE,
        args: {
          to: toAddress,
          to_chain: toChainId,
        },
        attachedDeposit: amount,
        gas: new BN('100000000000000', 10),
      });

      return response.transaction.hash;
    } catch (error) {
      throw error;
    }
  }
}
