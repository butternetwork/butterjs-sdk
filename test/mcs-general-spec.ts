import { BSC_TEST_CHAIN, ChainId, NEAR_TEST_CHAIN } from '../src/constants';
import { createMCSInstance } from '../src/libs/utils/mcsUtils';
import { ethers } from 'ethers';

const evmProvider = new ethers.providers.JsonRpcProvider(
  BSC_TEST_CHAIN.rpc,
  Number.parseInt(BSC_TEST_CHAIN.chainId)
);

describe('MOS Generation', () => {
  beforeAll(() => {});
  test('evm bootstrap with no config', () => {
    expect(
      createMCSInstance(ChainId.BSC_TEST, { signerOrProvider: evmProvider })
    ).toBeDefined();
  });
  test('relay bootstrap with no config', () => {
    expect(
      createMCSInstance(ChainId.MAP_TEST, { signerOrProvider: evmProvider })
    ).toBeDefined();
  });
});
