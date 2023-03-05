import {Chain, Currency} from "../beans";
import {
    CHAIN_ID as CID, CHAIN_NAME as CNM, TOKEN_ID as TID,
    TOKENS_BNB, TOKENS_BNB_TEST, TOKENS_GOERLI, TOKENS_MAP, TOKENS_MAP_TEST,
    TOKENS_NEAR, TOKENS_NEAR_TEST, TOKENS_POLYGON, TOKENS_POLYGON_TEST, TOKENS_PRIV
} from "./config";

export {CHAIN_ID, CHAIN_NAME, TOKEN_ID} from './config';

const TOKEN_PRIV = (tokenId: TID | string): Currency => {
    let current: any = TOKENS_PRIV[tokenId];
    if (current) {
        return ((current as Currency)).copy;
    }
    throw new Error(`Not Support this Token(${tokenId}) in ETH Priv Chain`)
}
const TOKEN_GOERLI = (tokenId: TID | string): Currency => {
    let current: any = TOKENS_GOERLI[tokenId];
    if (current) {
        return ((current as Currency)).copy;
    }
    throw new Error(`Not Support this Token(${tokenId}) in ETH Goerli Chain`)
}
const TOKEN_MAP = (tokenId: TID | string, isTest = true): Currency => {
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
const TOKEN_BNB = (tokenId: TID | string, isTest = true): Currency => {
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
const TOKEN_POLYGON = (tokenId: TID | string, isTest = true): Currency => {
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
const TOKEN_NEAR = (tokenId: TID | string, isTest = true): Currency => {
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

export const TO_CID = (str: CID | CNM | string) => {
    switch (str) {
        case CID.MAP_MAINNET:
        case CNM.MAP_MAINNET:
            return CID.MAP_MAINNET;
        case CID.BNB_MAINNET:
        case CNM.BNB_MAINNET:
            return CID.BNB_MAINNET;
        case CID.POLYGON_MAINNET:
        case CNM.POLYGON_MAINNET:
            return CID.POLYGON_MAINNET;
        case CID.NEAR_MAINNET:
        case CNM.NEAR_MAINNET:
            return CID.NEAR_MAINNET;
        case CID.ETH_PRIV:
        case CNM.ETH_PRIV:
            return CID.ETH_PRIV;
        case CID.ETH_GOERLI:
        case CNM.ETH_GOERLI:
            return CID.ETH_GOERLI;
        case CID.MAP_TEST:
        case CNM.MAP_TEST:
            return CID.MAP_TEST;
        case CID.BNB_TEST:
        case CNM.BNB_TEST:
            return CID.BNB_TEST;
        case CID.POLYGON_TEST:
        case CNM.POLYGON_TEST:
            return CID.POLYGON_TEST;
        case CID.NEAR_TEST:
        case CNM.NEAR_TEST:
            return CID.NEAR_TEST;
    }
    throw new Error(
        `TO_CID Unsupported network params: ${str}`
    );
}

export const CHAINS = (chainId: CID | string): Chain => {
    if (chainId === CID.MAP_MAINNET) {
        return new Chain(CID.MAP_MAINNET,
            'MAPO Mainnet', 'MAPO',
            'https://poc3-rpc.maplabs.io/',
            'https://makalu.mapscan.io/',
            'https://files.maplabs.io/bridge/map.png',
            CNM.MAP_MAINNET,
            TOKEN_MAP(TID.NATIVE, false),
        );
    }
    if (chainId === CID.BNB_MAINNET) {
        return new Chain(CID.BNB_MAINNET,
            'BNB Chain', 'BNB',
            'https://bsc-dataseed1.defibit.io/',
            'https://bscscan.com/',
            'https://uploads-ssl.webflow.com/62f34c32e8660c273054c17c/62fb88db22514137f2029167_bnb%20logo.png',
            CNM.BNB_MAINNET,
            TOKEN_BNB(TID.NATIVE, false),
        );
    }
    if (chainId === CID.POLYGON_MAINNET) {
        return new Chain(CID.POLYGON_MAINNET,
            'Polygon', 'MATIC',
            'https://polygon-rpc.com/',
            'https://polygonscan.com/',
            'https://cryptologos.cc/logos/polygon-matic-logo.png',
            CNM.POLYGON_MAINNET,
            TOKEN_POLYGON(TID.NATIVE, false),
        );
    }
    if (chainId === CID.NEAR_MAINNET) {
        return new Chain(CID.NEAR_MAINNET,
            'Near', 'NEAR',
            'https://rpc.mainnet.near.org',
            'https://explorer.near.org/',
            'https://cryptologos.cc/logos/near-protocol-near-logo.png',
            CNM.NEAR_MAINNET,
            TOKEN_NEAR(TID.NATIVE, false),
        );
    }
    if (chainId === CID.ETH_PRIV) {
        return new Chain(CID.ETH_PRIV,
            'Ethereum Private', 'ETH',
            'http://18.138.248.113:8545',
            '',
            'https://files.maplabs.io/bridge/eth.png',
            CNM.ETH_PRIV,
            TOKEN_PRIV(TID.NATIVE),
        );
    }
    if (chainId === CID.ETH_GOERLI) {
        return new Chain(CID.ETH_GOERLI,
            'Ethereum Goerli', 'ETH',
            'https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
            'https://goerli.etherscan.io/',
            'https://files.maplabs.io/bridge/eth.png',
            CNM.ETH_GOERLI,
            TOKEN_GOERLI(TID.NATIVE),
        );
    }
    if (chainId === CID.MAP_TEST) {
        return new Chain(
            CID.MAP_TEST,
            'MAPO Testnet', 'MAPO',
            'https://testnet-rpc.maplabs.io',
            'http://18.139.224.21:9001/',
            'https://files.maplabs.io/bridge/map.png',
            CNM.MAP_TEST,
            TOKEN_MAP(TID.NATIVE),
        );
    }
    if (chainId === CID.BNB_TEST) {
        return new Chain(
            CID.BNB_TEST,
            'BNB Chain Testnet', 'BNB',
            'https://rpc.ankr.com/bsc_testnet_chapel/9a12629301614050e76136dcaf9627f5ef215f86fb1185d908f9d232b8530ef7',
            'https://testnet.bscscan.com/',
            'https://uploads-ssl.webflow.com/62f34c32e8660c273054c17c/62fb88db22514137f2029167_bnb%20logo.png',
            CNM.BNB_TEST,
            TOKEN_BNB(TID.NATIVE),
        );
    }
    if (chainId === CID.POLYGON_TEST) {
        return new Chain(
            CID.POLYGON_TEST,
            'Polygon Testnet', 'MATIC',
            'https://rpc-mumbai.maticvigil.com/',
            'https://mumbai.polygonscan.com/',
            'https://cryptologos.cc/logos/polygon-matic-logo.png',
            CNM.POLYGON_TEST,
            TOKEN_POLYGON(TID.NATIVE),
        );
    }
    if (chainId === CID.NEAR_TEST) {
        return new Chain(
            CID.NEAR_TEST,
            'Near Testnet', 'NEAR',
            'https://rpc.testnet.near.org',
            'https://explorer.testnet.near.org/',
            'https://cryptologos.cc/logos/near-protocol-near-logo.png',
            CNM.NEAR_TEST,
            TOKEN_NEAR(TID.NATIVE),
        );
    }
    throw new Error(
        `Unsupported network chainId: ${chainId}`
    );

}

export const TOKENS = (chainId: CID | string, tokenId: TID | string): Currency | null => {
    if (chainId === CID.MAP_MAINNET) {
        return TOKEN_MAP(tokenId, false);
    }
    if (chainId === CID.BNB_MAINNET) {
        return TOKEN_BNB(tokenId, false);
    }
    if (chainId === CID.POLYGON_MAINNET) {
        return TOKEN_POLYGON(tokenId, false);
    }
    if (chainId === CID.NEAR_MAINNET) {
        return TOKEN_NEAR(tokenId, false);
    }
    if (chainId === CID.ETH_PRIV) {
        return TOKEN_PRIV(tokenId);
    }
    if (chainId === CID.ETH_GOERLI) {
        return TOKEN_GOERLI(tokenId);
    }
    if (chainId === CID.MAP_TEST) {
        return TOKEN_MAP(tokenId);
    }
    if (chainId === CID.BNB_TEST) {
        return TOKEN_BNB(tokenId);
    }
    if (chainId === CID.POLYGON_TEST) {
        return TOKEN_POLYGON(tokenId);
    }
    if (chainId === CID.NEAR_TEST) {
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
export const AVAILABLE_TOKENS = (chainId: CID | string): Currency[] => {
    let items = [];
    if (chainId === CID.MAP_MAINNET) {
        for (const key in TOKENS_MAP) {
            items.push(TOKEN_MAP(key, false));
        }
        return items;
    }
    if (chainId === CID.BNB_MAINNET) {
        for (const key in TOKENS_BNB) {
            items.push(TOKEN_BNB(key, false));
        }
        return items;
    }
    if (chainId === CID.POLYGON_MAINNET) {
        for (const key in TOKENS_POLYGON) {
            items.push(TOKEN_POLYGON(key, false));
        }
        return items;
    }
    if (chainId === CID.NEAR_MAINNET) {
        for (const key in TOKENS_NEAR) {
            items.push(TOKEN_NEAR(key, false));
        }
        return items;
    }
    if (chainId === CID.ETH_PRIV) {
        for (const key in TOKENS_PRIV) {
            items.push(TOKEN_PRIV(key));
        }
        return items;
    }
    if (chainId === CID.ETH_GOERLI) {
        for (const key in TOKENS_GOERLI) {
            items.push(TOKEN_GOERLI(key));
        }
        return items;
    }
    if (chainId === CID.MAP_TEST) {
        for (const key in TOKENS_MAP_TEST) {
            items.push(TOKEN_MAP(key, true));
        }
        return items;
    }
    if (chainId === CID.BNB_TEST) {
        for (const key in TOKENS_BNB_TEST) {
            items.push(TOKEN_BNB(key, true));
        }
        return items;
    }
    if (chainId === CID.POLYGON_TEST) {
        for (const key in TOKENS_POLYGON_TEST) {
            items.push(TOKEN_POLYGON(key, true));
        }
        return items;
    }
    if (chainId === CID.NEAR_TEST) {
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
export const SUPPORT_TOKENS = (chainId: CID | string): Currency[] => {
    if (chainId === CID.MAP_MAINNET) {
        return [];
    }
    if (chainId === CID.BNB_MAINNET) {
        return [TOKEN_BNB(TID.USDC, false)];
    }
    if (chainId === CID.POLYGON_MAINNET) {
        return [TOKEN_POLYGON(TID.USDC, false)];
    }
    if (chainId === CID.NEAR_MAINNET) {
        return [TOKEN_NEAR(TID.USDC, false)];
    }
    if (chainId === CID.ETH_PRIV) {
        return [];
    }
    if (chainId === CID.ETH_GOERLI) {
        return [
            TOKEN_GOERLI(TID.NATIVE),
            TOKEN_GOERLI(TID.USDC)
        ];
    }
    if (chainId === CID.MAP_TEST) {
        return [
            TOKEN_MAP(TID.USDC),
        ];
    }
    if (chainId === CID.BNB_TEST) {
        return [
            TOKEN_BNB(TID.NATIVE),
            TOKEN_BNB(TID.USDC),
            TOKEN_BNB(TID.BMOS),
        ];
    }
    if (chainId === CID.POLYGON_TEST) {
        return [
            TOKEN_POLYGON(TID.NATIVE),
            TOKEN_POLYGON(TID.USDC),
            TOKEN_POLYGON(TID.BMOS),
        ];
    }
    if (chainId === CID.NEAR_TEST) {
        return [
            TOKEN_NEAR(TID.NATIVE),
            TOKEN_NEAR(TID.USDC)
        ];
    }
    throw new Error(`SUPPORT_TOKENS: unknown chain id: ${chainId}`);
};

export const NEAR_CONNECT = (chainId: CID | string) => {
    const connectionConfig = {
        networkId: chainId === CID.NEAR_TEST ? 'testnet' : '',
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
    switch (id) {
        case CID.MAP_MAINNET:
        case CID.MAP_TEST:
            return true;
        default:
            return false;
    }
};

export const IS_NEAR = (id: string): boolean => {
    switch (id) {
        case CID.NEAR_TEST:
        case CID.NEAR_MAINNET:
            return true;
        default:
            return false;
    }
};

export const IS_EVM = (id: string): boolean => {
    switch (id) {
        case '1':
        case CID.POLYGON_MAINNET:
        case CID.BNB_MAINNET:
        case CID.MAP_MAINNET:
        case CID.BNB_TEST:
        case CID.POLYGON_TEST:
        case CID.MAP_TEST:
        case CID.ETH_GOERLI:
        case CID.ETH_PRIV:
            return true;
        default:
            return false;
    }
};

export const IS_MAINNET = (id: string): boolean => {
    switch (id) {
        case '1':
        case CID.MAP_MAINNET:
        case CID.BNB_MAINNET:
        case CID.POLYGON_MAINNET:
        case CID.NEAR_MAINNET:
            return true;
        default:
            return false;
    }

}
