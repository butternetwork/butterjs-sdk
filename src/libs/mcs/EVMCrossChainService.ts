import {
  BigNumber,
  Contract,
  ContractInterface,
  ContractTransaction,
  ethers,
  Signer,
} from 'ethers';
import { IMapCrossChainService } from '../interfaces/IMapCrossChainService';
import { ContractCallReceipt } from '../../types/responseTypes';
import { adaptEtherReceipt } from '../../utils/responseUtil';
import BN from 'bn.js';
import { Provider } from '@ethersproject/abstract-provider';

export class EVMCrossChainService implements IMapCrossChainService {
  contract: Contract;

  constructor(
    contractAddress: string,
    abi: ContractInterface,
    signerOrProvider: Signer | Provider
  ) {
    this.contract = new ethers.Contract(contractAddress, abi, signerOrProvider);
  }

  /**
   * transfer out token(not native coin) from source chain to designated token on target chain
   * @param tokenAddress input token address
   * @param amount amount in minimal unit
   * @param toAddress target chain receiving address
   * @param toChainId target chain id
   * @param gasEstimation only estimate gas or not
   */
  async doTransferOutToken(
    tokenAddress: string,
    amount: string,
    toAddress: string,
    toChainId: string,
    gasEstimation: boolean
  ): Promise<ContractCallReceipt | BN> {
    // gas estimation
    if (gasEstimation) {
      const gas: BigNumber = await this.contract.estimateGas.transferOutToken!(
        tokenAddress,
        toAddress,
        amount,
        toChainId
      );
      return new BN(gas.toString(), 10);
    }

    const transferOutTx: ContractTransaction =
      await this.contract.transferOutToken(
        tokenAddress,
        toAddress,
        amount,
        toChainId
      );

    const receipt = await transferOutTx.wait();

    return adaptEtherReceipt(receipt);
  }

  /**
   * transfer out native coin from source chain to designated token on target chain
   * @param toAddress target chain receiving address
   * @param toChainId target chain id
   * @param amount amount to bridge in minimal unit
   * @param gasEstimation gas estimation or not
   */
  async doTransferOutNative(
    toAddress: string,
    toChainId: string,
    amount: string,
    gasEstimation: boolean
  ): Promise<ContractCallReceipt | BN> {
    // gas estimation
    if (gasEstimation) {
      const gas = await this.contract.estimateGas.transferOutNative!(
        toAddress,
        toChainId,
        {
          value: amount,
        }
      );
      return new BN(gas.toString(), 10);
    }
    const transferOutTx: ContractTransaction =
      await this.contract.transferOutNative(toAddress, toChainId, {
        value: amount,
      });

    const receipt = await transferOutTx.wait();
    return adaptEtherReceipt(receipt);
  }

  async doDepositOutToken(
    tokenAddress: string,
    from: string,
    to: string,
    amount: string
  ): Promise<string> {
    const depositOutTx: ContractTransaction =
      await this.contract.depositOutToken(tokenAddress, from, to, amount);

    const receipt = await depositOutTx.wait();
    return receipt.transactionHash;
  }

  async doSetCanBridgeToken(
    tokenAddress: string,
    toChainId: number,
    canBridge: boolean
  ) {
    const tx: ContractTransaction = await this.contract.setCanBridgeToken(
      tokenAddress,
      toChainId,
      canBridge
    );
    const receipt = await tx.wait();
    console.log('successfully set can bridge token on evm');
  }
}
