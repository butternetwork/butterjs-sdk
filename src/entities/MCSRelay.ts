import { ethers } from "ethers";
import MCSRelayABI from "../constants/abis/MAPCrossChainServiceRelayABI.json"

export class MCSRelay {
    private contract: ethers.Contract;
    private provider: ethers.providers.Provider;

    constructor(contractAddress: string, provider: ethers.providers.Provider) {
        this.provider = provider;
        this.contract = new ethers.Contract(contractAddress, MCSRelayABI, provider);
    }

    async transferOutNative(toAddress: string, toChain: string, amount: string) {
        const tx = await this.contract.TransferOutNative(
            toAddress,
            toChain
        );

        return tx;
    }
    
    
}