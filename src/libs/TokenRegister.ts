import { BigNumber, ethers, Signer } from "ethers";
import TokenRegisterAbi from "../abis/TokenRegister.json"

export class TokenRegister {
    private contract: ethers.Contract;

    constructor(contractAddress: string, signer: Signer) {
        this.contract = new ethers.Contract(contractAddress, TokenRegisterAbi, signer);
    }

    async registerToken(sourceChain: number, sourceMapToken: string, mapToken: string) {
        const tx = await this.contract.regToken(sourceChain, sourceMapToken, mapToken);
        console.log(tx);
    }

    async getTargetToken(sourceChain: number, sourceToken: string, targetChain: number): Promise<string> {
        const tokenAddress: string = await this.contract.getTargetToken(sourceChain, sourceToken, targetChain);
        return tokenAddress;
    }
    
    
}