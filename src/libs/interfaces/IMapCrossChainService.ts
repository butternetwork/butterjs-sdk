import { ContractTransaction, ethers } from 'ethers';
import MCSRelayABI from '../../abis/MAPCrossChainServiceRelayABI.json';
import MCSEVMABI from '../../abis/MAPCrossChainServiceABI.json';

export abstract class IMapCrossChainService {
  protected contract: ethers.Contract;

  constructor(contractAddress: string, signer: ethers.Signer) {
    this.contract = new ethers.Contract(contractAddress, MCSRelayABI, signer);
  }

  public abstract doTransferOutToken(
    tokenAddress: string,
    amount: string,
    toAddress: string,
    toChain: string
  ): Promise<void>;

  public abstract doTransferOutNative(
    toAddress: string,
    toChain: string,
    amount: string
  ): Promise<void>;

  public abstract doDepositOutToken(
    tokenAddress: string,
    from: string,
    to: string,
    amount: string
  ): Promise<void>;
}
