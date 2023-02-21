import {Chain, Currency, EVMCoin, NEARCoin, Token} from "../beans";

export enum CHAIN_ID {
    MAP_MAINNET = '22776',
    BNB_MAINNET = '56',
    POLYGON_MAINNET = '137',
    NEAR_MAINNET = '5566818579631833088',

    ETH_PRIV = '34434',
    ETH_GOERLI = '5',
    MAP_TEST = '212',
    BNB_TEST = '97',
    POLYGON_TEST = '80001',
    NEAR_TEST = '5566818579631833089',

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

const createToken = (chainId: CHAIN_ID | string, decimals: number, address: string, name: string): Currency => {
    name =name.toUpperCase();

    if (name === 'LMAP'||name === 'LMAPO') {
        return new Token(chainId, decimals, address, 'lMAP', 'Wrapped MAP', 'https://files.maplabs.io/bridge/map.png');
    }
    if (name === 'PMAPO'||name === 'PMAP') {
        return new Token(chainId, decimals, address, 'MAPO', 'Matic-Pegged MAPO', 'https://files.maplabs.io/bridge/map.png');
    }
    if (name === 'NMAPO'||name === 'NMAP') {
        return new Token(chainId, decimals, address, 'MAPO', 'NEAR MAPO', 'https://files.maplabs.io/bridge/map.png');
    }

    if (name === 'BMAPO' || name === 'BMAP') {
        return new Token(chainId, decimals, address, 'MAPO', 'Butter MAPO', 'https://files.maplabs.io/bridge/map.png');
    }
    if (name === 'BUSDC') {
        return new Token(chainId, decimals, address, 'bUSDC', 'Butter USDC', 'https://files.maplabs.io/bridge/usdc.png');
    }
    if (name === 'BNEAR') {
        return new Token(chainId, decimals, address, 'bNEAR', 'Butter Near', 'https://files.maplabs.io/bridge/near1.png');
    }
    if (name === 'BMOS') {
        return new Token(chainId, decimals, address, 'BMOS', 'Butter MOST', 'https://files.maplabs.io/bridge/most1.png');
    }


    if (name === 'MUSDC') {
        return new Token(chainId, decimals, address, 'mBNB', 'MAP USDC', 'https://files.maplabs.io/bridge/usdc.png');
    }
    if (name === 'MBNB') {
        return new Token(chainId, decimals, address, 'MBNB', 'MAP BNB', 'https://files.maplabs.io/bridge/bnb.png');
    }
    if (name === 'METH') {
        return new Token(chainId, decimals, address, 'METH', 'MAP ETH', 'https://files.maplabs.io/bridge/eth.png');
    }
    if (name === 'MOST') {
        return new Token(chainId, decimals, address, 'MOST', 'MOST Token', 'https://files.maplabs.io/bridge/most1.png');
    }

    if (name === 'WETH') {
        return new Token(chainId, decimals, address, 'wETH', 'Wrapped ETH', 'https://files.maplabs.io/bridge/eth.png');
    }
    if (name === 'WMAPO') {
        return new Token(chainId, decimals, address, 'wMAPO', 'Wrapped MAPO', 'https://files.maplabs.io/bridge/map.png');
    }
    if (name === 'WBNB') {
        return new Token(chainId, decimals, address, 'WBNB', 'Wrapped BNB', 'https://files.maplabs.io/bridge/bnb.png');
    }
    if (name === 'WMATIC') {
        return new Token(chainId, decimals, address, 'WMATIC', 'Wrapped MATIC', 'https://files.maplabs.io/bridge/polygon.png');
    }
    if (name === 'WNEAR') {
        return new Token(chainId, decimals, address, 'wNear', 'Wrapped Near', 'https://files.maplabs.io/bridge/near1.png');
    }
    if (name === 'USDC') {
        return new Token(chainId, decimals, address, 'USDC','USD Circle', 'https://files.maplabs.io/bridge/usdc.png');
    }

    if (name === 'NEAR') {
        return new NEARCoin(chainId);
    }
    if (name === 'ETH') {
        return new EVMCoin(chainId, decimals, 'ETH', 'Ethereum', 'https://files.maplabs.io/bridge/eth.png');
    }
    if (name === 'MAPO') {
        return new EVMCoin(chainId, decimals, 'MAPO', 'MAP Protocol', 'https://files.maplabs.io/bridge/map.png');
    }
    if (name === 'BNB') {
        return new EVMCoin(chainId, decimals, 'BNB', 'BNB Token', 'https://files.maplabs.io/bridge/bnb.png');
    }
    if (name === 'MATIC') {
        return new EVMCoin(chainId, decimals, 'MATIC', 'Polygon', 'https://files.maplabs.io/bridge/polygon.png');
    }
    throw new Error(`Not Support this Token(${name}) in Chain Id${chainId}`);

}

const TOKENS_PRIV: { [tokenid: TOKEN_ID | string]: Currency } = {
    [TOKEN_ID.NATIVE]: createToken(CHAIN_ID.ETH_PRIV, 18, '', 'ETH'),
    [TOKEN_ID.WRAP]: createToken(CHAIN_ID.ETH_PRIV, 18, '0xB59B98DF47432371A36A8F83fC7fd8371ec1300B', 'WETH'),
    [TOKEN_ID.lMAP]: createToken(CHAIN_ID.ETH_PRIV, 18, '0xE1b2b81B66150F9EF5A89dC346a7A8B8df05d847', 'lMAP'),
    [TOKEN_ID.NEAR]: createToken(CHAIN_ID.ETH_PRIV, 18, '0x152fB50d334a66F7fD8559F6Dad057Ac13b3eD44', 'bNEAR')
}
const TOKENS_GOERLI: { [tokenid: TOKEN_ID | string]: Currency } = {
    [TOKEN_ID.NATIVE]: createToken(CHAIN_ID.ETH_GOERLI, 18, '', 'ETH'),
    [TOKEN_ID.WRAP]: createToken(CHAIN_ID.ETH_GOERLI, 18, '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6', 'WETH'),
    [TOKEN_ID.USDC]: createToken(CHAIN_ID.ETH_GOERLI, 18, '0xE66D4a30d177369d134e0E49a9096D357C0e8383', 'bUSDC')
}

const TOKENS_MAP: { [tokenid: TOKEN_ID | string]: Currency } = {
    [TOKEN_ID.NATIVE]: createToken(CHAIN_ID.MAP_MAINNET, 18, '', 'MAPO'),
    [TOKEN_ID.WRAP]: createToken(CHAIN_ID.MAP_MAINNET, 18, '0x13CB04d4a5Dfb6398Fc5AB005a6c84337256eE23', 'wMAPO'),
    [TOKEN_ID.USDC]: createToken(CHAIN_ID.MAP_MAINNET, 18, '0x424D3bcdC96F42aC919F276D7D4f6C94f24e0703', 'mUSDC')
}
const TOKENS_MAP_TEST: { [tokenid: TOKEN_ID | string]: Currency } = {
    [TOKEN_ID.NATIVE]: createToken(CHAIN_ID.MAP_TEST, 18, '', 'MAPO'),
    [TOKEN_ID.WRAP]: createToken(CHAIN_ID.MAP_TEST, 18, '0x2eD27dF9B4c903aB53666CcA59AFB431F7D15e91', 'wMAPO'),
    [TOKEN_ID.USDC]: createToken(CHAIN_ID.MAP_TEST, 18, '0xd28c1187168dA9df1B7f6cb8495e659322D27c9F', 'USDC'),
    [TOKEN_ID.BNB]: createToken(CHAIN_ID.MAP_TEST, 18, '0xc0fAa9255A4099D50C2b356bFbD440B69359cEa3', 'mBNB'),
    [TOKEN_ID.METH]: createToken(CHAIN_ID.MAP_TEST, 18, '0x41358EFc7d49d19F76E1E3bdD694f3bff9af3b36', 'mETH'),
    [TOKEN_ID.MOST]: createToken(CHAIN_ID.MAP_TEST, 18, '0xc74bc33a95a62D90672aEFAf4bA784285903cf09', 'MOST'),
    [TOKEN_ID.NEAR]: createToken(CHAIN_ID.MAP_TEST, 18, '0xf1b33B4aB498e17C82bA903e5256533cBf51e1Fd', 'bNEAR')
}

const TOKENS_BNB: { [tokenid: TOKEN_ID | string]: Currency } = {
    [TOKEN_ID.NATIVE]: createToken(CHAIN_ID.BNB_MAINNET, 18, '', 'BNB'),
    [TOKEN_ID.WRAP]: createToken(CHAIN_ID.MAP_MAINNET, 18, '0xae13d989dac2f0debff460ac112a837c89baa7cd', 'wBNB'),
    [TOKEN_ID.USDC]: createToken(CHAIN_ID.MAP_MAINNET, 18, '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d', 'USDC')
}
const TOKENS_BNB_TEST: { [tokenid: TOKEN_ID | string]: Currency } = {
    [TOKEN_ID.NATIVE]: createToken(CHAIN_ID.BNB_TEST, 18, '', 'BNB'),
    [TOKEN_ID.WRAP]: createToken(CHAIN_ID.BNB_TEST, 18, '0xae13d989dac2f0debff460ac112a837c89baa7cd', 'wBNB'),
    [TOKEN_ID.USDC]: createToken(CHAIN_ID.BNB_TEST, 18, '0xd8f69e1F100Db655d4503545C3BB308CAab4a3B6', 'USDC'),
    [TOKEN_ID.BMOS]: createToken(CHAIN_ID.BNB_TEST, 18, '0x593F6F6748dc203DFa636c299EeA6a39C0734EEd', 'bMOS'),
    [TOKEN_ID.NEAR]: createToken(CHAIN_ID.BNB_TEST, 18, '0xa064aA3F10dE46cb114E543A9f8D90770cFb0d7c', 'bNEAR'),
    [TOKEN_ID.MOST]: createToken(CHAIN_ID.BNB_TEST, 18, '0x688f3Ef5f728995a9DcB299DAEC849CA2E49ddE1', 'MOST'),
    [TOKEN_ID.MAP]: createToken(CHAIN_ID.BNB_TEST, 18, '0xad4c2B6e113113d345c167F7BdAA5A5D1cD00273', 'MAPO'),
}

const TOKENS_POLYGON: { [tokenid: TOKEN_ID | string]: Currency } = {
    [TOKEN_ID.NATIVE]: createToken(CHAIN_ID.POLYGON_MAINNET, 18, '', 'MATIC'),
    [TOKEN_ID.WRAP]: createToken(CHAIN_ID.POLYGON_MAINNET, 18, '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270', 'WMATIC'),
}
const TOKENS_POLYGON_TEST: { [tokenid: TOKEN_ID | string]: Currency } = {
    [TOKEN_ID.NATIVE]: createToken(CHAIN_ID.POLYGON_TEST, 18, '', 'MATIC'),
    [TOKEN_ID.WRAP]: createToken(CHAIN_ID.POLYGON_TEST, 18, '0xae13d989dac2f0debff460ac112a837c89baa7cd', 'WMATIC'),
    [TOKEN_ID.BMOS]: createToken(CHAIN_ID.POLYGON_TEST, 18, '0xe1D8eAB4e616156E11e1c59D1a0E0EFeD66f4cfa', 'bMOS'),
    [TOKEN_ID.MOST]: createToken(CHAIN_ID.POLYGON_TEST, 18, '0x6d4570191C7B5835226a0bE18734A8E922ff353B', 'MOST'),
    [TOKEN_ID.MAP]: createToken(CHAIN_ID.POLYGON_TEST, 18, '0xE6687528C7b85115a038D806339dd7E7b869B87C', 'bMAP'),
}

const TOKENS_NEAR: { [tokenid: TOKEN_ID | string]: Currency } = {
    [TOKEN_ID.NATIVE]: new NEARCoin(CHAIN_ID.NEAR_MAINNET),
    [TOKEN_ID.WRAP]: createToken(CHAIN_ID.NEAR_MAINNET, 24, 'wrap.near', 'WNEAR'),
    [TOKEN_ID.USDC]: createToken(CHAIN_ID.NEAR_MAINNET, 6, 'a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.factory.bridge.near', 'USDC'),
}
const TOKENS_NEAR_TEST: { [tokenid: TOKEN_ID | string]: Currency } = {
    [TOKEN_ID.NATIVE]: new NEARCoin(CHAIN_ID.NEAR_TEST),
    [TOKEN_ID.WRAP]: createToken(CHAIN_ID.NEAR_TEST, 24, 'wrap.testnet', 'WNEAR'),
    [TOKEN_ID.USDC]: createToken(CHAIN_ID.NEAR_TEST, 6, 'usdc.map007.testnet', 'USDC'),
    [TOKEN_ID.MOST]: createToken(CHAIN_ID.NEAR_TEST, 24, 'most.mos2.mfac.maplabs.testnet', 'MOST'),
    [TOKEN_ID.MAP]: createToken(CHAIN_ID.NEAR_TEST, 24, 'mapo.maplabs.testnet', 'MAPO'),
}

const TOKEN_PRIV = (tokenId: TOKEN_ID | string): Currency => {
    let current: any = TOKENS_PRIV[tokenId];
    if (current) {
        return ((current as Currency)).copy;
    }
    throw new Error(`Not Support this Token(${tokenId}) in ETH Priv Chain`)
}
const TOKEN_GOERLI = (tokenId: TOKEN_ID | string): Currency => {
    let current: any = TOKENS_GOERLI[tokenId];
    if (current) {
        return ((current as Currency)).copy;
    }
    throw new Error(`Not Support this Token(${tokenId}) in ETH Goerli Chain`)
}
const TOKEN_MAP = (tokenId: TOKEN_ID | string, isTest = true): Currency => {
    let current: any;
    if (isTest) {
        current = TOKENS_MAP_TEST[tokenId];
    } else {
        current = TOKENS_MAP[tokenId];
    }
    if (current) {
        return ((current as Currency)).copy;
    }
    throw new Error(`Not Support this Token(${tokenId}) in MAP | ${isTest}`)
}
const TOKEN_BNB = (tokenId: TOKEN_ID | string, isTest = true): Currency => {
    let current: any;
    if (isTest) {
        current = TOKENS_BNB_TEST[tokenId];
    } else {
        current = TOKENS_BNB[tokenId];
    }
    if (current) {
        return ((current as Currency)).copy;
    }

    throw new Error(`Not Support this Token(${tokenId}) in BNB Chain | ${isTest}`)
}
const TOKEN_POLYGON = (tokenId: TOKEN_ID | string, isTest = true): Currency => {
    let current: any;
    if (isTest) {
        current = TOKENS_POLYGON_TEST[tokenId];
    } else {
        current = TOKENS_POLYGON[tokenId];
    }
    if (current) {
        return ((current as Currency)).copy;
    }
    throw new Error(`Not Support this Token(${tokenId}) in Polygon Chain | ${isTest}`)
}
const TOKEN_NEAR = (tokenId: TOKEN_ID | string, isTest = true): Currency => {
    let current: any;
    if (isTest) {
        current = TOKENS_NEAR_TEST[tokenId];
    } else {
        current = TOKENS_NEAR[tokenId];
    }
    if (current) {
        return ((current as Currency)).copy;
    }

    throw new Error(`Not Support this Token(${tokenId}) in Near Chain | ${isTest}`)
}

export const TO_CHAIN_ID = (str:CHAIN_ID|CHAIN_NAME|string) => {
    switch (str) {
        case CHAIN_ID.MAP_MAINNET:
        case CHAIN_NAME.MAP_MAINNET:
            return CHAIN_ID.MAP_MAINNET;
        case CHAIN_ID.BNB_MAINNET:
        case CHAIN_NAME.BNB_MAINNET:
            return CHAIN_ID.BNB_MAINNET;
        case CHAIN_ID.POLYGON_MAINNET:
        case CHAIN_NAME.POLYGON_MAINNET:
            return CHAIN_ID.POLYGON_MAINNET;
        case CHAIN_ID.NEAR_MAINNET:
        case CHAIN_NAME.NEAR_MAINNET:
            return CHAIN_ID.NEAR_MAINNET;
        case CHAIN_ID.ETH_PRIV:
        case CHAIN_NAME.ETH_PRIV:
            return CHAIN_ID.ETH_PRIV;
        case CHAIN_ID.ETH_GOERLI:
        case CHAIN_NAME.ETH_GOERLI:
            return CHAIN_ID.ETH_GOERLI;
        case CHAIN_ID.MAP_TEST:
        case CHAIN_NAME.MAP_TEST:
            return CHAIN_ID.MAP_TEST;
        case CHAIN_ID.BNB_TEST:
        case CHAIN_NAME.BNB_TEST:
            return CHAIN_ID.BNB_TEST;
        case CHAIN_ID.POLYGON_TEST:
        case CHAIN_NAME.POLYGON_TEST:
            return CHAIN_ID.POLYGON_TEST;
        case CHAIN_ID.NEAR_TEST:
        case CHAIN_NAME.NEAR_TEST:
            return CHAIN_ID.NEAR_TEST;
    }
    throw new Error(
        `TO_CHAIN_ID Unsupported network params: ${str}`
    );
}

export const CHAINS = (chainId: CHAIN_ID | string): Chain => {
    if (chainId === CHAIN_ID.MAP_MAINNET) {
        return new Chain(CHAIN_ID.MAP_MAINNET,
            'MAPO Mainnet', 'MAPO',
            'https://poc3-rpc.maplabs.io/',
            'https://makalu.mapscan.io/',
            'https://files.maplabs.io/bridge/map.png',
            CHAIN_NAME.MAP_MAINNET,
            TOKEN_MAP(TOKEN_ID.NATIVE, false),
        );
    }
    if (chainId === CHAIN_ID.BNB_MAINNET) {
        return new Chain(CHAIN_ID.BNB_MAINNET,
            'BNB Chain', 'BNB',
            'https://bsc-dataseed1.defibit.io/',
            'https://bscscan.com/',
            'https://uploads-ssl.webflow.com/62f34c32e8660c273054c17c/62fb88db22514137f2029167_bnb%20logo.png',
            CHAIN_NAME.BNB_MAINNET,
            TOKEN_BNB(TOKEN_ID.NATIVE, false),
        );
    }
    if (chainId === CHAIN_ID.POLYGON_MAINNET) {
        return new Chain(CHAIN_ID.POLYGON_MAINNET,
            'Polygon', 'MATIC',
            'https://polygon-rpc.com/',
            'https://polygonscan.com/',
            'https://cryptologos.cc/logos/polygon-matic-logo.png',
            CHAIN_NAME.POLYGON_MAINNET,
            TOKEN_POLYGON(TOKEN_ID.NATIVE, false),
        );
    }
    if (chainId === CHAIN_ID.NEAR_MAINNET) {
        return new Chain(CHAIN_ID.NEAR_MAINNET,
            'Near', 'NEAR',
            'https://rpc.mainnet.near.org',
            'https://explorer.near.org/',
            'https://cryptologos.cc/logos/near-protocol-near-logo.png',
            CHAIN_NAME.NEAR_MAINNET,
            TOKEN_NEAR(TOKEN_ID.NATIVE, false),
        );
    }
    if (chainId === CHAIN_ID.ETH_PRIV) {
        return new Chain(CHAIN_ID.ETH_PRIV,
            'Ethereum Private', 'ETH',
            'http://18.138.248.113:8545',
            '',
            'https://files.maplabs.io/bridge/eth.png',
            CHAIN_NAME.ETH_PRIV,
            TOKEN_PRIV(TOKEN_ID.NATIVE),
        );
    }
    if (chainId === CHAIN_ID.ETH_GOERLI) {
        return new Chain(CHAIN_ID.ETH_GOERLI,
            'Ethereum Goerli', 'ETH',
            'https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
            'https://goerli.etherscan.io/',
            'https://d33wubrfki0l68.cloudfront.net/3b8b93913fd51cacac56256a98ec42612c9c262a/b1261/static/a183661dd70e0e5c70689a0ec95ef0ba/13c43/eth-diamond-purple.png',
            CHAIN_NAME.ETH_GOERLI,
            TOKEN_GOERLI(TOKEN_ID.NATIVE),
        );
    }
    if (chainId === CHAIN_ID.MAP_TEST) {
        return new Chain(
            CHAIN_ID.MAP_TEST,
            'MAPO Testnet', 'MAPO',
            'https://testnet-rpc.maplabs.io',
            'http://18.139.224.21:9001/',
            'https://files.maplabs.io/bridge/map.png',
            CHAIN_NAME.MAP_TEST,
            TOKEN_MAP(TOKEN_ID.NATIVE),
        );
    }
    if (chainId === CHAIN_ID.BNB_TEST) {
        return new Chain(
            CHAIN_ID.BNB_TEST,
            'BNB Chain Testnet', 'BNB',
            'https://rpc.ankr.com/bsc_testnet_chapel/9a12629301614050e76136dcaf9627f5ef215f86fb1185d908f9d232b8530ef7',
            'https://testnet.bscscan.com/',
            'https://uploads-ssl.webflow.com/62f34c32e8660c273054c17c/62fb88db22514137f2029167_bnb%20logo.png',
            CHAIN_NAME.BNB_TEST,
            TOKEN_BNB(TOKEN_ID.NATIVE),
        );
    }
    if (chainId === CHAIN_ID.POLYGON_TEST) {
        return new Chain(
            CHAIN_ID.POLYGON_TEST,
            'Polygon Testnet', 'MATIC',
            'https://rpc-mumbai.maticvigil.com/',
            'https://mumbai.polygonscan.com/',
            'https://cryptologos.cc/logos/polygon-matic-logo.png',
            CHAIN_NAME.POLYGON_TEST,
            TOKEN_POLYGON(TOKEN_ID.NATIVE),
        );
    }
    if (chainId === CHAIN_ID.NEAR_TEST) {
        return new Chain(
            CHAIN_ID.NEAR_TEST,
            'Near Testnet', 'NEAR',
            'https://rpc.testnet.near.org',
            'https://explorer.testnet.near.org/',
            'https://cryptologos.cc/logos/near-protocol-near-logo.png',
            CHAIN_NAME.NEAR_TEST,
            TOKEN_NEAR(TOKEN_ID.NATIVE),
        );
    }
    throw new Error(
        `Unsupported network chainId: ${chainId}`
    );

}

export const TOKENS = (chainId: CHAIN_ID | string, tokenId: TOKEN_ID | string): Currency | null => {
    if (chainId === CHAIN_ID.MAP_MAINNET) {
        return TOKEN_MAP(tokenId, false);
    }
    if (chainId === CHAIN_ID.BNB_MAINNET) {
        return TOKEN_BNB(tokenId, false);
    }
    if (chainId === CHAIN_ID.POLYGON_MAINNET) {
        return TOKEN_POLYGON(tokenId, false);
    }
    if (chainId === CHAIN_ID.NEAR_MAINNET) {
        return TOKEN_NEAR(tokenId, false);
    }
    if (chainId === CHAIN_ID.ETH_PRIV) {
        return TOKEN_PRIV(tokenId);
    }
    if (chainId === CHAIN_ID.ETH_GOERLI) {
        return TOKEN_GOERLI(tokenId);
    }
    if (chainId === CHAIN_ID.MAP_TEST) {
        return TOKEN_MAP(tokenId);
    }
    if (chainId === CHAIN_ID.BNB_TEST) {
        return TOKEN_BNB(tokenId);
    }
    if (chainId === CHAIN_ID.POLYGON_TEST) {
        return TOKEN_POLYGON(tokenId);
    }
    if (chainId === CHAIN_ID.NEAR_TEST) {
        return TOKEN_NEAR(tokenId);
    }
    throw new Error(
        `Unsupported network chainId: ${chainId}`
    );
}

/**
 * todo
 * @param chainId
 * @constructor
 */
export const AVAILABLE_TOKENS = (chainId: CHAIN_ID | string): Currency[] => {
    let items = [];
    if (chainId === CHAIN_ID.MAP_MAINNET) {
        for (const key in TOKENS_MAP) {
            items.push(TOKEN_MAP(key,false));
        }
        return items;
    }
    if (chainId === CHAIN_ID.BNB_MAINNET) {
        for (const key in TOKENS_BNB) {
            items.push(TOKEN_BNB(key,false));
        }
        return items;
    }
    if (chainId === CHAIN_ID.POLYGON_MAINNET) {
        for (const key in TOKENS_POLYGON) {
            items.push(TOKEN_POLYGON(key,false));
        }
        return items;
    }
    if (chainId === CHAIN_ID.NEAR_MAINNET) {
        for (const key in TOKENS_NEAR) {
            items.push(TOKEN_NEAR(key,false));
        }
        return items;
    }
    if (chainId === CHAIN_ID.ETH_PRIV) {
        for (const key in TOKENS_PRIV) {
            items.push(TOKEN_PRIV(key));
        }
        return items;
    }
    if (chainId === CHAIN_ID.ETH_GOERLI) {
        for (const key in TOKENS_GOERLI) {
            items.push(TOKEN_GOERLI(key));
        }
        return items;
    }
    if (chainId === CHAIN_ID.MAP_TEST) {
        for (const key in TOKENS_MAP_TEST) {
            items.push(TOKEN_MAP(key,true));
        }
        return items;
    }
    if (chainId === CHAIN_ID.BNB_TEST) {
        for (const key in TOKENS_BNB_TEST) {
            items.push(TOKEN_BNB(key,true));
        }
        return items;
    }
    if (chainId === CHAIN_ID.POLYGON_TEST) {
        for (const key in TOKENS_POLYGON_TEST) {
            items.push(TOKEN_POLYGON(key,true));
        }
        return items;
    }
    if (chainId === CHAIN_ID.NEAR_TEST) {
        for (const key in TOKENS_NEAR_TEST) {
            items.push(TOKEN_NEAR(key,true));
        }
        return items;
    }
    throw new Error(`AVAILABLE_TOKENS: unknown chain id: ${chainId}`);
}

/**
 * TODO
 * @param chainId
 * @constructor
 */
export const SUPPORT_TOKENS = (chainId: CHAIN_ID | string): Currency[] => {
    if (chainId === CHAIN_ID.MAP_MAINNET) {
        return [];
    }
    if (chainId === CHAIN_ID.BNB_MAINNET) {
        return [TOKEN_BNB(TOKEN_ID.USDC, false)];
    }
    if (chainId === CHAIN_ID.POLYGON_MAINNET) {
        return [TOKEN_POLYGON(TOKEN_ID.USDC, false)];
    }
    if (chainId === CHAIN_ID.NEAR_MAINNET) {
        return [TOKEN_NEAR(TOKEN_ID.USDC, false)];
    }
    if (chainId === CHAIN_ID.ETH_PRIV) {
        return [];
    }
    if (chainId === CHAIN_ID.ETH_GOERLI) {
        return [
            TOKEN_GOERLI(TOKEN_ID.NATIVE),
            TOKEN_GOERLI(TOKEN_ID.USDC)
        ];
    }
    if (chainId === CHAIN_ID.MAP_TEST) {
        return [
            TOKEN_MAP(TOKEN_ID.USDC),
        ];
    }
    if (chainId === CHAIN_ID.BNB_TEST) {
        return [
            TOKEN_BNB(TOKEN_ID.NATIVE),
            TOKEN_BNB(TOKEN_ID.USDC),
            TOKEN_BNB(TOKEN_ID.BMOS),
        ];
    }
    if (chainId === CHAIN_ID.POLYGON_TEST) {
        return [
            TOKEN_POLYGON(TOKEN_ID.NATIVE),
            TOKEN_POLYGON(TOKEN_ID.USDC),
            TOKEN_POLYGON(TOKEN_ID.BMOS),
        ];
    }
    if (chainId === CHAIN_ID.NEAR_TEST) {
        return [
            TOKEN_NEAR(TOKEN_ID.NATIVE),
            TOKEN_NEAR(TOKEN_ID.USDC)
        ];
    }
    throw new Error(`SUPPORT_TOKENS: unknown chain id: ${chainId}`);
};

export const NEAR_CONNECT = (chainId:CHAIN_ID|string) => {
    const connectionConfig = {
        networkId: chainId===CHAIN_ID.NEAR_TEST?'testnet':'',
        nodeUrl: CHAINS(chainId).rpc,
    };
    if (!connectionConfig.networkId){
        throw new Error(
            `ID_TO_NEAR_NETWORK: unknown chain id when querying near network: ${chainId}`
        );
    }
    return connectionConfig;
}

export const IS_MAP = (id: string): boolean => {
    switch (id) {
        case CHAIN_ID.MAP_MAINNET:
        case CHAIN_ID.MAP_TEST:
            return true;
        default:
            return false;
    }
};

export const IS_NEAR = (id: string): boolean => {
    switch (id) {
        case CHAIN_ID.NEAR_TEST:
        case CHAIN_ID.NEAR_MAINNET:
            return true;
        default:
            return false;
    }
};

export const IS_EVM = (id: string): boolean => {
    switch (id) {
        case CHAIN_ID.POLYGON_MAINNET:
        case CHAIN_ID.BNB_MAINNET:
        case CHAIN_ID.MAP_MAINNET:
        case CHAIN_ID.BNB_TEST:
        case CHAIN_ID.POLYGON_TEST:
        case CHAIN_ID.MAP_TEST:
        case CHAIN_ID.ETH_GOERLI:
        case CHAIN_ID.ETH_PRIV:
            return true;
        default:
            return false;
    }
};

export const IS_MAINNET = (id: string): boolean => {
    switch (id) {
        case '1':
        case CHAIN_ID.MAP_MAINNET:
        case CHAIN_ID.BNB_MAINNET:
        case CHAIN_ID.POLYGON_MAINNET:
        case CHAIN_ID.NEAR_MAINNET:
            return true;
        default:
            return false;
    }

}
