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
    METH = 'METH',
    MOST = 'MOST',
    NEAR = 'NEAR',
    BMOS = 'BMOS',
    MOS = 'MOS',
    MAP = 'MAP',
    lMAP = 'lMAP',
    BNB = 'BNB',
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

}

export const matchToken = (chainId: CHAIN_ID | string, decimals: number,
                           address: string, name: string): Currency => {
    name =name.toUpperCase();
    let _name=name.toUpperCase();

    if (_name === 'LMAP'||_name === 'LMAPO') {
        return new Token(chainId, decimals, address, 'lMAP', 'Wrapped MAP', 'https://files.maplabs.io/bridge/map.png');
    }
    if (_name === 'PMAPO'||_name === 'PMAP') {
        return new Token(chainId, decimals, address, 'MAPO', 'Matic-Pegged MAPO', 'https://files.maplabs.io/bridge/map.png');
    }
    if (_name === 'NMAPO'||_name === 'NMAP') {
        return new Token(chainId, decimals, address, 'MAPO', 'NEAR MAPO', 'https://files.maplabs.io/bridge/map.png');
    }
    if (_name === 'BTMAPO'||_name === 'BTMAP') {
        return new Token(chainId, decimals, address, 'MAPO', 'BNBChain MAPO', 'https://files.maplabs.io/bridge/map.png');
    }

    if (_name === 'BMAPO' || _name === 'BMAP') {
        return new Token(chainId, decimals, address, 'MAPO', 'Butter MAPO', 'https://files.maplabs.io/bridge/map.png');
    }
    if (_name === 'BUSDC') {
        return new Token(chainId, decimals, address, 'bUSDC', 'Butter USDC', 'https://files.maplabs.io/bridge/usdc.png');
    }
    if (_name === 'BNEAR') {
        return new Token(chainId, decimals, address, 'NEAR', 'Near', 'https://files.maplabs.io/bridge/near1.png');
    }
    if (_name === 'BMOS') {
        return new Token(chainId, decimals, address, 'BMOS', 'Butter MOST', 'https://files.maplabs.io/bridge/most1.png');
    }


    if (_name === 'MUSDC') {
        return new Token(chainId, decimals, address, 'mBNB', 'MAP USDC', 'https://files.maplabs.io/bridge/usdc.png');
    }
    if (_name === 'MBNB') {
        return new Token(chainId, decimals, address, 'MBNB', 'MAP BNB', 'https://files.maplabs.io/bridge/bnb.png');
    }
    if (_name === 'METH') {
        return new Token(chainId, decimals, address, 'METH', 'MAP ETH', 'https://files.maplabs.io/bridge/eth.png');
    }
    if (_name === 'MOST') {
        return new Token(chainId, decimals, address, 'MOST', 'MOST Token', 'https://files.maplabs.io/bridge/most1.png');
    }

    if (_name === 'WETH') {
        return new Token(chainId, decimals, address, 'wETH', 'Wrapped ETH', 'https://files.maplabs.io/bridge/eth.png');
    }
    if (_name === 'WMAPO') {
        return new Token(chainId, decimals, address, 'wMAPO', 'Wrapped MAPO', 'https://files.maplabs.io/bridge/map.png');
    }
    if (_name === 'WBNB') {
        return new Token(chainId, decimals, address, 'WBNB', 'Wrapped BNB', 'https://files.maplabs.io/bridge/bnb.png');
    }
    if (_name === 'WMATIC') {
        return new Token(chainId, decimals, address, 'WMATIC', 'Wrapped MATIC', 'https://files.maplabs.io/bridge/polygon.png');
    }
    if (_name === 'WNEAR') {
        return new Token(chainId, decimals, address, 'wNear', 'Wrapped Near', 'https://files.maplabs.io/bridge/near1.png');
    }
    if (_name === 'USDC') {
        return new Token(chainId, decimals, address, 'USDC','USD Circle', 'https://files.maplabs.io/bridge/usdc.png');
    }

    if (_name === 'NEAR') {
        return new NEARCoin(chainId);
    }
    if (_name === 'ETH') {
        return new EVMCoin(chainId, decimals, 'ETH', 'Ethereum', 'https://files.maplabs.io/bridge/eth.png');
    }
    if (_name === 'MAPO') {
        return new EVMCoin(chainId, decimals, 'MAPO', 'MAP Protocol', 'https://files.maplabs.io/bridge/map.png');
    }
    if (_name === 'BNB') {
        return new EVMCoin(chainId, decimals, 'BNB', 'BNB Token', 'https://files.maplabs.io/bridge/bnb.png');
    }
    if (_name === 'MATIC') {
        return new EVMCoin(chainId, decimals, 'MATIC', 'Polygon', 'https://files.maplabs.io/bridge/polygon.png');
    }
    throw new Error(`Not Support this Token(${name}) in Chain Id${chainId}`);

}
export const createToken = (chainId: CHAIN_ID | string, decimals: number,
                            address: string, name: string,symbol:string,logo:string): Currency => {
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

    [CHAIN_ID.ETH]: '',
    [CHAIN_ID.ETH_PRIV]: '0x43130059C655314d7ba7eDfb8299d26FbDE726F1',
    [CHAIN_ID.ETH_GOERLI]: '0x2e2D0FBF6c69B21a56d49ca3A31fEB8Df923f2FB',

}
export const BUTTER_ROUTER_ADDRESSES: any = {
    [CHAIN_ID.MAP_MAINNET]: '',
    [CHAIN_ID.MAP_TEST]: '',

    [CHAIN_ID.BNB_MAINNET]: '',
    [CHAIN_ID.BNB_TEST]: '0x5ABFb17CFeE098EEA3d2Fb026FD7d77486555F93',

    [CHAIN_ID.POLYGON_MAINNET]: '',
    [CHAIN_ID.POLYGON_TEST]: '0xCBdb1Da4f99276b0c427776BDE93838Bc19386Cc',

    [CHAIN_ID.NEAR_MAINNET]: '',
    [CHAIN_ID.NEAR_TEST]: '',

    [CHAIN_ID.ETH]: '',
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
export const MOS_CONTRACT_NEAR_ADDRESSES:any=_MOS_CONTRACT_NEAR_ADDRESSES;

export const TOKENS_PRIV: { [tokenid: TOKEN_ID | string]: Currency } = {
    [TOKEN_ID.NATIVE]: matchToken(CHAIN_ID.ETH_PRIV, 18, '', 'ETH'),
    [TOKEN_ID.WRAP]: matchToken(CHAIN_ID.ETH_PRIV, 18, '0xB59B98DF47432371A36A8F83fC7fd8371ec1300B', 'WETH'),
    [TOKEN_ID.lMAP]: matchToken(CHAIN_ID.ETH_PRIV, 18, '0xE1b2b81B66150F9EF5A89dC346a7A8B8df05d847', 'lMAP'),
    [TOKEN_ID.NEAR]: matchToken(CHAIN_ID.ETH_PRIV, 18, '0x152fB50d334a66F7fD8559F6Dad057Ac13b3eD44', 'bNEAR')
}
export const TOKENS_GOERLI: { [tokenid: TOKEN_ID | string]: Currency } = {
    [TOKEN_ID.NATIVE]: matchToken(CHAIN_ID.ETH_GOERLI, 18, '', 'ETH'),
    [TOKEN_ID.WRAP]: matchToken(CHAIN_ID.ETH_GOERLI, 18, '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6', 'WETH'),
    [TOKEN_ID.USDC]: matchToken(CHAIN_ID.ETH_GOERLI, 18, '0xE66D4a30d177369d134e0E49a9096D357C0e8383', 'bUSDC')
}

export const TOKENS_MAP: { [tokenid: TOKEN_ID | string]: Currency } = {
    [TOKEN_ID.NATIVE]: matchToken(CHAIN_ID.MAP_MAINNET, 18, '', 'MAPO'),
    [TOKEN_ID.WRAP]: matchToken(CHAIN_ID.MAP_MAINNET, 18, '0x13CB04d4a5Dfb6398Fc5AB005a6c84337256eE23', 'wMAPO'),
    [TOKEN_ID.USDC]: matchToken(CHAIN_ID.MAP_MAINNET, 18, '0x424D3bcdC96F42aC919F276D7D4f6C94f24e0703', 'mUSDC')
}
export const TOKENS_MAP_TEST: { [tokenid: TOKEN_ID | string]: Currency } = {
    [TOKEN_ID.NATIVE]: matchToken(CHAIN_ID.MAP_TEST, 18, '', 'MAPO'),
    [TOKEN_ID.WRAP]: matchToken(CHAIN_ID.MAP_TEST, 18, '0x2eD27dF9B4c903aB53666CcA59AFB431F7D15e91', 'wMAPO'),
    [TOKEN_ID.USDC]: matchToken(CHAIN_ID.MAP_TEST, 18, '0xd28c1187168dA9df1B7f6cb8495e659322D27c9F', 'USDC'),
    [TOKEN_ID.BNB]: matchToken(CHAIN_ID.MAP_TEST, 18, '0xc0fAa9255A4099D50C2b356bFbD440B69359cEa3', 'mBNB'),
    [TOKEN_ID.METH]: matchToken(CHAIN_ID.MAP_TEST, 18, '0x41358EFc7d49d19F76E1E3bdD694f3bff9af3b36', 'mETH'),
    [TOKEN_ID.MOST]: matchToken(CHAIN_ID.MAP_TEST, 18, '0xc74bc33a95a62D90672aEFAf4bA784285903cf09', 'MOST'),
    [TOKEN_ID.NEAR]: matchToken(CHAIN_ID.MAP_TEST, 18, '0xf1b33B4aB498e17C82bA903e5256533cBf51e1Fd', 'bNEAR')
}

export const TOKENS_BNB: { [tokenid: TOKEN_ID | string]: Currency } = {
    [TOKEN_ID.NATIVE]: matchToken(CHAIN_ID.BNB_MAINNET, 18, '', 'BNB'),
    [TOKEN_ID.WRAP]: matchToken(CHAIN_ID.MAP_MAINNET, 18, '0xae13d989dac2f0debff460ac112a837c89baa7cd', 'wBNB'),
    [TOKEN_ID.USDC]: matchToken(CHAIN_ID.MAP_MAINNET, 18, '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d', 'USDC')
}
export const TOKENS_BNB_TEST: { [tokenid: TOKEN_ID | string]: Currency } = {
    [TOKEN_ID.NATIVE]: matchToken(CHAIN_ID.BNB_TEST, 18, '', 'BNB'),
    [TOKEN_ID.WRAP]: matchToken(CHAIN_ID.BNB_TEST, 18, '0xae13d989dac2f0debff460ac112a837c89baa7cd', 'wBNB'),
    [TOKEN_ID.USDC]: matchToken(CHAIN_ID.BNB_TEST, 18, '0xd8f69e1F100Db655d4503545C3BB308CAab4a3B6', 'bUSDC'),
    [TOKEN_ID.BMOS]: matchToken(CHAIN_ID.BNB_TEST, 18, '0xb443882EC74e6F2631267FF4fc0E04C06f000089', 'bMOS'),
    [TOKEN_ID.NEAR]: matchToken(CHAIN_ID.BNB_TEST, 18, '0xa064aA3F10dE46cb114E543A9f8D90770cFb0d7c', 'bNEAR'),
    [TOKEN_ID.MOST]: matchToken(CHAIN_ID.BNB_TEST, 18, '0x688f3Ef5f728995a9DcB299DAEC849CA2E49ddE1', 'MOST'),
    [TOKEN_ID.MAP]: matchToken(CHAIN_ID.BNB_TEST, 18, '0xad4c2B6e113113d345c167F7BdAA5A5D1cD00273', 'BTMAP'),
}

export const TOKENS_POLYGON: { [tokenid: TOKEN_ID | string]: Currency } = {
    [TOKEN_ID.NATIVE]: matchToken(CHAIN_ID.POLYGON_MAINNET, 18, '', 'MATIC'),
    [TOKEN_ID.WRAP]: matchToken(CHAIN_ID.POLYGON_MAINNET, 18, '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270', 'WMATIC'),
    [TOKEN_ID.USDC]: matchToken(CHAIN_ID.POLYGON_MAINNET, 18, '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174', 'USDC'),
}
export const TOKENS_POLYGON_TEST: { [tokenid: TOKEN_ID | string]: Currency } = {
    [TOKEN_ID.NATIVE]: matchToken(CHAIN_ID.POLYGON_TEST, 18, '', 'MATIC'),
    [TOKEN_ID.WRAP]: matchToken(CHAIN_ID.POLYGON_TEST, 18, '0xae13d989dac2f0debff460ac112a837c89baa7cd', 'WMATIC'),
    [TOKEN_ID.BMOS]: matchToken(CHAIN_ID.POLYGON_TEST, 18, '0x85485E03aEc8bF84a4B1fF5bfAE2E069179149bC', 'bMOS'),
    [TOKEN_ID.MOST]: matchToken(CHAIN_ID.POLYGON_TEST, 18, '0x6d4570191C7B5835226a0bE18734A8E922ff353B', 'MOST'),
    [TOKEN_ID.MAP]: matchToken(CHAIN_ID.POLYGON_TEST, 18, '0xE6687528C7b85115a038D806339dd7E7b869B87C', 'bMAP'),
    [TOKEN_ID.USDC]: matchToken(CHAIN_ID.POLYGON_TEST, 18, '0xe1D8eAB4e616156E11e1c59D1a0E0EFeD66f4cfa', 'bUSDC'),
}

export const TOKENS_NEAR: { [tokenid: TOKEN_ID | string]: Currency } = {
    [TOKEN_ID.NATIVE]: new NEARCoin(CHAIN_ID.NEAR_MAINNET),
    [TOKEN_ID.WRAP]: matchToken(CHAIN_ID.NEAR_MAINNET, 24, 'wrap.near', 'WNEAR'),
    [TOKEN_ID.USDC]: matchToken(CHAIN_ID.NEAR_MAINNET, 6, 'a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.factory.bridge.near', 'USDC'),
}
export const TOKENS_NEAR_TEST: { [tokenid: TOKEN_ID | string]: Currency } = {
    [TOKEN_ID.NATIVE]: new NEARCoin(CHAIN_ID.NEAR_TEST),
    [TOKEN_ID.WRAP]: matchToken(CHAIN_ID.NEAR_TEST, 24, 'wrap.testnet', 'WNEAR'),
    [TOKEN_ID.USDC]: matchToken(CHAIN_ID.NEAR_TEST, 6, 'usdc.map007.testnet', 'USDC'),
    [TOKEN_ID.MOST]: matchToken(CHAIN_ID.NEAR_TEST, 24, 'most.mos2.mfac.maplabs.testnet', 'MOST'),
    [TOKEN_ID.MAP]: matchToken(CHAIN_ID.NEAR_TEST, 24, 'mapo.maplabs.testnet', 'MAPO'),
}