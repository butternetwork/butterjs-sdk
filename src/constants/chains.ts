import { Chain } from '../entities/Chain';

export enum ChainId {
  MAP = 22776,
  MAP_TEST = 212,
  ETH_PRIV = 34434,
  NEAR_TESTNET = 1313161555,
}

export const MAP_MAINNET_CHAIN = new Chain(
  ChainId.MAP,
  'MAP Mainnet',
  'https://poc3-rpc.maplabs.io/',
  'https://makalu.mapscan.io/',
  'https://files.maplabs.io/bridge/map.png'
);
export const MAP_TEST_CHAIN = new Chain(
  212,
  'MAP Testnet',
  'http://18.142.54.137:7445',
  'http://18.139.224.21:9001/',
  'https://files.maplabs.io/bridge/map.png'
);

export const ETH_PRIV_CHAIN = new Chain(
  34434,
  'Ethereum Private',
  'http://18.138.248.113:8545',
  '',
  'https://files.maplabs.io/bridge/eth.png'
);

export const NEAR_TEST_CHAIN = new Chain(
  1313161555,
  'Near Testnet',
  'https://rpc.testnet.near.org',
  'https://explorer.testnet.near.org/',
  'https://cryptologos.cc/logos/near-protocol-near-logo.png'
);
// TODO: return chain info
export const ID_TO_CHAIN_ID = (id: number): ChainId => {
  switch (id) {
    case 22776:
      return ChainId.MAP;
    case 212:
      return ChainId.MAP_TEST;
    case 34434:
      return ChainId.ETH_PRIV;
    case 1313161555:
      return ChainId.NEAR_TESTNET;
    default:
      throw new Error(`Unknown chain id: ${id}`);
  }
};

export enum ChainName {
  MAP = 'map-mainnet',
  MAP_TEST = 'map-testnet',
  ETH_PRIV = 'eth-priv',
  NEAR_TESTNET = 'near-testnet',
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

export const ID_TO_NETWORK_NAME = (id: number): ChainName => {
  switch (id) {
    case 22776:
      return ChainName.MAP;
    case 212:
      return ChainName.MAP_TEST;
    case 34434:
      return ChainName.ETH_PRIV;
    case 1313161555:
      return ChainName.NEAR_TESTNET;
    default:
      throw new Error(`Unknown chain id: ${id}`);
  }
};
export const NETWORK_NAME_TO_ID = (network: string): ChainId => {
  switch (network) {
    case ChainName.MAP:
      return ChainId.MAP;
    case ChainName.MAP_TEST:
      return ChainId.MAP_TEST;
    default:
      throw new Error(`Unsupported network name: ${network}`);
  }
};

export const SUPPORTED_CHAIN_LIST = [
  MAP_MAINNET_CHAIN,
  MAP_TEST_CHAIN,
  ETH_PRIV_CHAIN,
  NEAR_TEST_CHAIN,
];

export const ID_TO_DEFAULT_PROVIDER = (id: ChainId): string => {
  switch (id) {
    case ChainId.MAP:
      return process.env.JSON_RPC_PROVIDER_MAP!;
    case ChainId.MAP_TEST:
      return 'http://18.142.54.137:7445';
    case ChainId.ETH_PRIV:
      return process.env.JSON_RPC_PROVIDER_ETH_PRIV!;
    default:
      throw new Error(`Chain id: ${id} not supported`);
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

export const IS_MAP = (id: number): boolean => {
  switch (id) {
    case ChainId.MAP:
    case ChainId.MAP_TEST:
      return true;
    default:
      return false;
  }
};

export const IS_NEAR = (id: number): boolean => {
  switch (id) {
    case 1:
    case 3:
    case 4:
    case 5:
    case 42:
    case 10:
    case 69:
    case 42161:
    case 421611:
    case 137:
    case 80001:
    case 56:
    case 22776:
    case 212:
    case 34434:
      return false;
    case 1313161555:
      return true;
    default:
      throw new Error(`Unsupported chain id: ${id}`);
  }
};

export const IS_EVM = (id: number): boolean => {
  switch (id) {
    case 1:
    case 3:
    case 4:
    case 5:
    case 42:
    case 10:
    case 69:
    case 42161:
    case 421611:
    case 137:
    case 80001:
    case 56:
    case 22776:
    case 212:
    case 34434:
      return true;
    case 1313161555:
      return false;
    default:
      throw new Error(`Unknown chain id: ${id}`);
  }
};
