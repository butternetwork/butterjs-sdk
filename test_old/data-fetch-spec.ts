import { ButterJsonRpcProvider } from '../src/types/paramTypes';
import { ChainId, MAP_TEST_CHAIN, MAP_TEST_NATIVE } from '../src/constants';
import { getBridgeFee, getVaultBalance } from '../src/core/tools/dataFetch';
import { ButterFee, VaultBalance } from '../src/types/responseTypes';
import { ethers } from 'ethers';

const mapRpcProvider: ButterJsonRpcProvider = {
  url: MAP_TEST_CHAIN.rpc,
  chainId: Number.parseInt(MAP_TEST_CHAIN.chainId),
};

describe('Fetch Data', () => {
  describe('Fee', () => {
    let fee: ButterFee;
    beforeAll(async () => {
      fee = await getBridgeFee(
        MAP_TEST_NATIVE,
        ChainId.BSC_TEST,
        ethers.utils.parseEther('1').toString(),
        mapRpcProvider
      );
    });
    it('fee base currency should be input token', () => {
      expect(fee.feeToken).toBe(MAP_TEST_NATIVE);
    });
    it('fee amount should not be empty', () => {
      expect(fee.amount).not.toBe('');
    });
    it('fee rate should not be null', () => {
      expect(fee.feeRate).not.toBeNull();
    });
  });

  describe('Vault Balance', () => {
    let vaultBalance: VaultBalance;
    beforeAll(async () => {
      vaultBalance = await getVaultBalance(
        ChainId.MAP_TEST,
        MAP_TEST_NATIVE,
        ChainId.BSC_TEST,
        mapRpcProvider
      );
    });
    it('vault balance base token should be target chain token', () => {
      expect(vaultBalance.token.chainId).toBe(ChainId.BSC_TEST);
    });
  });
});
