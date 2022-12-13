import { Chain } from '../entities/Chain';
import { MAP_TEST_NATIVE } from './tokens';

/** Chain Id for supported Chain */
export enum ChainId {
  MAP_MAINNET = '22776',
  BSC_MAINNET = '56',
  POLYGON_MAINNET = '137',
  NEAR_MAINNET = '5566818579631833088',

  MAP_TEST = '212',
  ETH_PRIV = '34434',
  BSC_TEST = '97',
  POLYGON_TEST = '80001',
  NEAR_TESTNET = '5566818579631833089',
}

/** ID to JSON RPC URL */
export const ID_TO_DEFAULT_RPC_URL = (id: string): string => {
  switch (id) {
    // mainnet
    case ChainId.MAP_MAINNET:
      return MAP_MAINNET_CHAIN.rpc!;
    case ChainId.BSC_MAINNET:
      return BSC_MAINNET_CHAIN.rpc!;
    case ChainId.POLYGON_MAINNET:
      return POLYGON_MAINNET_CHAIN.rpc!;
    case ChainId.NEAR_MAINNET:
      return NEAR_MAINNET_CHAIN.rpc!;
    // testnet
    case ChainId.MAP_TEST:
      return MAP_TEST_CHAIN.rpc!;
    case ChainId.BSC_TEST:
      return BSC_TEST_CHAIN.rpc!;
    case ChainId.POLYGON_TEST:
      return POLYGON_TEST_CHAIN.rpc!;
    case ChainId.ETH_PRIV:
      return ETH_PRIV_CHAIN.rpc!;
    case ChainId.NEAR_TESTNET:
      return NEAR_TEST_CHAIN.rpc!;
    default:
      throw new Error(`Unknown chain id: ${id}`);
  }
};
export const MAP_MAINNET_CHAIN = new Chain(
  ChainId.MAP_MAINNET,
  'MAP Mainnet',
  'https://poc3-rpc.maplabs.io/',
  'https://makalu.mapscan.io/',
  'https://files.maplabs.io/bridge/map.png',
  'MAP'
);

export const BSC_MAINNET_CHAIN = new Chain(
  ChainId.BSC_MAINNET,
  'BSC Mainnet',
  'https://bsc-dataseed1.defibit.io/',
  'https://bscscan.com/',
  'https://files.maplabs.io/bridge/bsc.png',
  'BSC'
);

export const POLYGON_MAINNET_CHAIN = new Chain(
  ChainId.POLYGON_MAINNET,
  'Polygon Mainnet',
  'https://polygon-rpc.com/',
  'https://polygonscan.com/',
  'https://files.maplabs.io/bridge/polygon.png',
  'MATIC'
);

export const NEAR_MAINNET_CHAIN = new Chain(
  ChainId.NEAR_MAINNET,
  'Near Mainnet',
  'https://rpc.mainnet.near.org',
  'https://explorer.near.org/',
  'https://cryptologos.cc/logos/near-protocol-near-logo.png',
  'NEAR'
);

export const MAP_TEST_CHAIN = new Chain(
  ChainId.MAP_TEST,
  'MAP Testnet',
  'https://testnet-rpc.maplabs.io',
  'http://18.139.224.21:9001/',
  'https://files.maplabs.io/bridge/map.png',
  'MAP'
);
export const BSC_TEST_CHAIN = new Chain(
  ChainId.BSC_TEST,
  'BSC Testnet',
  'https://data-seed-prebsc-2-s2.binance.org:8545',
  'https://testnet.bscscan.com/',
  'https://files.maplabs.io/bridge/bsc.png',
  'BSC'
);

export const POLYGON_TEST_CHAIN = new Chain(
  ChainId.POLYGON_TEST,
  'Polygon Testnet',
  'https://rpc-mumbai.maticvigil.com/',
  'https://mumbai.polygonscan.com/',
  'https://files.mapprotocol.io/bridge/polygon.png',
  'MATIC'
);

export const ETH_PRIV_CHAIN = new Chain(
  ChainId.ETH_PRIV,
  'Ethereum Private',
  'http://18.138.248.113:8545',
  '',
  'https://files.maplabs.io/bridge/eth.png',
  'ETH'
);

export const NEAR_TEST_CHAIN = new Chain(
  ChainId.NEAR_TESTNET,
  'Near Testnet',
  'https://rpc.testnet.near.org',
  'https://explorer.testnet.near.org/',
  'https://cryptologos.cc/logos/near-protocol-near-logo.png',
  'NEAR'
);
// TODO: return chain info
export const ID_TO_NEAR_NETWORK = (id: string): string => {
  switch (id) {
    case ChainId.NEAR_TESTNET:
      return 'testnet';
    default:
      throw new Error(`Unknown chain id when querying near network: ${id}`);
  }
};
export const ID_TO_CHAIN_ID = (id: string): ChainId => {
  switch (id) {
    case ChainId.MAP_MAINNET:
      return ChainId.MAP_MAINNET;
    case ChainId.BSC_MAINNET:
      return ChainId.BSC_MAINNET;
    case ChainId.POLYGON_MAINNET:
      return ChainId.POLYGON_MAINNET;
    case ChainId.NEAR_MAINNET:
      return ChainId.NEAR_MAINNET;

    case ChainId.MAP_TEST:
      return ChainId.MAP_TEST;
    case ChainId.BSC_TEST:
      return ChainId.BSC_TEST;
    case ChainId.ETH_PRIV:
      return ChainId.ETH_PRIV;
    case ChainId.NEAR_TESTNET:
      return ChainId.NEAR_TESTNET;
    case ChainId.POLYGON_TEST:
      return ChainId.POLYGON_TEST;
    default:
      throw new Error(`Unknown chain id: ${id}`);
  }
};

export const SUPPORTED_CHAIN_LIST = [
  MAP_TEST_CHAIN,
  NEAR_TEST_CHAIN,
  BSC_TEST_CHAIN,
  POLYGON_TEST_CHAIN,
];

export const SUPPORTED_CHAIN_LIST_MAINNET = [
  NEAR_MAINNET_CHAIN,
  BSC_MAINNET_CHAIN,
  POLYGON_MAINNET_CHAIN,
  MAP_MAINNET_CHAIN,
];

export enum ChainName {
  MAP_MAINNET = 'map-mainnet',
  BSC_MAINNET = 'bsc-mainnet',
  POLYGON_MAINNET = 'polygon-mainnet',
  NEAR_MAINNET = 'near-mainnet',

  MAP_TEST = 'map-testnet',
  ETH_PRIV = 'eth-priv',
  NEAR_TESTNET = 'near-testnet',
  BSC_TEST = 'bsc-testnet',
  MATIC_TEST = 'matic-mumbai',
}

export enum NativeCurrencyName {
  // Strings match input for CLI
  ETHER = 'ETH',
  MATIC = 'MATIC',
  BSC = 'BNB',
  MAP = 'MAP',
  NEAR = 'NEAR',
}

// export const NATIVE_CURRENCY: { [chainId: number]: NativeCurrencyName } = {
//   [ChainId.MAINNET]: NativeCurrencyName.ETHER,
//   // [ChainId.ROPSTEN]: NativeCurrencyName.ETHER,
//   // [ChainId.RINKEBY]: NativeCurrencyName.ETHER,
//   // [ChainId.GÖRLI]: NativeCurrencyName.ETHER,
//   // [ChainId.KOVAN]: NativeCurrencyName.ETHER,
//   // [ChainId.OPTIMISM]: NativeCurrencyName.ETHER,
//   // [ChainId.OPTIMISTIC_KOVAN]: NativeCurrencyName.ETHER,
//   // [ChainId.ARBITRUM_ONE]: NativeCurrencyName.ETHER,
//   // [ChainId.ARBITRUM_RINKEBY]: NativeCurrencyName.ETHER,
//   // [ChainId.POLYGON]: NativeCurrencyName.MATIC,
//   // [ChainId.POLYGON_MUMBAI]: NativeCurrencyName.MATIC,
//   [ChainId.BSC]: NativeCurrencyName.BSC,
//   [ChainId.MAP]: NativeCurrencyName.MAP,
//   [ChainId.MAP_TEST]: NativeCurrencyName.MAP,
// };

export const ID_TO_NETWORK_NAME = (id: string): ChainName => {
  switch (id) {
    case ChainId.MAP_MAINNET:
      return ChainName.MAP_MAINNET;
    case ChainId.BSC_MAINNET:
      return ChainName.BSC_MAINNET;
    case ChainId.POLYGON_MAINNET:
      return ChainName.POLYGON_MAINNET;
    case ChainId.NEAR_MAINNET:
      return ChainName.NEAR_MAINNET;

    case ChainId.MAP_TEST:
      return ChainName.MAP_TEST;
    case ChainId.ETH_PRIV:
      return ChainName.ETH_PRIV;
    case ChainId.BSC_TEST:
      return ChainName.BSC_TEST;
    case ChainId.POLYGON_TEST:
      return ChainName.MATIC_TEST;
    case ChainId.NEAR_TESTNET:
      return ChainName.NEAR_TESTNET;
    default:
      throw new Error(`Unknown chain id: ${id}`);
  }
};
export const MAP_NETWORK_NAME_TO_ID = (network: string): ChainId => {
  switch (network) {
    case ChainName.MAP_MAINNET:
      return ChainId.MAP_MAINNET;
    case ChainName.MAP_TEST:
      return ChainId.MAP_TEST;
    default:
      throw new Error(`Unsupported network name: ${network}`);
  }
};

// export const WRAPPED_NATIVE_CURRENCY: { [chainId in ChainId]: Token } = {
//   [ChainId.MAINNET]: new Token(
//     1,
//     '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
//     18,
//     'WETH',
//     'Wrapped EVMNativCoin'
//   ),
//   // [ChainId.ROPSTEN]: new Token(
//   //   3,
//   //   '0xc778417E063141139Fce010982780140Aa0cD5Ab',
//   //   18,
//   //   'WETH',
//   //   'Wrapped EVMNativCoin'
//   // ),
//   // [ChainId.RINKEBY]: new Token(
//   //   4,
//   //   '0xc778417E063141139Fce010982780140Aa0cD5Ab',
//   //   18,
//   //   'WETH',
//   //   'Wrapped EVMNativCoin'
//   // ),
//   // [ChainId.GÖRLI]: new Token(
//   //   5,
//   //   '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6',
//   //   18,
//   //   'WETH',
//   //   'Wrapped EVMNativCoin'
//   // ),
//   // [ChainId.KOVAN]: new Token(
//   //   42,
//   //   '0xd0A1E359811322d97991E03f863a0C30C2cF029C',
//   //   18,
//   //   'WETH',
//   //   'Wrapped EVMNativCoin'
//   // ),
//   // [ChainId.OPTIMISM]: new Token(
//   //   ChainId.OPTIMISM,
//   //   '0x4200000000000000000000000000000000000006',
//   //   18,
//   //   'WETH',
//   //   'Wrapped EVMNativCoin'
//   // ),
//   // [ChainId.OPTIMISTIC_KOVAN]: new Token(
//   //   ChainId.OPTIMISTIC_KOVAN,
//   //   '0x4200000000000000000000000000000000000006',
//   //   18,
//   //   'WETH',
//   //   'Wrapped EVMNativCoin'
//   // ),
//   // [ChainId.ARBITRUM_ONE]: new Token(
//   //   ChainId.ARBITRUM_ONE,
//   //   '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
//   //   18,
//   //   'WETH',
//   //   'Wrapped EVMNativCoin'
//   // ),
//   // [ChainId.ARBITRUM_RINKEBY]: new Token(
//   //   ChainId.ARBITRUM_RINKEBY,
//   //   '0xB47e6A5f8b33b3F17603C83a0535A9dcD7E32681',
//   //   18,
//   //   'WETH',
//   //   'Wrapped EVMNativCoin'
//   // ),
//   // [ChainId.POLYGON]: new Token(
//   //   ChainId.POLYGON,
//   //   '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270',
//   //   18,
//   //   'WMATIC',
//   //   'Wrapped MATIC'
//   // ),
//   // [ChainId.POLYGON_MUMBAI]: new Token(
//   //   ChainId.POLYGON_MUMBAI,
//   //   '0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889',
//   //   18,
//   //   'WMATIC',
//   //   'Wrapped MATIC'
//   // ),
//   [ChainId.BSC]: new Token(
//     ChainId.BSC,
//     '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
//     18,
//     'WBNB',
//     'Wrapped BNB'
//   ),
//   [ChainId.MAP]: new Token(
//     ChainId.MAP,
//     '0x13CB04d4a5Dfb6398Fc5AB005a6c84337256eE23',
//     18,
//     'WMAP',
//     'Wrapped MAP'
//   ),
//   [ChainId.MAP_TEST]: new Token(
//     ChainId.MAP,
//     '0x13CB04d4a5Dfb6398Fc5AB005a6c84337256eE23',
//     18,
//     'WMAP',
//     'Wrapped MAP'
//   ),
//   [ChainId.ETH_PRIV]: new Token(
//     ChainId.ETH_PRIV,
//     '0xfe745307D9C8A6F9a72F608E87821f3F55090A35',
//     18,
//     'WETH',
//     'Wrapped ETH'
//   ),
//   [ChainId.NEAR_TESTNET]: new Token(
//     ChainId.NEAR_TESTNET,
//     'wrap.testnet',
//     22,
//     'WNEAR',
//     'Wrapped NEAR'
//   ),
// };

export const IS_MAP = (id: string): boolean => {
  switch (id) {
    case ChainId.MAP_MAINNET:
    case ChainId.MAP_TEST:
      return true;
    default:
      return false;
  }
};

export const IS_NEAR = (id: string): boolean => {
  switch (id) {
    case '1':
    case '3':
    case '4':
    case '5':
    case '42':
    case '10':
    case '69':
    case '42161':
    case '421611':
    case '137':
    case ChainId.MAP_TEST:
    case ChainId.ETH_PRIV:
    case ChainId.BSC_TEST:
    case ChainId.POLYGON_TEST:
    case ChainId.MAP_MAINNET:
    case ChainId.BSC_MAINNET:
    case ChainId.POLYGON_MAINNET:
      return false;
    case ChainId.NEAR_TESTNET:
    case ChainId.NEAR_MAINNET:
      return true;
    default:
      throw new Error(`Unsupported chain id: ${id}`);
  }
};

export const IS_EVM = (id: string): boolean => {
  switch (id) {
    case '1':
    case '3':
    case '4':
    case '5':
    case '42':
    case '10':
    case '69':
    case '42161':
    case '421611':
    case ChainId.POLYGON_MAINNET:
    case ChainId.BSC_MAINNET:
    case ChainId.MAP_MAINNET:

    case ChainId.BSC_TEST:
    case ChainId.POLYGON_TEST:
    case ChainId.MAP_TEST:
    case ChainId.ETH_PRIV:
      return true;
    case ChainId.NEAR_TESTNET:
    case ChainId.NEAR_MAINNET:
      return false;
    default:
      throw new Error(`Unknown chain id: ${id}`);
  }
};
