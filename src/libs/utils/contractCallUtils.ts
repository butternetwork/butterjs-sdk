import { BarterContractCallReceipt } from '../../types/responseTypes';

export function callContract(
  contractAddress: string,
  args: {},
  methodName: string
): string {
  switch (methodName) {
    case 'transferOutToken':
    case 'asdf':

    default:
      throw new Error(`unknown method ${methodName}`);
  }
}
