import { ethers, Signer } from 'ethers';
import { ChainId, ID_TO_CHAIN_ID, IS_MAP } from '../../constants/chains';
import { validateAndParseAddressByChainId } from '../../utils';
import { BridgeRequestParam } from '../../types/requestTypes';
import { EVMCrossChainService } from '../../libs/EVMCrossChainService';
import { MCSContractAddresses } from '../../constants/addresses';
import { ContractReceipt } from '@ethersproject/contracts/src.ts';
import { IMapCrossChainService } from '../../libs/interfaces/IMapCrossChainService';
import MCS_EVM_ABI from '../../abis/MAPCrossChainServiceABI.json';
import MCS_MAP_ABI from '../../abis/MAPCrossChainServiceRelayABI.json';

export class BarterBridge {
  async bridgeToken({
    token,
    toChainId,
    toAddress,
    amount,
    signer,
  }: BridgeRequestParam): Promise<void> {
    // check validity of toAddress according to toChainId
    toAddress = validateAndParseAddressByChainId(toAddress, toChainId);

    const chainId = await signer.getChainId();
    const mcsContractAddress: string =
      MCSContractAddresses[ID_TO_CHAIN_ID(chainId)];

    const mcs: IMapCrossChainService = new EVMCrossChainService(
      mcsContractAddress,
      IS_MAP(chainId) ? MCS_MAP_ABI : MCS_EVM_ABI,
      signer
    );
    if (token != undefined) {
      await mcs.doTransferOutToken(
        token.address,
        amount,
        toAddress,
        toChainId.toString()
      );
    } else {
      await mcs.doTransferOutNative(toAddress, toChainId.toString(), amount);
    }
  }
}
