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
  '34434',
  '0xE1b2b81B66150F9EF5A89dC346a7A8B8df05d847',
  18,
  'lMAP',
  'Wrapped MAP Token',
  ''
);

export const ETH_PRIV_NEAR = new Token(
  '34434',
  '0x152fB50d334a66F7fD8559F6Dad057Ac13b3eD44',
  18,
  'bNear',
  'Wrapped Near Token',
  'https://cryptologos.cc/logos/near-protocol-near-logo.png'
);

export const ETH_PRIV_WETH = new Token(
  '34434',
  '0xB59B98DF47432371A36A8F83fC7fd8371ec1300B',
  18,
  'WETH',
  'Wrapped ETH',
  'https://files.maplabs.io/bridge/eth.png'
);

export const MAP_TEST_METH = new Token(
  '212',
  '0x41358EFc7d49d19F76E1E3bdD694f3bff9af3b36',
  18,
  'METH',
  'MAP ETH',
  'https://files.maplabs.io/bridge/eth.png'
);

export const BSC_TEST_NEAR = new Token(
  ChainId.BSC_TEST,
  '0xa064aA3F10dE46cb114E543A9f8D90770cFb0d7c',
  18,
  'Near',
  'Near',
  'https://cryptologos.cc/logos/near-protocol-near-logo.png'
);

export const BSC_TEST_USDC = new Token(
  ChainId.BSC_TEST,
  '0x223476eCEA662bFcc1258638c917D8860253Ccb0',
  18,
  'USDC',
  'USD Circle',
  'https://files.maplabs.io/bridge/usdc.png'
);

export const NEAR_TEST_USDC = new Token(
  ChainId.NEAR_TESTNET,
  'dev-1668420264923-33906828202995',
  6,
  'USDC',
  'USD Circle',
  'https://files.maplabs.io/bridge/usdc.png'
);

export const NEAR_TEST_MOST = new Token(
  ChainId.NEAR_TESTNET,
  'most.mos2.mfac.maplabs.testnet',
  24,
  'MOST',
  'MOST Token',
  'https://files.maplabs.io/bridge/usdc.png'
);

export const BSC_TEST_MOST = new Token(
  ChainId.BSC_TEST,
  '0x688f3Ef5f728995a9DcB299DAEC849CA2E49ddE1',
  18,
  'MOST',
  'MOST Token',
  'https://files.maplabs.io/bridge/usdc.png'
);

export const MAP_TEST_MOST = new Token(
  ChainId.MAP_TEST,
  '0xc74bc33a95a62D90672aEFAf4bA784285903cf09',
  18,
  'MOST',
  'MOST Token',
  'https://files.maplabs.io/bridge/usdc.png'
);

export const MAP_TEST_WMAP = new Token(
  ChainId.MAP_TEST,
  '0x2eD27dF9B4c903aB53666CcA59AFB431F7D15e91',
  18,
  'wMAP',
  'Wrapped MAP',
  'https://files.maplabs.io/bridge/map.png'
);

export const BSC_TEST_MAP = new Token(
  ChainId.BSC_TEST,
  '0xad4c2B6e113113d345c167F7BdAA5A5D1cD00273',
  18,
  'MAP',
  'BSC MAP',
  'https://files.maplabs.io/bridge/map.png'
);

export const NEAR_TEST_MAP = new Token(
  ChainId.NEAR_TESTNET,
  'map.mos2.mfac.maplabs.testnet',
  24,
  'MAP',
  'NEAR MAP',
  'https://files.maplabs.io/bridge/map.png'
);

export const MAP_TEST_BNB = new Token(
  ChainId.MAP_TEST,
  '0xc0fAa9255A4099D50C2b356bFbD440B69359cEa3',
  18,
  'BNB',
  'MAP BNB',
  'https://files.maplabs.io/bridge/bnb.png'
);

export const BSC_TEST_WBNB = new Token(
  ChainId.BSC_TEST,
  '0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd',
  18,
  'BNB',
  'wBNB',
  'https://files.maplabs.io/bridge/bnb.png'
);

export const NEAR_TEST_WNEAR = new Token(
  ChainId.NEAR_TESTNET,
  'wrap.testnet',
  24,
  'wNear',
  'Wrapped Near',
  'https://cryptologos.cc/logos/near-protocol-near-logo.png'
);

export const MAP_TEST_NEAR = new Token(
  ChainId.MAP_TEST,
  '0x9a5a085F5ffF09e922149426CbF6892F7df1dF79',
  18,
  'NEAR',
  'MAP NEAR',
  'https://cryptologos.cc/logos/near-protocol-near-logo.png'
);
