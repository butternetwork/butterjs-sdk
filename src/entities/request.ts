import { Signer } from "ethers"

export type MCSRelayTransferOutArgs = {
    toAddress: string,
    toChainId: number,
    signer: Signer
}