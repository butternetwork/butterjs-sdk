import { Token } from '../entities';
import { NativeCurrency } from '../entities/NativeCurrency';
import { NearNativeCoin } from '../entities/native/Near';
import { ChainId } from './chains';

export const ETH_PRIV_NATIVE = new Token(
  34434,
  '0x0000000000000000000000000000000000000000',
  18
);

export const ETH_PRIV_LMAP = new Token(
  34434,
  '0xE1b2b81B66150F9EF5A89dC346a7A8B8df05d847',
  18
);

export const ETH_PRIV_WETH = new Token(
  34434,
  '0xB59B98DF47432371A36A8F83fC7fd8371ec1300B',
  18
);

export const MAP_TEST_NATIVE = new Token(
  212,
  '0x0000000000000000000000000000000000000000',
  18
);

export const MAP_TEST_WMAP = new Token(
  212,
  '0x13CB04d4a5Dfb6398Fc5AB005a6c84337256eE23',
  18
);

export const MAP_TEST_METH = new Token(
  212,
  '0x01c2B4b094D3FC213BF13C6603Edd95187dF5C9D',
  18
);

export const MAP_TEST_NEAR = new Token(
  212,
  '0xAC35D87EfcA068c9dcEf65f89937B7593fA03d37',
  18
);

export const NEAR_TEST_NATIVE = new NearNativeCoin(ChainId.NEAR_TESTNET);
