import { ethers, Signer } from "ethers";
import MCSRelayABI from "../abis/MAPCrossChainServiceRelayABI.json"
import { validateAndParseAddressAndChainId } from "../utils/validateAndParseAddress";
export class MCSRelay {
    private contract: ethers.Contract;

    constructor(contractAddress: string, provider: ethers.providers.Provider) {
        this.contract = new ethers.Contract(contractAddress, MCSRelayABI, provider);
    }

    async transferOutNative(toAddress: string, toChain: number, amount: string, signer: Signer) {
        // check if address provided is valid, throw error if not
        toAddress = validateAndParseAddressAndChainId(toAddress, toChain);

        const tx = await this.contract.TransferOutNative(
            toAddress,
            toChain,
            signer
        );

        console.log(tx);
    }

    async checkAuthToken(tokenAddress: string) {
        const tx = await this.contract.checkAuthToken(tokenAddress);
        console.log(tx);
    }
    
    
}