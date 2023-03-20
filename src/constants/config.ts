import {Currency, EVMCoin, NEARCoin, Token} from "../beans";

/**
 * Near Mainnet  1360100178526209  (0x0004D50100000001)
 * Near Testnet   1360100178526210  (0x0004D50100000002)
 */
export enum CHAIN_ID {

    ETH = '1',
    MAP_MAINNET = '22776',
    BNB_MAINNET = '56',
    POLYGON_MAINNET = '137',
    // NEAR_MAINNET = '5566818579631833088',
    NEAR_MAINNET = '1360100178526209',

    ETH_PRIV = '34434',
    ETH_GOERLI = '5',
    MAP_TEST = '212',
    BNB_TEST = '97',
    POLYGON_TEST = '80001',
    // NEAR_TEST = '5566818579631833089',
    NEAR_TEST = '1360100178526210',

}

export enum TOKEN_ID {
    ALL = 'ALL',
    NATIVE = 'NATIVE',
    WRAP = 'WRAP',
    USDC = 'USDC',
    ETH = 'ETH',
    WETH = 'WETH',
    MOST = 'MOST',
    NEAR = 'NEAR',
    BNEAR = 'BNEAR',
    BMOS = 'BMOS',
    MOS = 'MOS',
    MAP = 'MAP',
    BNB = 'BNB',
    USDT = 'USDT',
    DAI = 'DAI',
    MATIC = 'MATIC',
}

export enum CHAIN_NAME {
    MAP_MAINNET = 'map-mainnet',
    BNB_MAINNET = 'bnb-mainnet',
    POLYGON_MAINNET = 'polygon-mainnet',
    NEAR_MAINNET = 'near-mainnet',

    MAP_TEST = 'map-testnet',
    NEAR_TEST = 'near-testnet',
    BNB_TEST = 'bnb-testnet',
    POLYGON_TEST = 'matic-mumbai',
    ETH_PRIV = 'eth-priv',
    ETH_GOERLI = 'ethereum-goerli',
    ETH = 'ethers',

}

export const matchNative = (chainId: CHAIN_ID | string, decimals: number, name: string) => {
    let _name = name.toUpperCase();
    if (_name === 'NEAR') {
        return new NEARCoin(chainId);
    }
    if (_name === 'ETH') {
        return new EVMCoin(chainId, decimals,
            'ETH', 'Ethereum', 'https://files.maplabs.io/bridge/eth.png');
    }
    if (_name === 'BNB') {
        return new EVMCoin(chainId, decimals,
            'BNB', 'BNB Token', 'https://files.maplabs.io/bridge/bnb.png');
    }
    if (_name === 'MATIC') {
        return new EVMCoin(chainId, decimals,
            'MATIC', 'Polygon', 'https://files.maplabs.io/bridge/polygon.png');
    }

    if (_name === 'MAP' || _name === 'MAPO') {
        return new EVMCoin(chainId, decimals,
            'MAP', ' MAP Protocol (MAP)', 'https://files.maplabs.io/bridge/map.png','MAPO');
    }
    throw new Error(`Not Support this Native Token(${name}) in Chain Id ${chainId}`);
}
export const matchToken = (chainId: CHAIN_ID | string, decimals: number,
                           address: string, name: string): Currency => {
    let _name = name.toUpperCase();
    if (_name === 'WETH') {
        return new Token(chainId, decimals, address,
            'wETH', 'Wrapped ETH', 'https://files.maplabs.io/bridge/weth.png',_name);
    }
    if (_name === 'WMAP' || _name === 'WMAPO') {
        return new Token(chainId, decimals, address,
            'WMAP', 'Wrapped MAP', 'https://files.maplabs.io/bridge/map.png',_name);
    }
    if (_name === 'WBNB') {
        return new Token(chainId, decimals, address,
            'WBNB', 'Wrapped BNB', 'https://files.maplabs.io/bridge/bnb.png',_name);
    }
    if (_name === 'WMATIC') {
        return new Token(chainId, decimals, address,
            'WMATIC', 'Wrapped MATIC', 'https://files.maplabs.io/bridge/polygon.png',_name);
    }
    if (_name === 'WNEAR') {
        return new Token(chainId, decimals, address,
            'wNear', 'Wrapped Near', 'https://files.maplabs.io/bridge/near1.png',_name);
    }

    if (_name === 'DAI') {
        return new Token(chainId, decimals, address,
            'DAI', 'Dai Stablecoin', 'https://files.maplabs.io/bridge/dai.png',_name);
    }
    if (_name === 'USDC') {
        return new Token(chainId, decimals, address,
            'USDC', 'USDcoin', 'https://files.maplabs.io/bridge/usdc.png',_name);
    }
    if (_name === 'USDT') {
        return new Token(chainId, decimals, address,
            'USDT', 'Tether USD', 'https://files.mapprotocol.io/bridge/usdt.png',_name);
    }
    if (_name === 'BNB') {
        return new Token(chainId, decimals, address,
            'BNB', 'BNB Token', 'https://files.maplabs.io/bridge/bnb.png',_name);
    }
    if (_name === 'ETH') {
        return new Token(chainId, decimals, address,
            'ETH', 'Ethereum', 'https://files.maplabs.io/bridge/eth.png',_name);
    }

    if (_name === 'NEAR') {
        return new Token(chainId, decimals, address,
            'NEAR', 'NEAR', 'https://cryptologos.cc/logos/near-protocol-near-logo.png',_name);
    }
    if (_name === 'MOST') {
        return new Token(chainId, decimals, address,
            'MOST', 'MAP Omnichain Service Token', 'https://files.maplabs.io/bridge/most1.png',_name);
    }
    if (_name === 'BNEAR') {
        return new Token(chainId, decimals, address,
            'BNEAR', 'Butter Near', 'https://files.maplabs.io/bridge/near1.png',_name);
    }
    if (_name === 'MAP') {
        return new Token(chainId, decimals, address,
            'MAP', ' MAP Protocol (MAP)', 'https://files.maplabs.io/bridge/map.png','MAPO');
    }
    if (_name === 'MAPO') {
        return new Token(chainId, decimals, address,
            'MAPO', ' MAP Protocol (MAPO)', 'https://files.maplabs.io/bridge/map.png','MAPO');
    }
    if (_name === 'MOS') {
        return new Token(chainId, decimals, address,
            'MOS', 'Map mos', 'https://files.maplabs.io/bridge/most1.png',_name);
    }
    if (_name === 'BMOS') {
        return new Token(chainId, decimals, address,
            'BMOS', 'Butter mos', 'https://files.maplabs.io/bridge/most1.png',_name);
    }

    throw new Error(`Not Support this Token(${name}) in Chain Id${chainId}`);

}
export const createToken = (chainId: CHAIN_ID | string, decimals: number,
                            address: string, name: string, symbol: string, logo: string): Currency => {
    return new Token(chainId, decimals, address, symbol, name, logo);
    // throw new Error(`Not Support this Token(${name}) in Chain Id${chainId}`);
}


const _MOS_CONTRACT_NEAR_ADDRESSES: any = {
    [CHAIN_ID.NEAR_MAINNET]: 'mos.mfac.butternetwork.near',
    [CHAIN_ID.NEAR_TEST]: 'mos.map007.testnet',
};
export const MOS_CONTRACT_ADDRESSES: any = {
    [CHAIN_ID.MAP_MAINNET]: '0x630105189c7114667a7179Aa57f07647a5f42B7F',
    [CHAIN_ID.MAP_TEST]: '0xb4fCfdD492202c91A7eBaf887642F437a07A2664',

    [CHAIN_ID.BNB_MAINNET]: '0x630105189c7114667a7179Aa57f07647a5f42B7F',
    [CHAIN_ID.BNB_TEST]: '0x6858B990A504D7Fc41D0BBB5178c4675518BDA27',

    [CHAIN_ID.POLYGON_MAINNET]: '0x630105189c7114667a7179Aa57f07647a5f42B7F',
    [CHAIN_ID.POLYGON_TEST]: '0x6858B990A504D7Fc41D0BBB5178c4675518BDA27',

    [CHAIN_ID.NEAR_MAINNET]: _MOS_CONTRACT_NEAR_ADDRESSES[CHAIN_ID.NEAR_MAINNET],
    [CHAIN_ID.NEAR_TEST]: _MOS_CONTRACT_NEAR_ADDRESSES[CHAIN_ID.NEAR_TEST],

    [CHAIN_ID.ETH]: '0x630105189c7114667a7179Aa57f07647a5f42B7F',
    [CHAIN_ID.ETH_PRIV]: '0x43130059C655314d7ba7eDfb8299d26FbDE726F1',
    [CHAIN_ID.ETH_GOERLI]: '0x2e2D0FBF6c69B21a56d49ca3A31fEB8Df923f2FB',

}
export const BUTTER_ROUTER_ADDRESSES: any = {
    [CHAIN_ID.MAP_MAINNET]: '0x66BD2fccEf911a5BeF987dCb4afb5E62F33cA222',
    [CHAIN_ID.MAP_TEST]: '0x32474d0D55876176C1B82dcc51d35a6C7541A682',

    [CHAIN_ID.BNB_MAINNET]: '0xfcfa8E11a50EC54fA015C9922afc0b276a5783e3',
    [CHAIN_ID.BNB_TEST]: '0x5ABFb17CFeE098EEA3d2Fb026FD7d77486555F93',

    [CHAIN_ID.POLYGON_MAINNET]: '0xfcfa8E11a50EC54fA015C9922afc0b276a5783e3',
    [CHAIN_ID.POLYGON_TEST]: '0x1d4F72EEcEECE11AB385a0fd624a6C8FF9E570fE',

    [CHAIN_ID.NEAR_MAINNET]: '',
    [CHAIN_ID.NEAR_TEST]: '',

    [CHAIN_ID.ETH]: '0xfcfa8E11a50EC54fA015C9922afc0b276a5783e3',
    [CHAIN_ID.ETH_PRIV]: '',
    [CHAIN_ID.ETH_GOERLI]: '0x840ED95f521103215c0a1D3772c3776b809231B8',
}
export const TOKEN_REGISTER_ADDRESSES: any = {
    [CHAIN_ID.MAP_MAINNET]: '0xff44790d336d3C004F2Dac7e401E4EA5680529dD',
    [CHAIN_ID.MAP_TEST]: '0x636fCd559cc620dd7233aFD3c3556f63Bd39e721',

    [CHAIN_ID.BNB_MAINNET]: '',
    [CHAIN_ID.BNB_TEST]: '',

    [CHAIN_ID.POLYGON_MAINNET]: '',
    [CHAIN_ID.POLYGON_TEST]: '',

    [CHAIN_ID.NEAR_MAINNET]: '',
    [CHAIN_ID.NEAR_TEST]: '',

    [CHAIN_ID.ETH]: '',
    [CHAIN_ID.ETH_PRIV]: '',
    [CHAIN_ID.ETH_GOERLI]: '',
}
export const MOS_CONTRACT_NEAR_ADDRESSES: any = _MOS_CONTRACT_NEAR_ADDRESSES;

export const TOKENS_ETH: { [tokenid: TOKEN_ID | string]: Currency } = {
    [TOKEN_ID.NATIVE]: matchNative(CHAIN_ID.ETH, 18, 'ETH' ),
    [TOKEN_ID.USDC]: matchToken(CHAIN_ID.ETH, 18, '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', 'USDC'),
    [TOKEN_ID.USDT]: matchToken(CHAIN_ID.ETH, 18, '0xdAC17F958D2ee523a2206206994597C13D831ec7', 'USDT'),
    [TOKEN_ID.DAI]: matchToken(CHAIN_ID.ETH, 18, '0x6B175474E89094C44Da98b954EedeAC495271d0F', 'DAI'),
    [TOKEN_ID.MAP]: matchToken(CHAIN_ID.ETH, 18, '0x9e976f211daea0d652912ab99b0dc21a7fd728e4', 'MAP'),
}
export const TOKENS_PRIV: { [tokenid: TOKEN_ID | string]: Currency } = {
    [TOKEN_ID.NATIVE]: matchNative(CHAIN_ID.ETH_PRIV, 18, 'ETH' ),
    [TOKEN_ID.WRAP]: matchToken(CHAIN_ID.ETH_PRIV, 18, '0xB59B98DF47432371A36A8F83fC7fd8371ec1300B', 'WETH'),
    [TOKEN_ID.MAP]: matchToken(CHAIN_ID.ETH_PRIV, 18, '0xE1b2b81B66150F9EF5A89dC346a7A8B8df05d847', 'MAP'),
    [TOKEN_ID.NEAR]: matchToken(CHAIN_ID.ETH_PRIV, 18, '0x152fB50d334a66F7fD8559F6Dad057Ac13b3eD44', 'bNEAR')
}
export const TOKENS_GOERLI: { [tokenid: TOKEN_ID | string]: Currency } = {
    [TOKEN_ID.NATIVE]: matchNative(CHAIN_ID.ETH_GOERLI, 18, 'ETH'),
    [TOKEN_ID.WRAP]: matchToken(CHAIN_ID.ETH_GOERLI, 18, '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6', 'WETH'),
    [TOKEN_ID.USDC]: matchToken(CHAIN_ID.ETH_GOERLI, 18, '0xE66D4a30d177369d134e0E49a9096D357C0e8383', 'USDC'),
    [TOKEN_ID.USDT]: matchToken(CHAIN_ID.ETH_GOERLI, 6, '0xd71513F3efAe4d20d570b76ca16C83FDC40ec121', 'USDT')
}

export const TOKENS_MAP: { [tokenid: TOKEN_ID | string]: Currency } = {
    [TOKEN_ID.NATIVE]: matchNative(CHAIN_ID.MAP_MAINNET, 18,  'MAPO'),
    [TOKEN_ID.WRAP]: matchToken(CHAIN_ID.MAP_MAINNET, 18, '0x13cb04d4a5dfb6398fc5ab005a6c84337256ee23', 'WMAP'),
    [TOKEN_ID.USDC]: matchToken(CHAIN_ID.MAP_MAINNET, 18, '0x9f722b2cb30093f766221fd0d37964949ed66918', 'USDC'),
    [TOKEN_ID.USDT]: matchToken(CHAIN_ID.MAP_MAINNET, 18, '0x33daba9618a75a7aff103e53afe530fbacf4a3dd', 'USDT'),
    [TOKEN_ID.DAI]: matchToken(CHAIN_ID.MAP_MAINNET, 18, '0xEdDfAac857cb94aE8A0347e2b1b06f21AA1AAeFA', 'DAI'),
    [TOKEN_ID.WETH]: matchToken(CHAIN_ID.MAP_MAINNET, 18, '0x05ab928d446d8ce6761e368c8e7be03c3168a9ec', 'WETH'),
}

export const TOKENS_MAP_TEST: { [tokenid: TOKEN_ID | string]: Currency } = {
    [TOKEN_ID.NATIVE]: matchNative(CHAIN_ID.MAP_TEST, 18, 'MAPO'),
    [TOKEN_ID.WRAP]: matchToken(CHAIN_ID.MAP_TEST, 18, '0x2eD27dF9B4c903aB53666CcA59AFB431F7D15e91', 'WMAP'),
    [TOKEN_ID.USDC]: matchToken(CHAIN_ID.MAP_TEST, 18, '0xd28c1187168dA9df1B7f6cb8495e659322D27c9F', 'USDC'),
    [TOKEN_ID.USDT]: matchToken(CHAIN_ID.MAP_TEST, 6, '0x292cB08f506A5579310c34E177eA1A542b9975ae', 'USDT'),
    [TOKEN_ID.BNB]: matchToken(CHAIN_ID.MAP_TEST, 18, '0xc0fAa9255A4099D50C2b356bFbD440B69359cEa3', 'BNB'),
    [TOKEN_ID.ETH]: matchToken(CHAIN_ID.MAP_TEST, 18, '0x41358EFc7d49d19F76E1E3bdD694f3bff9af3b36', 'ETH'),
    [TOKEN_ID.MOST]: matchToken(CHAIN_ID.MAP_TEST, 18, '0xc74bc33a95a62D90672aEFAf4bA784285903cf09', 'MOST'),
    [TOKEN_ID.BNEAR]: matchToken(CHAIN_ID.MAP_TEST, 18, '0xf1b33B4aB498e17C82bA903e5256533cBf51e1Fd', 'BNEAR'),
}

export const TOKENS_BNB: { [tokenid: TOKEN_ID | string]: Currency } = {
    [TOKEN_ID.NATIVE]: matchNative(CHAIN_ID.BNB_MAINNET, 18,  'BNB'),
    [TOKEN_ID.WRAP]: matchToken(CHAIN_ID.BNB_MAINNET, 18, '0xae13d989dac2f0debff460ac112a837c89baa7cd', 'WBNB'),
    [TOKEN_ID.WETH]: matchToken(CHAIN_ID.BNB_MAINNET, 18, '0x2170Ed0880ac9A755fd29B2688956BD959F933F8', 'WETH'),
    [TOKEN_ID.MAP]: matchToken(CHAIN_ID.BNB_MAINNET, 18, '0x8105ECe4ce08B6B6449539A5db23e23b973DfA8f', 'MAP'),
    [TOKEN_ID.USDC]: matchToken(CHAIN_ID.BNB_MAINNET, 18, '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d', 'USDC'),
    [TOKEN_ID.USDT]: matchToken(CHAIN_ID.BNB_MAINNET, 18, '0x55d398326f99059fF775485246999027B3197955', 'USDT'),
    [TOKEN_ID.DAI]: matchToken(CHAIN_ID.BNB_MAINNET, 18, '0x1AF3F329e8BE154074D8769D1FFa4eE058B1DBc3', 'DAI'),
}
export const TOKENS_BNB_TEST: { [tokenid: TOKEN_ID | string]: Currency } = {
    [TOKEN_ID.NATIVE]: matchNative(CHAIN_ID.BNB_TEST, 18,  'BNB'),
    [TOKEN_ID.WRAP]: matchToken(CHAIN_ID.BNB_TEST, 18, '0xae13d989dac2f0debff460ac112a837c89baa7cd', 'WBNB'),
    [TOKEN_ID.MOS]: matchToken(CHAIN_ID.BNB_TEST, 18, '0xb443882EC74e6F2631267FF4fc0E04C06f000089', 'MOS'),
    [TOKEN_ID.NEAR]: matchToken(CHAIN_ID.BNB_TEST, 18, '0xa064aA3F10dE46cb114E543A9f8D90770cFb0d7c', 'NEAR'),
    [TOKEN_ID.MOST]: matchToken(CHAIN_ID.BNB_TEST, 18, '0x688f3Ef5f728995a9DcB299DAEC849CA2E49ddE1', 'MOST'),
    [TOKEN_ID.MAP]: matchToken(CHAIN_ID.BNB_TEST, 18, '0xad4c2B6e113113d345c167F7BdAA5A5D1cD00273', 'MAP'),
    [TOKEN_ID.USDC]: matchToken(CHAIN_ID.BNB_TEST, 18, '0xd8f69e1F100Db655d4503545C3BB308CAab4a3B6', 'USDC'),
    [TOKEN_ID.USDT]: matchToken(CHAIN_ID.BNB_TEST, 6, '0xE66D4a30d177369d134e0E49a9096D357C0e8383', 'USDT')

}

export const TOKENS_POLYGON: { [tokenid: TOKEN_ID | string]: Currency } = {
    [TOKEN_ID.NATIVE]: matchNative(CHAIN_ID.POLYGON_MAINNET, 18,  'MATIC'),
    [TOKEN_ID.WRAP]: matchToken(CHAIN_ID.POLYGON_MAINNET, 18, '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270', 'WMATIC'),
    [TOKEN_ID.WETH]: matchToken(CHAIN_ID.POLYGON_MAINNET, 18, '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619', 'WETH'),
    [TOKEN_ID.MAP]: matchToken(CHAIN_ID.POLYGON_MAINNET, 18, '0xBAbceE78586d3e9E80E0d69601A17f983663Ba6a', 'MAPO'),
    [TOKEN_ID.USDC]: matchToken(CHAIN_ID.POLYGON_MAINNET, 6, '0x2791bca1f2de4661ed88a30c99a7a9449aa84174', 'USDC'),
    [TOKEN_ID.USDT]: matchToken(CHAIN_ID.POLYGON_MAINNET, 6, '0xc2132D05D31c914a87C6611C10748AEb04B58e8F', 'USDT'),
    [TOKEN_ID.DAI]: matchToken(CHAIN_ID.POLYGON_MAINNET, 18, '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063', 'DAI'),
}
export const TOKENS_POLYGON_TEST: { [tokenid: TOKEN_ID | string]: Currency } = {
    [TOKEN_ID.NATIVE]: matchNative(CHAIN_ID.POLYGON_TEST, 18, 'MATIC'),
    [TOKEN_ID.WRAP]: matchToken(CHAIN_ID.POLYGON_TEST, 18, '0xae13d989dac2f0debff460ac112a837c89baa7cd', 'WMATIC'),
    [TOKEN_ID.MOS]: matchToken(CHAIN_ID.POLYGON_TEST, 18, '0x85485E03aEc8bF84a4B1fF5bfAE2E069179149bC', 'MOS'),
    [TOKEN_ID.MOST]: matchToken(CHAIN_ID.POLYGON_TEST, 18, '0x6d4570191C7B5835226a0bE18734A8E922ff353B', 'MOST'),
    [TOKEN_ID.MAP]: matchToken(CHAIN_ID.POLYGON_TEST, 18, '0xE6687528C7b85115a038D806339dd7E7b869B87C', 'MAP'),
    [TOKEN_ID.USDC]: matchToken(CHAIN_ID.POLYGON_TEST, 18, '0xd8f69e1F100Db655d4503545C3BB308CAab4a3B6', 'USDC'),
    [TOKEN_ID.USDT]: matchToken(CHAIN_ID.POLYGON_TEST, 6, '0xd29A1a2025Dc30D7DC18764a36aBF47B93AdaE61', 'USDT')

}

export const TOKENS_NEAR: { [tokenid: TOKEN_ID | string]: Currency } = {
    [TOKEN_ID.NATIVE]: new NEARCoin(CHAIN_ID.NEAR_MAINNET),
    [TOKEN_ID.WRAP]: matchToken(CHAIN_ID.NEAR_MAINNET, 24, 'wrap.near', 'WNEAR'),
    [TOKEN_ID.WETH]: matchToken(CHAIN_ID.NEAR_MAINNET, 18, 'c02aaa39b223fe8d0a0e5c4f27ead9083c756cc2.factory.bridge.near', 'WETH'),
    [TOKEN_ID.USDC]: matchToken(CHAIN_ID.NEAR_MAINNET, 6, 'a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.factory.bridge.near', 'USDC'),
    [TOKEN_ID.USDT]: matchToken(CHAIN_ID.NEAR_MAINNET, 6, 'dac17f958d2ee523a2206206994597c13d831ec7.factory.bridge.near', 'USDT'),
    [TOKEN_ID.DAI]: matchToken(CHAIN_ID.NEAR_MAINNET, 18, '6b175474e89094c44da98b954eedeac495271d0f.factory.bridge.near', 'DAI'),
}
export const TOKENS_NEAR_TEST: { [tokenid: TOKEN_ID | string]: Currency } = {
    [TOKEN_ID.NATIVE]: new NEARCoin(CHAIN_ID.NEAR_TEST),
    [TOKEN_ID.WRAP]: matchToken(CHAIN_ID.NEAR_TEST, 24, 'wrap.testnet', 'WNEAR'),
    [TOKEN_ID.USDC]: matchToken(CHAIN_ID.NEAR_TEST, 6, 'usdc.map007.testnet', 'USDC'),
    [TOKEN_ID.MOST]: matchToken(CHAIN_ID.NEAR_TEST, 24, 'most.mos2.mfac.maplabs.testnet', 'MOST'),
    [TOKEN_ID.MAP]: matchToken(CHAIN_ID.NEAR_TEST, 24, 'mapo.maplabs.testnet', 'MAPO'),
    [TOKEN_ID.USDT]: matchToken(CHAIN_ID.NEAR_TEST, 6, 'usdt.map007.testnet', 'USDT')

}
