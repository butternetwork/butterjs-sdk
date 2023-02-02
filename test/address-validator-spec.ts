import { ChainId, NEAR_TEST_CHAIN } from '../src/constants';
import { NearAccountState } from '../src/types/responseTypes';
import {
  validateAndParseAddressByChainId,
  verifyNearAccountId,
} from '../src/utils';

describe('Address Validator', () => {
  describe('Near Address Validator', () => {
    it('should be invalid account', async () => {
      const nearAccountState: NearAccountState = await verifyNearAccountId(
        'Xyli.testnet',
        NEAR_TEST_CHAIN.chainId
      );
      expect(nearAccountState.isValid).toBe(false);
    });

    it('should be valid account', async () => {
      const nearAccountState: NearAccountState = await verifyNearAccountId(
        'xyli.testnet',
        NEAR_TEST_CHAIN.chainId
      );
      expect(nearAccountState.isValid).toBe(true);
    });
  });
  describe('EVM Address Validator', () => {
    // it('should be invalid address', () => {
    //   expect(
    //     validateAndParseAddressByChainId('0x00', ChainId.MAP_TEST)
    //   ).toThrow(Error);
    // });
    

    it('should be valid address', async () => {
      const address = '0x9f477490Aac940cE48249D8C455D8f6AE6Dc29c0';
      expect(validateAndParseAddressByChainId(address, ChainId.MAP_TEST)).toBe(
        address
      );
    });
  });
});
