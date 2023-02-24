import { Chain } from '../beans';

/** Chain Id for supported Chain */
export enum ChainId {
  MAP_MAINNET = '22776',
  BSC_MAINNET = '56',
  POLYGON_MAINNET = '137',
  NEAR_MAINNET = '5566818579631833088',

  MAP_TEST = '212',
  ETH_PRIV = '34434',
  ETH_GOERLI = '5',
  BSC_TEST = '97',
  POLYGON_TEST = '80001',
  NEAR_TESTNET = '5566818579631833089',
}
/** ID to Chain Object */
export const ID_TO_CHAIN_OBJ = (id: string): Chain => {
  switch (id) {
    // mainnet
    case ChainId.MAP_MAINNET:
      return MAP_MAINNET_CHAIN;
    case ChainId.BSC_MAINNET:
      return BSC_MAINNET_CHAIN;
    case ChainId.POLYGON_MAINNET:
      return POLYGON_MAINNET_CHAIN;
    case ChainId.NEAR_MAINNET:
      return NEAR_MAINNET_CHAIN;
    // testnet
    case ChainId.MAP_TEST:
      return MAP_TEST_CHAIN;
    case ChainId.ETH_GOERLI:
      return ETH_GOERLI_CHAIN;
    case ChainId.BSC_TEST:
      return BSC_TEST_CHAIN;
    case ChainId.POLYGON_TEST:
      return POLYGON_TEST_CHAIN;
    case ChainId.ETH_PRIV:
      return ETH_PRIV_CHAIN;
    case ChainId.NEAR_TESTNET:
      return NEAR_TEST_CHAIN;
    default:
      throw new Error(`ID_TO_CHAIN_OBJ: unknown chain id: ${id}`);
  }
};

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
    case ChainId.ETH_GOERLI:
      return ETH_GOERLI_CHAIN.rpc!;
    case ChainId.BSC_TEST:
      return BSC_TEST_CHAIN.rpc!;
    case ChainId.POLYGON_TEST:
      return POLYGON_TEST_CHAIN.rpc!;
    case ChainId.ETH_PRIV:
      return ETH_PRIV_CHAIN.rpc!;
    case ChainId.NEAR_TESTNET:
      return NEAR_TEST_CHAIN.rpc!;
    default:
      throw new Error(`ID_TO_DEFAULT_RPC_URL: unknown chain id: ${id}`);
  }
};
export const MAP_MAINNET_CHAIN = new Chain(
  ChainId.MAP_MAINNET,
  'MAPO Mainnet','MAPO',
  'https://poc3-rpc.maplabs.io/',
  'https://makalu.mapscan.io/',
  'https://files.maplabs.io/bridge/map.png',

);

export const BSC_MAINNET_CHAIN = new Chain(
  ChainId.BSC_MAINNET,
  'BNB Chain Mainnet','BNB',
  'https://bsc-dataseed1.defibit.io/',
  'https://bscscan.com/',
  'https://uploads-ssl.webflow.com/62f34c32e8660c273054c17c/62fb88db22514137f2029167_bnb%20logo.png',

);

export const POLYGON_MAINNET_CHAIN = new Chain(
  ChainId.POLYGON_MAINNET,
  'Polygon Mainnet','MATIC',
  'https://polygon-rpc.com/',
  'https://polygonscan.com/',
  'https://cryptologos.cc/logos/polygon-matic-logo.png',

);

export const NEAR_MAINNET_CHAIN = new Chain(
  ChainId.NEAR_MAINNET,
  'Near Mainnet','NEAR',
  'https://rpc.mainnet.near.org',
  'https://explorer.near.org/',
  'https://cryptologos.cc/logos/near-protocol-near-logo.png',

);

export const MAP_TEST_CHAIN = new Chain(
  ChainId.MAP_TEST,
  'MAPO Testnet','MAPO',
  'https://testnet-rpc.maplabs.io',
  'http://18.139.224.21:9001/',
  'https://files.maplabs.io/bridge/map.png',

);
export const BSC_TEST_CHAIN = new Chain(
  ChainId.BSC_TEST,
  'BNB Chain Testnet','BNB',
  'https://rpc.ankr.com/bsc_testnet_chapel/9a12629301614050e76136dcaf9627f5ef215f86fb1185d908f9d232b8530ef7',
  'https://testnet.bscscan.com/',
  'https://uploads-ssl.webflow.com/62f34c32e8660c273054c17c/62fb88db22514137f2029167_bnb%20logo.png',

);

export const POLYGON_TEST_CHAIN = new Chain(
  ChainId.POLYGON_TEST,
  'Polygon Testnet','MATIC',
  'https://rpc-mumbai.maticvigil.com/',
  'https://mumbai.polygonscan.com/',
  'https://cryptologos.cc/logos/polygon-matic-logo.png',

);

export const ETH_GOERLI_CHAIN = new Chain(
  ChainId.ETH_GOERLI,
  'Ethereum Goerli','ETH',
  'https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
  'https://goerli.etherscan.io/',
  'https://d33wubrfki0l68.cloudfront.net/3b8b93913fd51cacac56256a98ec42612c9c262a/b1261/static/a183661dd70e0e5c70689a0ec95ef0ba/13c43/eth-diamond-purple.png',

);

export const ETH_PRIV_CHAIN = new Chain(
  ChainId.ETH_PRIV,
  'Ethereum Private','ETH',
  'http://18.138.248.113:8545',
  '',
  'https://files.maplabs.io/bridge/eth.png',

);

export const NEAR_TEST_CHAIN = new Chain(
  ChainId.NEAR_TESTNET,
  'Near Testnet','NEAR',
  'https://rpc.testnet.near.org',
  'https://explorer.testnet.near.org/',
  'https://cryptologos.cc/logos/near-protocol-near-logo.png',

);
// TODO: return chain info
export const ID_TO_NEAR_NETWORK = (id: string): string => {
  switch (id) {
    case ChainId.NEAR_TESTNET:
      return 'testnet';
    default:
      throw new Error(
        `ID_TO_NEAR_NETWORK: unknown chain id when querying near network: ${id}`
      );
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
    case ChainId.ETH_GOERLI:
      return ChainId.ETH_GOERLI;
    case ChainId.BSC_TEST:
      return ChainId.BSC_TEST;
    case ChainId.ETH_PRIV:
      return ChainId.ETH_PRIV;
    case ChainId.NEAR_TESTNET:
      return ChainId.NEAR_TESTNET;
    case ChainId.POLYGON_TEST:
      return ChainId.POLYGON_TEST;
    default:
      throw new Error(`ID_TO_CHAIN_ID: unknown chain id: ${id}`);
  }
};

export const SUPPORTED_CHAIN_LIST_TESTNET = [
  MAP_TEST_CHAIN,
  NEAR_TEST_CHAIN,
  BSC_TEST_CHAIN,
  ETH_GOERLI_CHAIN,
  POLYGON_TEST_CHAIN,
];

export const SUPPORTED_CHAIN_LIST_MAINNET = [
  NEAR_MAINNET_CHAIN,
  BSC_MAINNET_CHAIN,
  NEAR_MAINNET_CHAIN,
  POLYGON_MAINNET_CHAIN,
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
  ETH_GOERLI = 'ethereum-goerli',
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
    case ChainId.ETH_GOERLI:
      return ChainName.ETH_GOERLI;
    case ChainId.ETH_PRIV:
      return ChainName.ETH_PRIV;
    case ChainId.BSC_TEST:
      return ChainName.BSC_TEST;
    case ChainId.POLYGON_TEST:
      return ChainName.MATIC_TEST;
    case ChainId.NEAR_TESTNET:
      return ChainName.NEAR_TESTNET;
    default:
      throw new Error(`ID_TO_NETWORK_NAME: unknown chain id: ${id}`);
  }
};
export const MAP_NETWORK_NAME_TO_ID = (network: string): ChainId => {
  switch (network) {
    case ChainName.MAP_MAINNET:
      return ChainId.MAP_MAINNET;
    case ChainName.MAP_TEST:
      return ChainId.MAP_TEST;
    default:
      throw new Error(
        `MAP_NETWORK_NAME_TO_ID: Unsupported network name: ${network}`
      );
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