import { ChainId, NEAR_TEST_CHAIN } from '../src/constants';
import { NearAccountState } from '../src/types/responseTypes';
import {
  validateAndParseAddressByChainId,
  verifyNearAccountId,
} from '../src/utils';

describe('Address Validator', () => {

  describe('EVM Address Validator', () => {
    it('should be valid address', async () => {
      const address = '0x9f477490Aac940cE48249D8C455D8f6AE6Dc29c0';
      expect(validateAndParseAddressByChainId(address, ChainId.MAP_TEST)).toBe(
        address
      );
    });
  });
});