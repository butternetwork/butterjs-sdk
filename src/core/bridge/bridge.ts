import { ethers, Signer } from 'ethers';
import { ChainId, ID_TO_CHAIN_ID } from '../../constants/chains';
import { validateAndParseAddressByChainId } from '../../utils';
import { BridgeRequestParam } from '../../types/requestTypes';
import { MCSEVM } from '../../libs/MCSEVM';
import { MCSRelay } from '../../libs/MCSRelay';
import { MCSContractAddresses } from '../../constants/addresses';
import { ContractReceipt } from '@ethersproject/contracts/src.ts';

export class BarterBridge {
  async bridgeToken({
    token,
    toChainId,
    toAddress,
    amount,
    signer,
  }: BridgeRequestParam): Promise<string> {
    // check validity of toAddress according to toChainId

    toAddress = validateAndParseAddressByChainId(toAddress, toChainId);
    const chainId = await signer.getChainId();
    const mcsContractAddress: string =
      MCSContractAddresses[ID_TO_CHAIN_ID(chainId)];

    const mcsRelay: MCSRelay = new MCSRelay(mcsContractAddress, signer);

    const receipt: ContractReceipt = await mcsRelay.transferOutNative(
      toAddress,
      toChainId,
      amount
    );
    return receipt.transactionHash;
  }
}
