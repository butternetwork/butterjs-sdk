import {Chain, Currency} from "../beans";
import {
    CHAIN_ID,
    CHAIN_NAME,
    TOKEN_ID,
    TOKENS_BNB,
    TOKENS_BNB_TEST, TOKENS_ETH,
    TOKENS_GOERLI,
    TOKENS_MAP,
    TOKENS_MAP_TEST,
    TOKENS_NEAR,
    TOKENS_NEAR_TEST,
    TOKENS_POLYGON,
    TOKENS_POLYGON_TEST,
    TOKENS_PRIV
} from "./config";
import Decimal from "decimal.js";

export {CHAIN_ID, CHAIN_NAME, TOKEN_ID} from './config';

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
const TOKEN_ETH = (tokenId: TOKEN_ID | string, isTest = false): Currency => {
    let current: any=TOKENS_ETH[tokenId];
    if (current) {
        return ((current as Currency)).copy;
    }
    throw new Error(`Not Support this Token(${tokenId}) in MAP | ${isTest}`)
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

export const TO_CHAIN_ID = (str: CHAIN_ID | CHAIN_NAME | string) => {
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
    if (chainId){
        try {
            chainId = `${new Decimal(chainId).toNumber()}`
        } catch (e) {
        }
    }
    if (chainId === CHAIN_ID.ETH) {
        return new Chain(CHAIN_ID.ETH,
            'Ethereum', 'ETH',
            '',
            'https://etherscan.io/',
            'https://files.maplabs.io/bridge/eth.png',
            CHAIN_NAME.ETH_GOERLI,
            TOKEN_ETH(TOKEN_ID.NATIVE, false),
        );
    }
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
            'https://files.maplabs.io/bridge/eth.png',
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
    if (chainId === CHAIN_ID.ETH) {
        return TOKEN_ETH(tokenId, false);
    }
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
    if (chainId){
        try {
            chainId = `${new Decimal(chainId).toNumber()}`
        } catch (e) {
        }
    }
    let items = [];
    if (chainId === CHAIN_ID.ETH) {
        for (const key in TOKENS_ETH) {
            items.push(TOKEN_MAP(key, false));
        }
        return items;
    }
    if (chainId === CHAIN_ID.MAP_MAINNET) {
        for (const key in TOKENS_MAP) {
            items.push(TOKEN_MAP(key, false));
        }
        return items;
    }
    if (chainId === CHAIN_ID.BNB_MAINNET) {
        for (const key in TOKENS_BNB) {
            items.push(TOKEN_BNB(key, false));
        }
        return items;
    }
    if (chainId === CHAIN_ID.POLYGON_MAINNET) {
        for (const key in TOKENS_POLYGON) {
            items.push(TOKEN_POLYGON(key, false));
        }
        return items;
    }
    if (chainId === CHAIN_ID.NEAR_MAINNET) {
        for (const key in TOKENS_NEAR) {
            items.push(TOKEN_NEAR(key, false));
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
            items.push(TOKEN_MAP(key, true));
        }
        return items;
    }
    if (chainId === CHAIN_ID.BNB_TEST) {
        for (const key in TOKENS_BNB_TEST) {
            items.push(TOKEN_BNB(key, true));
        }
        return items;
    }
    if (chainId === CHAIN_ID.POLYGON_TEST) {
        for (const key in TOKENS_POLYGON_TEST) {
            items.push(TOKEN_POLYGON(key, true));
        }
        return items;
    }
    if (chainId === CHAIN_ID.NEAR_TEST) {
        for (const key in TOKENS_NEAR_TEST) {
            items.push(TOKEN_NEAR(key, true));
        }
        return items;
    }
    throw new Error(`AVAILABLE_TOKENS: unknown chain id: ${chainId}`);
}

/**
 * @param chainId
 * @constructor
 */
export const SUPPORT_TOKENS = (chainId: CHAIN_ID | string): Currency[] => {
    if (chainId){
        try {
            chainId = `${new Decimal(chainId).toNumber()}`
        } catch (e) {
        }
    }
    if (chainId === CHAIN_ID.ETH) {
        return [
            TOKEN_ETH(TOKEN_ID.NATIVE,false),
            TOKEN_ETH(TOKEN_ID.MAP,false),
        ]
    }
    if (chainId === CHAIN_ID.MAP_MAINNET) {
        return [
            TOKEN_MAP(TOKEN_ID.NATIVE,false),
            // TOKEN_MAP(TOKEN_ID.WRAP,false),
            TOKEN_MAP(TOKEN_ID.USDC,false),
            TOKEN_MAP(TOKEN_ID.USDT,false),
            TOKEN_MAP(TOKEN_ID.DAI,false),
        ];
    }
    if (chainId === CHAIN_ID.BNB_MAINNET) {
        return [
            TOKEN_BNB(TOKEN_ID.NATIVE, false),
            TOKEN_BNB(TOKEN_ID.USDC, false),
            TOKEN_BNB(TOKEN_ID.USDT, false),
            TOKEN_BNB(TOKEN_ID.MAP, false),
            TOKEN_BNB(TOKEN_ID.DAI, false),
        ];
    }
    if (chainId === CHAIN_ID.POLYGON_MAINNET) {
        return [
            TOKEN_POLYGON(TOKEN_ID.NATIVE, false),
            TOKEN_POLYGON(TOKEN_ID.USDC, false),
            TOKEN_POLYGON(TOKEN_ID.USDT, false),
            TOKEN_POLYGON(TOKEN_ID.DAI, false),
        ];
    }
    if (chainId === CHAIN_ID.NEAR_MAINNET) {
        return [
            TOKEN_NEAR(TOKEN_ID.NATIVE, false),
            TOKEN_NEAR(TOKEN_ID.MAP, false),
            TOKEN_NEAR(TOKEN_ID.USDC, false),
            TOKEN_NEAR(TOKEN_ID.USDT, false),
            TOKEN_NEAR(TOKEN_ID.DAI, false),
        ];
    }
    if (chainId === CHAIN_ID.ETH_PRIV) {
        return [];
    }
    if (chainId === CHAIN_ID.ETH_GOERLI) {
        return [
            TOKEN_GOERLI(TOKEN_ID.NATIVE),
            TOKEN_GOERLI(TOKEN_ID.USDC),
            TOKEN_GOERLI(TOKEN_ID.USDT),
        ];
    }
    if (chainId === CHAIN_ID.MAP_TEST) {
        return [
            TOKEN_MAP(TOKEN_ID.USDC),
            TOKEN_MAP(TOKEN_ID.USDT),
        ];
    }
    if (chainId === CHAIN_ID.BNB_TEST) {
        return [
            TOKEN_BNB(TOKEN_ID.NATIVE),
            TOKEN_BNB(TOKEN_ID.USDC),
            TOKEN_BNB(TOKEN_ID.USDT),
            TOKEN_BNB(TOKEN_ID.MOS),
        ];
    }
    if (chainId === CHAIN_ID.POLYGON_TEST) {
        return [
            TOKEN_POLYGON(TOKEN_ID.NATIVE),
            TOKEN_POLYGON(TOKEN_ID.USDC),
            TOKEN_POLYGON(TOKEN_ID.MOS),
            TOKEN_POLYGON(TOKEN_ID.USDT),
        ];
    }
    if (chainId === CHAIN_ID.NEAR_TEST) {
        return [
            TOKEN_NEAR(TOKEN_ID.NATIVE),
            TOKEN_NEAR(TOKEN_ID.MOST),
            TOKEN_NEAR(TOKEN_ID.USDC),
            TOKEN_NEAR(TOKEN_ID.USDT)
        ];
    }
    throw new Error(`SUPPORT_TOKENS: unknown chain id: ${chainId}`);
};

export const NEAR_CONNECT = (chainId: CHAIN_ID | string) => {
    const connectionConfig = {
        networkId: chainId === CHAIN_ID.NEAR_TEST ? 'testnet' : 'mainnet',
        nodeUrl: CHAINS(chainId).rpc,
    };
    if (!connectionConfig.networkId) {
        throw new Error(
            `NEAR_CONNECT: unknown chain id when querying near network: ${chainId}`
        );
    }
    return connectionConfig;
}

export const IS_MAP = (id: string): boolean => {
    if (id){
        try {
            id = `${new Decimal(id).toNumber()}`
        } catch (e) {
        }
    }
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
    if (id){
        try {
            id = `${new Decimal(id).toNumber()}`
        } catch (e) {
        }
    }
    switch (id) {
        case '1':
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
    if (id){
        try {
            id = `${new Decimal(id).toNumber()}`
        } catch (e) {
        }
    }
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
