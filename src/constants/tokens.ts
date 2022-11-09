import { Token } from '../entities/Token';
import { NearNativeCoin } from '../entities/native/Near';
import { ChainId } from './chains';
import { EVMNativeCoin } from '../entities/native/EVMNativeCoin';

export const ETH_PRIV_NATIVE = new EVMNativeCoin(
  ChainId.ETH_PRIV,
  18,
  'ETH',
  'ether',
  'https://files.maplabs.io/bridge/eth.png'
);
export const MAP_TEST_NATIVE = new EVMNativeCoin(
  ChainId.MAP_TEST,
  18,
  'MAP',
  'MAP Protocol',
  'https://files.maplabs.io/bridge/map.png'
);
export const NEAR_TEST_NATIVE = new NearNativeCoin(ChainId.NEAR_TESTNET);

export const ETH_PRIV_LMAP = new Token(
  34434,
  '0xE1b2b81B66150F9EF5A89dC346a7A8B8df05d847',
  18,
  'lMAP',
  'Wrapped MAP Token',
  ''
);

export const ETH_PRIV_NEAR = new Token(
  34434,
  '0x152fB50d334a66F7fD8559F6Dad057Ac13b3eD44',
  18,
  'bNear',
  'Wrapped Near Token',
  'https://cryptologos.cc/logos/near-protocol-near-logo.png'
);

export const ETH_PRIV_WETH = new Token(
  34434,
  '0xB59B98DF47432371A36A8F83fC7fd8371ec1300B',
  18,
  'WETH',
  'Wrapped ETH',
  'https://files.maplabs.io/bridge/eth.png'
);

export const MAP_TEST_WMAP = new Token(
  212,
  '0x13CB04d4a5Dfb6398Fc5AB005a6c84337256eE23',
  18,
  'WMAP',
  'Wrapped MAP',
  'https://files.maplabs.io/bridge/map.png'
);

export const MAP_TEST_METH = new Token(
  212,
  '0x41358EFc7d49d19F76E1E3bdD694f3bff9af3b36',
  18,
  'METH',
  'MAP ETH',
  'https://files.maplabs.io/bridge/eth.png'
);

export const MAP_TEST_NEAR = new Token(
  212,
  '0x9C1A0718e61C1dD802cb7F5290Eb22E83FC578aC',
  18,
  'MNear',
  'MAP Near',
  'https://cryptologos.cc/logos/near-protocol-near-logo.png'
);
