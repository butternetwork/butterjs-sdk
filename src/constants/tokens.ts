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
export const BSC_TEST_NATIVE = new EVMNativeCoin(
  ChainId.BSC_TEST,
  18,
  'BNB',
  'BNB',
  'https://files.maplabs.io/bridge/bnb.png'
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

export const MAP_TEST_BNB = new Token(
  212,
  '0xF84AB41c8623D91382a030299cE270FFc09360c3',
  18,
  'BNB',
  'MAP BNB',
  'https://files.maplabs.io/bridge/eth.png'
);

export const MAP_TEST_NEAR = new Token(
  212,
  '0x080513434dE30757bc490ad52573CF669FD19EC0',
  18,
  'MNear',
  'MAP Near',
  'https://cryptologos.cc/logos/near-protocol-near-logo.png'
);

export const BSC_TEST_MAP = new Token(
  97,
  '0xad4c2B6e113113d345c167F7BdAA5A5D1cD00273',
  18,
  'MAP',
  'MAP Protocol',
  'https://files.maplabs.io/bridge/map.png'
);

export const BSC_TEST_NEAR = new Token(
  97,
  '0xa064aA3F10dE46cb114E543A9f8D90770cFb0d7c',
  18,
  'Near',
  'Near',
  'https://cryptologos.cc/logos/near-protocol-near-logo.png'
);
