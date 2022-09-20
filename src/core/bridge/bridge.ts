import { Signer } from 'ethers';
import { ChainId } from '../../constants/chains';
import { validateAndParseAddressByChainId } from '../../utils';
import { BridgeRequestParam } from '../../types/requestTypes';

export class BarterBridge {
  async bridgeToken({
    token,
    fromChainId,
    toChainId,
    toAddress,
    amount,
    signer,
  }: BridgeRequestParam): Promise<string> {
    // check validity of toAddress according to toChainId
    toAddress = validateAndParseAddressByChainId(toAddress, toChainId);

    return '';
  }
}
