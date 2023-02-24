import { Token } from '../beans';
import { ChainId } from './chains';
import { EVMCoin,NEARCoin } from '../beans';

/************************* mainnet  *************************/
/** map **/
export const MAP_MAINNET_NATIVE = new EVMCoin(
  ChainId.MAP_MAINNET,
  18,
  'MAPO',
  'MAP Protocol',
  'https://files.maplabs.io/bridge/map.png'
);

export const MAP_MAINNET_WMAP = new Token(
    ChainId.MAP_MAINNET,
    18,
    '0x13CB04d4a5Dfb6398Fc5AB005a6c84337256eE23',
    'wMAPO',
    'Wrapped MAPO',
    'https://files.maplabs.io/bridge/map.png'
);

/** bsc **/
export const BSC_MAINNET_NATIVE = new EVMCoin(
  ChainId.BSC_MAINNET,
  18,
  'BNB',
  'BNB',
  'https://files.maplabs.io/bridge/bnb.png'
);

export const BSC_MAINNET_WBNB = new Token(
  ChainId.BSC_MAINNET,
  18,
    '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',

    'WBNB',
  'Wrapped BNB',
  'https://files.maplabs.io/bridge/bnb.png'
);

export const BSC_MAINNET_USDC = new Token(
  ChainId.BSC_MAINNET,
  18,
    '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d',

    'USDC',
  'Binance-Peg USD Coin',
  'https://files.maplabs.io/bridge/usdc.png'
);

/** polygon **/
export const POLYGON_MAINNET_NATIVE = new EVMCoin(
  ChainId.POLYGON_MAINNET,
  18,
  'MAPO',
  'MAP Protocol',
  'https://files.maplabs.io/bridge/map.png'
);

export const POLYGON_MAINNET_WMATIC = new Token(
  ChainId.POLYGON_MAINNET,
  18,
    '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270',

    'WMATIC',
  'Wrapped Matic'
);
export const MAP_MAINNET_USDC = new Token(
  ChainId.MAP_MAINNET,
  18,
    '0x424D3bcdC96F42aC919F276D7D4f6C94f24e0703',

    'USDC',
  'MAP USDC',
  'https://files.maplabs.io/bridge/usdc.png'
);

export const POLYGON_MAINNET_USDC = new Token(
  ChainId.POLYGON_MAINNET,
  6,
    '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',

    'USDC',
  'USD Circle',
  'https://files.maplabs.io/bridge/usdc.png'
);

/** near **/
export const NEAR_MAINNET_NATIVE = new NEARCoin(ChainId.NEAR_MAINNET);

export const NEAR_MAINNET_WNEAR = new Token(
  ChainId.NEAR_MAINNET,
  24,
    'wrap.near',

    'wNear',
  'Wrapped Near',
  'https://s3-us-west-1.amazonaws.com/compliance-ico-af-us-west-1/production/token_profiles/logos/original/9d5/c43/cc-/9d5c43cc-e232-4267-aa8a-8c654a55db2d-1608222929-b90bbe4696613e2faeb17d48ac3aa7ba6a83674a.png'
);

export const NEAR_MAINNET_USDC = new Token(
  ChainId.NEAR_MAINNET,
  6,
    'a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.factory.bridge.near',

    'USDC',
  'USD Circle',
  'https://files.maplabs.io/bridge/usdc.png'
);

/************************* testnet tokens *************************/
/** map test **/
export const MAP_TEST_NATIVE = new EVMCoin(
  ChainId.MAP_TEST,
  18,
  'MAPO',
  'MAP Protocol',
  'https://files.maplabs.io/bridge/map.png'
);

export const MAP_TEST_METH = new Token(
  ChainId.MAP_TEST,
  18,
    '0x41358EFc7d49d19F76E1E3bdD694f3bff9af3b36',

    'METH',
  'MAP ETH',
  'https://files.maplabs.io/bridge/eth.png'
);

export const MAP_TEST_MOST = new Token(
  ChainId.MAP_TEST,
  18,
    '0xc74bc33a95a62D90672aEFAf4bA784285903cf09',

    'MOST',
  'MOST Token',
  'https://files.maplabs.io/bridge/usdc.png'
);

export const MAP_TEST_WMAP = new Token(
  ChainId.MAP_TEST,
  18,
    '0x2eD27dF9B4c903aB53666CcA59AFB431F7D15e91',

    'wMAPO',
  'Wrapped MAPO',
  'https://files.maplabs.io/bridge/map.png'
);

export const MAP_TEST_NEAR = new Token(
  ChainId.MAP_TEST,
  18,
    '0xf1b33B4aB498e17C82bA903e5256533cBf51e1Fd',

    'Butter Near',
  'bNear',
  'https://s3-us-west-1.amazonaws.com/compliance-ico-af-us-west-1/production/token_profiles/logos/original/9d5/c43/cc-/9d5c43cc-e232-4267-aa8a-8c654a55db2d-1608222929-b90bbe4696613e2faeb17d48ac3aa7ba6a83674a.png'
);

export const MAP_TEST_USDC = new Token(
  ChainId.MAP_TEST,
  18,
    '0xd28c1187168dA9df1B7f6cb8495e659322D27c9F',

    'USDC',
  'USDC Circle',
  'https://files.maplabs.io/bridge/usdc.png'
);

export const MAP_TEST_BNB = new Token(
  ChainId.MAP_TEST,
  18,
    '0xc0fAa9255A4099D50C2b356bFbD440B69359cEa3',

    'BNB',
  'MAPO BNB',
  'https://files.maplabs.io/bridge/bnb.png'
);
/** eth goerli **/
export const ETH_GOERLI_NATIVE = new EVMCoin(
  ChainId.ETH_GOERLI,
  18,
  'ETH',
  'Ether',
  'https://files.maplabs.io/bridge/eth.png'
);

export const ETH_GOERLI_WETH = new Token(
  ChainId.ETH_GOERLI,
  18,
    '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6',

    'wETH',
  'Wrapped Ether',
  'https://files.maplabs.io/bridge/eth.png'
);

export const ETH_GOERLI_USDC = new Token(
  ChainId.ETH_GOERLI,
  18,
    '0xE66D4a30d177369d134e0E49a9096D357C0e8383',

    'bUSDC',
  'Butter USDC',
  'https://files.maplabs.io/bridge/usdc.png'
);

/** bsc test **/
export const BSC_TEST_NATIVE = new EVMCoin(
  ChainId.BSC_TEST,
  18,
  'BNB',
  'BNB',
  'https://files.maplabs.io/bridge/bnb.png'
);

export const BSC_TEST_USDC = new Token(
  ChainId.BSC_TEST,
  18,
    '0xd8f69e1F100Db655d4503545C3BB308CAab4a3B6',

    'bUSDC',
  'Butter USDC',
  'https://files.maplabs.io/bridge/usdc.png'
);

export const BSC_TEST_BMOS = new Token(
  ChainId.BSC_TEST,
  18,
    '0x593F6F6748dc203DFa636c299EeA6a39C0734EEd',

    'BMOS',
  'Butter MOST',
  'https://logos-world.net/imageup/Bitcoin/Bitcoin-Logo-PNG14.png'
);

export const BSC_TEST_NEAR = new Token(
  ChainId.BSC_TEST,
  18,
    '0xa064aA3F10dE46cb114E543A9f8D90770cFb0d7c',

    'Near',
  'Near',
  'https://s3-us-west-1.amazonaws.com/compliance-ico-af-us-west-1/production/token_profiles/logos/original/9d5/c43/cc-/9d5c43cc-e232-4267-aa8a-8c654a55db2d-1608222929-b90bbe4696613e2faeb17d48ac3aa7ba6a83674a.png'
);

export const BSC_TEST_MOST = new Token(
  ChainId.BSC_TEST,
  18,
    '0x688f3Ef5f728995a9DcB299DAEC849CA2E49ddE1',

    'MOST',
  'MOST Token',
  'https://files.maplabs.io/bridge/usdc.png'
);

export const BSC_TEST_MAP = new Token(
  ChainId.BSC_TEST,
  18,
    '0xad4c2B6e113113d345c167F7BdAA5A5D1cD00273',

    'MAPO',
  'BSC MAPO',
  'https://files.maplabs.io/bridge/map.png'
);

export const BSC_TEST_WBNB = new Token(
  ChainId.BSC_TEST,
  18,
    '0xae13d989dac2f0debff460ac112a837c89baa7cd',

    'BNB',
  'wBNB',
  'https://files.maplabs.io/bridge/bnb.png'
);

/** polygon test **/
export const POLYGON_TEST_NATIVE = new EVMCoin(
  ChainId.POLYGON_TEST,
  18,
  'MATIC',
  'Polygon',
  'https://files.maplabs.io/bridge/polygon.png'
);

export const POLYGON_TEST_USDC = new Token(
  ChainId.POLYGON_TEST,
  18,
    '0xd8f69e1F100Db655d4503545C3BB308CAab4a3B6',

    'bUSDC',
  'Butter USDC',
  'https://files.maplabs.io/bridge/usdc.png'
);

export const POLYGON_TEST_BMOS = new Token(
  ChainId.POLYGON_TEST,
  18,
    '0xe1D8eAB4e616156E11e1c59D1a0E0EFeD66f4cfa',

    'BMOS',
  'Butter MOST',
  'https://logos-world.net/imageup/Bitcoin/Bitcoin-Logo-PNG14.png'
);

export const POLYGON_TEST_MOST = new Token(
  ChainId.POLYGON_TEST,
  18,
    '0x6d4570191C7B5835226a0bE18734A8E922ff353B',

    'MOST',
  'MAP Omnichain Service Token',
  'https://files.maplabs.io/bridge/usdc.png'
);

export const POLYGON_TEST_MAP = new Token(
  ChainId.POLYGON_TEST,
  18,
    '0xE6687528C7b85115a038D806339dd7E7b869B87C',

    'MAPO',
  'Matic-Pegged MAPO',
  'https://files.maplabs.io/bridge/map.png'
);

export const POLYGON_TEST_WMATIC = new Token(
  ChainId.POLYGON_TEST,
  18,
    '0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889',

    'WMATIC',
  'Wrapped Matic',
  'https://files.maplabs.io/bridge/polygon.png'
);

/** near test **/
export const NEAR_TEST_NATIVE = new NEARCoin(ChainId.NEAR_TESTNET);

export const NEAR_TEST_USDC = new Token(
  ChainId.NEAR_TESTNET,
  6,
    'usdc.map007.testnet',

    'USDC',
  'USD Circle',
  'https://files.maplabs.io/bridge/usdc.png'
);

export const NEAR_TEST_MOST = new Token(
  ChainId.NEAR_TESTNET,
  24,
    'most.mos2.mfac.maplabs.testnet',

    'MOST',
  'MOST Token',
  'https://files.maplabs.io/bridge/usdc.png'
);

export const NEAR_TEST_MAP = new Token(
  ChainId.NEAR_TESTNET,
  24,
    'mapo.maplabs.testnet',

    'MAPO',
  'NEAR MAPO',
  'https://files.maplabs.io/bridge/map.png'
);

export const NEAR_TEST_WNEAR = new Token(
  ChainId.NEAR_TESTNET,
  24,
    'wrap.testnet',

    'wNear',
  'Wrapped Near',
  'https://s3-us-west-1.amazonaws.com/compliance-ico-af-us-west-1/production/token_profiles/logos/original/9d5/c43/cc-/9d5c43cc-e232-4267-aa8a-8c654a55db2d-1608222929-b90bbe4696613e2faeb17d48ac3aa7ba6a83674a.png'
);

/** eth priv **/
export const ETH_PRIV_NATIVE = new EVMCoin(
  ChainId.ETH_PRIV,
  18,
  'ETH',
  'ether',
  'https://files.maplabs.io/bridge/eth.png'
);

export const ETH_PRIV_WETH = new Token(
  ChainId.ETH_PRIV,
  18,
    '0xB59B98DF47432371A36A8F83fC7fd8371ec1300B',

    'WETH',
  'Wrapped ETH',
  'https://files.maplabs.io/bridge/eth.png'
);

export const ETH_PRIV_LMAP = new Token(
  ChainId.ETH_PRIV,
  18,
    '0xE1b2b81B66150F9EF5A89dC346a7A8B8df05d847',

    'lMAP',
  'Wrapped MAP Token',
  ''
);

export const ETH_PRIV_NEAR = new Token(
  ChainId.ETH_PRIV,
  18,
    '0x152fB50d334a66F7fD8559F6Dad057Ac13b3eD44',

    'bNear',
  'Wrapped Near Token',
  'https://s3-us-west-1.amazonaws.com/compliance-ico-af-us-west-1/production/token_profiles/logos/original/9d5/c43/cc-/9d5c43cc-e232-4267-aa8a-8c654a55db2d-1608222929-b90bbe4696613e2faeb17d48ac3aa7ba6a83674a.png'
);
