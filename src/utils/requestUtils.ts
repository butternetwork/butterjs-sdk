import { ButterCrossChainRoute } from '../types';
import { BaseCurrency } from '../entities';

export async function assembleSwapDataFromRoute(
  route: ButterCrossChainRoute,
  targetChainTokenOut: BaseCurrency
): Promise<string> {
  const encodeAbi = [
    'tuple(uint256, uint256, bytes, uint64)[]',
    'bytes',
    'address',
  ];

  const mapRoute = route.mapRoute;
  const mapTargetTokenAddress = mapRoute[0]!.tokenOut.address;

  let;
  return '';
}
