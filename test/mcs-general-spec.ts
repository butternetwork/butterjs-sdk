import { BSC_TEST_CHAIN, ChainId, NEAR_TEST_CHAIN } from '../src/constants';
import { createMOSInstance } from '../src/libs/utils/mosUtils';
import { ethers } from 'ethers';

const evmProvider = new ethers.providers.JsonRpcProvider(
  BSC_TEST_CHAIN.rpc,
  Number.parseInt(BSC_TEST_CHAIN.chainId)
);

describe('MOS Generation', () => {
  beforeAll(() => {});
  test('evm bootstrap with no config', () => {
    expect(
      createMOSInstance(ChainId.BSC_TEST, { signerOrProvider: evmProvider })
    ).toBeDefined();
  });
  test('relay bootstrap with no config', () => {
    expect(
      createMOSInstance(ChainId.MAP_TEST, { signerOrProvider: evmProvider })
    ).toBeDefined();
  });
});
