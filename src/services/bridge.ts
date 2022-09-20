import { Signer } from "ethers";
import { ChainId } from "../constants/chains";
import { validateAndParseAddressByChainId } from "../utils";

export class BarterBridge {


    async bridgeToken(
        fromChainId: ChainId,
        toChainId: ChainId,
        toAddress: string,
        amount: string,
        signer: Signer
    ): Promise<string> {
        toAddress = validateAndParseAddressByChainId(toAddress, toChainId);

        return "";
    }
}