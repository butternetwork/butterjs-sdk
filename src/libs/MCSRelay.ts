import { ethers, Signer } from 'ethers';
import MCSRelayABI from '../abis/MAPCrossChainServiceRelayABI.json';
import { validateAndParseAddressByChainId } from '../utils/addressValidator';
export class MCSRelay {
  private contract: ethers.Contract;

  constructor(contractAddress: string, provider: ethers.providers.Provider) {
    this.contract = new ethers.Contract(contractAddress, MCSRelayABI, provider);
  }

  async transferOutNative(
    toAddress: string,
    toChain: number,
    amount: string,
    signer: Signer
  ) {
    // check toAddress validity
    toAddress = validateAndParseAddressByChainId(toAddress, toChain);

    const transferOutTx = await this.contract.TransferOutNative(
      toAddress,
      toChain,
      signer
    );

    console.log(transferOutTx);
  }

  async checkAuthToken(tokenAddress: string) {
    const tx = await this.contract.checkAuthToken(tokenAddress);
    console.log(tx);
  }
}
