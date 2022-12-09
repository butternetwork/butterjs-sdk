import { Token } from '../entities/Token';
import { NearNativeCoin } from '../entities/native/Near';
import { ChainId } from './chains';
import { EVMNativeCoin } from '../entities/native/EVMNativeCoin';

/************************* mainnet tokens *************************/
export const BSC_MAINNET_NATIVE = new EVMNativeCoin(
  ChainId.BSC_MAINNET,
  18,
  'BNB',
  'BNB',
  'https://files.maplabs.io/bridge/bnb.png'
);
export const MAP_MAINNET_NATIVE = new EVMNativeCoin(
  ChainId.MAP_MAINNET,
  18,
  'MAPO',
  'MAP Protocol',
  'https://files.maplabs.io/bridge/map.png'
);
export const POLYGON_MAINNET_NATIVE = new EVMNativeCoin(
  ChainId.POLYGON_MAINNET,
  18,
  'MAPO',
  'MAP Protocol',
  'https://files.maplabs.io/bridge/map.png'
);

export const NEAR_MAINNET_NATIVE = new NearNativeCoin(ChainId.NEAR_MAINNET);

export const MAP_MAINNET_WMAP = new Token(
  ChainId.MAP_MAINNET,
  '0x13CB04d4a5Dfb6398Fc5AB005a6c84337256eE23',
  18,
  'wMAPO',
  'Wrapped MAPO',
  'https://files.maplabs.io/bridge/map.png'
);

export const BSC_MAINNET_WBNB = new Token(
  ChainId.BSC_MAINNET,
  '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
  18,
  'WBNB',
  'Wrapped BNB',
  'https://files.maplabs.io/bridge/bnb.png'
);

export const NEAR_MAINNET_WNEAR = new Token(
  ChainId.NEAR_MAINNET,
  'wrap.near',
  24,
  'wNear',
  'Wrapped Near',
  'https://cryptologos.cc/logos/near-protocol-near-logo.png'
);

export const POLYGON_MAINNET_WMATIC = new Token(
  ChainId.POLYGON_MAINNET,
  '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270',
  18,
  'WMATIC',
  'Wrapped Matic'
);
export const MAP_MAINNET_USDC = new Token(
  ChainId.MAP_MAINNET,
  '0x9f722b2cb30093f766221fd0d37964949ed66918',
  18,
  'USDC',
  'MAP USDC',
  'https://files.maplabs.io/bridge/usdc.png'
);

export const BSC_MAINNET_USDC = new Token(
  ChainId.BSC_MAINNET,
  '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d',
  18,
  'USDC',
  'Binance-Peg USD Coin',
  'https://files.maplabs.io/bridge/usdc.png'
);

export const POLYGON_MAINNET_USDC = new Token(
  ChainId.POLYGON_MAINNET,
  '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
  6,
  'USDC',
  'USD Circle',
  'https://files.maplabs.io/bridge/usdc.png'
);

export const NEAR_MAINNET_USDC = new Token(
  ChainId.NEAR_MAINNET,
  'a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.factory.bridge.near',
  6,
  'USDC',
  'USD Circle',
  'https://files.maplabs.io/bridge/usdc.png'
);

/************************* testnet tokens *************************/

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
  'MAPO',
  'MAP Protocol',
  'https://files.maplabs.io/bridge/map.png'
);

export const MATIC_TEST_NATIVE = new EVMNativeCoin(
  ChainId.POLYGON_TEST,
  18,
  'MATIC',
  'Polygon',
  'https://files.maplabs.io/bridge/polygon.png'
);

export const NEAR_TEST_NATIVE = new NearNativeCoin(ChainId.NEAR_TESTNET);

export const ETH_PRIV_LMAP = new Token(
  ChainId.ETH_PRIV,
  '0xE1b2b81B66150F9EF5A89dC346a7A8B8df05d847',
  18,
  'lMAP',
  'Wrapped MAP Token',
  ''
);

export const ETH_PRIV_NEAR = new Token(
  ChainId.ETH_PRIV,
  '0x152fB50d334a66F7fD8559F6Dad057Ac13b3eD44',
  18,
  'bNear',
  'Wrapped Near Token',
  'https://cryptologos.cc/logos/near-protocol-near-logo.png'
);

export const ETH_PRIV_WETH = new Token(
  ChainId.ETH_PRIV,
  '0xB59B98DF47432371A36A8F83fC7fd8371ec1300B',
  18,
  'WETH',
  'Wrapped ETH',
  'https://files.maplabs.io/bridge/eth.png'
);

export const MAP_TEST_METH = new Token(
  ChainId.MAP_TEST,
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
  'wMAPO',
  'Wrapped MAPO',
  'https://files.maplabs.io/bridge/map.png'
);

export const BSC_TEST_MAP = new Token(
  ChainId.BSC_TEST,
  '0xad4c2B6e113113d345c167F7BdAA5A5D1cD00273',
  18,
  'MAPO',
  'BSC MAPO',
  'https://files.maplabs.io/bridge/map.png'
);

export const NEAR_TEST_MAP = new Token(
  ChainId.NEAR_TESTNET,
  'mapo.maplabs.testnet',
  24,
  'MAPO',
  'NEAR MAPO',
  'https://files.maplabs.io/bridge/map.png'
);

export const MAP_TEST_BNB = new Token(
  ChainId.MAP_TEST,
  '0xc0fAa9255A4099D50C2b356bFbD440B69359cEa3',
  18,
  'BNB',
  'MAPO BNB',
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
  'MAPO NEAR',
  'https://cryptologos.cc/logos/near-protocol-near-logo.png'
);

export const MATIC_TEST_MOST = new Token(
  ChainId.POLYGON_TEST,
  '0x6d4570191C7B5835226a0bE18734A8E922ff353B',
  18,
  'MOST',
  'MAP Omnichain Service Token',
  'https://files.maplabs.io/bridge/usdc.png'
);

export const MATIC_TEST_MAP = new Token(
  ChainId.POLYGON_TEST,
  '0xE6687528C7b85115a038D806339dd7E7b869B87C',
  18,
  'MAPO',
  'Matic-Pegged MAPO',
  'https://files.maplabs.io/bridge/map.png'
);

export const MATIC_TEST_WMATIC = new Token(
  ChainId.POLYGON_TEST,
  '0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889',
  18,
  'WMATIC',
  'Wrapped Matic',
  'https://files.maplabs.io/bridge/polygon.png'
);
