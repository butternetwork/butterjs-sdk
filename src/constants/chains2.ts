import {Chain, Currency, EVMCoin, NEARCoin} from "../beans";
import {BaseCurrency, Token} from "../entities";
import {ChainId} from "./chains";
import {EVMNativeCoin} from "../entities/native/EVMNativeCoin";
import {NearNativeCoin} from "../entities/native/Near";
import {
    BSC_MAINNET_USDC, BSC_TEST_BMOS, BSC_TEST_NATIVE, BSC_TEST_USDC, ETH_GOERLI_NATIVE, ETH_GOERLI_USDC,
    ETH_PRIV_LMAP,
    MAP_TEST_USDC,
    NEAR_MAINNET_USDC, NEAR_TEST_NATIVE, NEAR_TEST_USDC,
    POLYGON_MAINNET_USDC,
    POLYGON_TEST_BMOS, POLYGON_TEST_NATIVE, POLYGON_TEST_USDC
} from "./tokens";

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
    NATIVE = 'native',
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

const TOKEN_PRIV = (tokenId: TOKEN_ID | string): Currency => {
    if (tokenId === TOKEN_ID.NATIVE) {
        return new EVMCoin(CHAIN_ID.ETH_PRIV,
            18,
            'ETH',
            'ether',
            'https://files.maplabs.io/bridge/eth.png')
    }
    if (tokenId === TOKEN_ID.WRAP) {
        return new Token(CHAIN_ID.ETH_PRIV,
            '0xB59B98DF47432371A36A8F83fC7fd8371ec1300B',
            18,
            'WETH',
            'Wrapped ETH',
            'https://files.maplabs.io/bridge/eth.png'
        )
    }
    if (tokenId === TOKEN_ID.lMAP) {
        return new Token(CHAIN_ID.ETH_PRIV,
            '0xE1b2b81B66150F9EF5A89dC346a7A8B8df05d847',
            18,
            'lMAP',
            'Wrapped MAP Token',
            ''
        )
    }
    if (tokenId === TOKEN_ID.NEAR) {
        return new Token(CHAIN_ID.ETH_PRIV,
            '0x152fB50d334a66F7fD8559F6Dad057Ac13b3eD44',
            18,
            'bNear',
            'Wrapped Near Token',
            'https://s3-us-west-1.amazonaws.com/compliance-ico-af-us-west-1/production/token_profiles/logos/original/9d5/c43/cc-/9d5c43cc-e232-4267-aa8a-8c654a55db2d-1608222929-b90bbe4696613e2faeb17d48ac3aa7ba6a83674a.png'
        )
    }

    throw new Error(`Not Support this Token(${tokenId}) in ETH Priv Chain`)
}
const TOKEN_GOERLI = (tokenId: TOKEN_ID | string): Currency => {
    if (tokenId === TOKEN_ID.NATIVE) {
        return new EVMCoin(CHAIN_ID.ETH_GOERLI,
            18,
            'ETH',
            'ether',
            'https://files.maplabs.io/bridge/eth.png')
    }
    if (tokenId === TOKEN_ID.WRAP) {
        return new Token(CHAIN_ID.ETH_GOERLI,
            '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6',
            18,
            'wETH',
            'Wrapped Ether',
            'https://files.maplabs.io/bridge/eth.png'
        )
    }
    if (tokenId === TOKEN_ID.USDC) {
        return new Token(CHAIN_ID.ETH_GOERLI,
            '0xE66D4a30d177369d134e0E49a9096D357C0e8383',
            18,
            'bUSDC',
            'Butter USDC',
            'https://files.maplabs.io/bridge/usdc.png'
        )
    }

    throw new Error(`Not Support this Token(${tokenId}) in ETH Goerli Chain`)
}
const TOKEN_MAP = (tokenId: TOKEN_ID | string, isTest = true): Currency => {
    if (isTest) {
        if (tokenId === TOKEN_ID.NATIVE) {
            return new EVMCoin(CHAIN_ID.MAP_TEST,
                18,
                'MAPO',
                'MAP Protocol',
                'https://files.maplabs.io/bridge/map.png')
        }
        if (tokenId === TOKEN_ID.WRAP) {
            return new Token(
                CHAIN_ID.MAP_TEST,
                '0x2eD27dF9B4c903aB53666CcA59AFB431F7D15e91',
                18,
                'wMAPO',
                'Wrapped MAPO',
                'https://files.maplabs.io/bridge/map.png'
            )
        }
        if (tokenId === TOKEN_ID.USDC) {
            return new Token(
                CHAIN_ID.MAP_TEST,
                '0xd28c1187168dA9df1B7f6cb8495e659322D27c9F',
                18,
                'USDC',
                'USDC Circle',
                'https://files.maplabs.io/bridge/usdc.png'
            )
        }
        if (tokenId === TOKEN_ID.METH) {
            return new Token(
                CHAIN_ID.MAP_TEST,
                '0x41358EFc7d49d19F76E1E3bdD694f3bff9af3b36',
                18,
                'METH',
                'MAP ETH',
                'https://files.maplabs.io/bridge/eth.png'
            )
        }
        if (tokenId === TOKEN_ID.MOST) {
            return new Token(
                CHAIN_ID.MAP_TEST,
                '0xc74bc33a95a62D90672aEFAf4bA784285903cf09',
                18,
                'MOST',
                'MOST Token',
                'https://files.maplabs.io/bridge/usdc.png'
            )
        }
        if (tokenId === TOKEN_ID.NEAR) {
            return new Token(
                CHAIN_ID.MAP_TEST,
                '0xf1b33B4aB498e17C82bA903e5256533cBf51e1Fd',
                18,
                'Butter Near',
                'bNear',
                'https://s3-us-west-1.amazonaws.com/compliance-ico-af-us-west-1/production/token_profiles/logos/original/9d5/c43/cc-/9d5c43cc-e232-4267-aa8a-8c654a55db2d-1608222929-b90bbe4696613e2faeb17d48ac3aa7ba6a83674a.png'
            )
        }
        if (tokenId === TOKEN_ID.BNB) {
            return new Token(
                CHAIN_ID.MAP_TEST,
                '0xc0fAa9255A4099D50C2b356bFbD440B69359cEa3',
                18,
                'BNB',
                'MAPO BNB',
                'https://files.maplabs.io/bridge/bnb.png'
            )
        }
        throw new Error(`Not Support this Token(${tokenId}) in MAP`)
    }
    if (tokenId === TOKEN_ID.NATIVE) {
        return new EVMCoin(CHAIN_ID.MAP_MAINNET,
            18,
            'MAPO',
            'MAP Protocol',
            'https://files.maplabs.io/bridge/map.png')
    }
    if (tokenId === TOKEN_ID.WRAP) {
        return new Token(
            CHAIN_ID.MAP_MAINNET,
            '0x13CB04d4a5Dfb6398Fc5AB005a6c84337256eE23',
            18,
            'wMAPO',
            'Wrapped MAPO',
            'https://files.maplabs.io/bridge/map.png'
        )
    }
    if (tokenId === TOKEN_ID.USDC) {
        return new Token(
            CHAIN_ID.MAP_MAINNET,
            '0x424D3bcdC96F42aC919F276D7D4f6C94f24e0703',
            18,
            'USDC',
            'MAP USDC',
            'https://files.maplabs.io/bridge/usdc.png'
        )
    }
    throw new Error(`Not Support this Token(${tokenId}) in MAP`)
}
const TOKEN_BNB = (tokenId: TOKEN_ID | string, isTest = true): Currency => {
    if (isTest) {
        if (tokenId === TOKEN_ID.NATIVE) {
            return new EVMCoin(CHAIN_ID.BNB_TEST,
                18,
                'BNB',
                'BNB',
                'https://files.maplabs.io/bridge/bnb.png')
        }
        if (tokenId === TOKEN_ID.WRAP) {
            return new Token(CHAIN_ID.BNB_TEST,
                '0xae13d989dac2f0debff460ac112a837c89baa7cd',
                18,
                'BNB',
                'wBNB',
                'https://files.maplabs.io/bridge/bnb.png'
            )
        }
        if (tokenId === TOKEN_ID.BMOS) {
            return new Token(CHAIN_ID.BNB_TEST,
                '0x593F6F6748dc203DFa636c299EeA6a39C0734EEd',
                18,
                'BMOS',
                'Butter MOST',
                'https://logos-world.net/imageup/Bitcoin/Bitcoin-Logo-PNG14.png'
            )
        }
        if (tokenId === TOKEN_ID.NEAR) {
            return new Token(CHAIN_ID.BNB_TEST,
                '0xa064aA3F10dE46cb114E543A9f8D90770cFb0d7c',
                18,
                'Near',
                'Near',
                'https://s3-us-west-1.amazonaws.com/compliance-ico-af-us-west-1/production/token_profiles/logos/original/9d5/c43/cc-/9d5c43cc-e232-4267-aa8a-8c654a55db2d-1608222929-b90bbe4696613e2faeb17d48ac3aa7ba6a83674a.png'
            )
        }
        if (tokenId === TOKEN_ID.MOST) {
            return new Token(CHAIN_ID.BNB_TEST,
                '0x688f3Ef5f728995a9DcB299DAEC849CA2E49ddE1',
                18,
                'MOST',
                'MOST Token',
                'https://files.maplabs.io/bridge/usdc.png'
            )
        }
        if (tokenId === TOKEN_ID.MAP) {
            return new Token(CHAIN_ID.BNB_TEST,
                '0xad4c2B6e113113d345c167F7BdAA5A5D1cD00273',
                18,
                'MAPO',
                'BSC MAPO',
                'https://files.maplabs.io/bridge/map.png'
            )
        }

        throw new Error(`Not Support this Token(${tokenId}) in BNB Chain`)
    }
    if (tokenId === TOKEN_ID.NATIVE) {
        return new EVMCoin(CHAIN_ID.BNB_MAINNET,
            18,
            'BNB',
            'BNB',
            'https://files.maplabs.io/bridge/bnb.png')
    }
    if (tokenId === TOKEN_ID.WRAP) {
        return new Token(
            CHAIN_ID.BNB_MAINNET,
            '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
            18,
            'WBNB',
            'Wrapped BNB',
            'https://files.maplabs.io/bridge/bnb.png'
        )
    }
    if (tokenId === TOKEN_ID.USDC) {
        return new Token(
            CHAIN_ID.BNB_MAINNET,
            '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d',
            18,
            'USDC',
            'Binance-Peg USD Coin',
            'https://files.maplabs.io/bridge/usdc.png'
        )
    }
    throw new Error(`Not Support this Token(${tokenId}) in BNB Chain`)
}
const TOKEN_POLYGON = (tokenId: TOKEN_ID | string, isTest = true): Currency => {
    if (isTest) {
        if (tokenId === TOKEN_ID.NATIVE) {
            return new EVMCoin(CHAIN_ID.POLYGON_TEST,
                18,
                'MATIC',
                'Polygon',
                'https://files.maplabs.io/bridge/polygon.png')
        }
        if (tokenId === TOKEN_ID.WRAP) {
            return new Token(CHAIN_ID.POLYGON_TEST,
                '0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889',
                18,
                'WMATIC',
                'Wrapped Matic',
                'https://files.maplabs.io/bridge/polygon.png'
            )
        }
        if (tokenId === TOKEN_ID.BMOS) {
            return new Token(CHAIN_ID.POLYGON_TEST,
                '0xe1D8eAB4e616156E11e1c59D1a0E0EFeD66f4cfa',
                18,
                'BMOS',
                'Butter MOST',
                'https://logos-world.net/imageup/Bitcoin/Bitcoin-Logo-PNG14.png'
            )
        }
        if (tokenId === TOKEN_ID.MOST) {
            return new Token(CHAIN_ID.POLYGON_TEST,
                '0x6d4570191C7B5835226a0bE18734A8E922ff353B',
                18,
                'MOST',
                'MAP Omnichain Service Token',
                'https://files.maplabs.io/bridge/usdc.png'
            )
        }
        if (tokenId === TOKEN_ID.MAP) {
            return new Token(CHAIN_ID.POLYGON_TEST,
                '0xE6687528C7b85115a038D806339dd7E7b869B87C',
                18,
                'MAPO',
                'Matic-Pegged MAPO',
                'https://files.maplabs.io/bridge/map.png'
            )
        }

        throw new Error(`Not Support this Token(${tokenId}) in Polygon Chain`)
    }
    if (tokenId === TOKEN_ID.NATIVE) {
        return new EVMCoin(CHAIN_ID.POLYGON_MAINNET,
            18,
            'BNB',
            'BNB',
            'https://files.maplabs.io/bridge/bnb.png')
    }
    if (tokenId === TOKEN_ID.WRAP) {
        return new Token(
            CHAIN_ID.POLYGON_MAINNET,
            '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270',
            18,
            'WMATIC',
            'Wrapped Matic',
            'https://files.maplabs.io/bridge/polygon.png'
        )
    }
    throw new Error(`Not Support this Token(${tokenId}) in Polygon Chain`)
}
const TOKEN_NEAR = (tokenId: TOKEN_ID | string, isTest = true): Currency => {
    if (isTest) {
        if (tokenId === TOKEN_ID.NATIVE) {
            return new NEARCoin(CHAIN_ID.NEAR_TEST)
        }
        if (tokenId === TOKEN_ID.WRAP) {
            return new Token(CHAIN_ID.NEAR_TEST,
                'wrap.testnet',
                24,
                'wNear',
                'Wrapped Near',
                'https://s3-us-west-1.amazonaws.com/compliance-ico-af-us-west-1/production/token_profiles/logos/original/9d5/c43/cc-/9d5c43cc-e232-4267-aa8a-8c654a55db2d-1608222929-b90bbe4696613e2faeb17d48ac3aa7ba6a83674a.png'
            )
        }
        if (tokenId === TOKEN_ID.USDC) {
            return new Token(CHAIN_ID.NEAR_TEST,
                'usdc.map007.testnet',
                6,
                'USDC',
                'USD Circle',
                'https://files.maplabs.io/bridge/usdc.png'
            )
        }
        if (tokenId === TOKEN_ID.MOST) {
            return new Token(CHAIN_ID.NEAR_TEST,
                'most.mos2.mfac.maplabs.testnet',
                24,
                'MOST',
                'MOST Token',
                'https://files.maplabs.io/bridge/usdc.png'
            )
        }
        if (tokenId === TOKEN_ID.MAP) {
            return new Token(CHAIN_ID.NEAR_TEST,
                'mapo.maplabs.testnet',
                24,
                'MAPO',
                'NEAR MAPO',
                'https://files.maplabs.io/bridge/map.png'
            )
        }

        throw new Error(`Not Support this Token(${tokenId}) in Near Chain`)
    }
    if (tokenId === TOKEN_ID.NATIVE) {
        return new NEARCoin(CHAIN_ID.NEAR_MAINNET)
    }
    if (tokenId === TOKEN_ID.WRAP) {
        return new Token(
            CHAIN_ID.NEAR_MAINNET,
            'wrap.near',
            24,
            'wNear',
            'Wrapped Near',
            'https://s3-us-west-1.amazonaws.com/compliance-ico-af-us-west-1/production/token_profiles/logos/original/9d5/c43/cc-/9d5c43cc-e232-4267-aa8a-8c654a55db2d-1608222929-b90bbe4696613e2faeb17d48ac3aa7ba6a83674a.png'
        )
    }
    if (tokenId === TOKEN_ID.USDC) {
        return new Token(
            CHAIN_ID.NEAR_MAINNET,
            'a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.factory.bridge.near',
            6,
            'USDC',
            'USD Circle',
            'https://files.maplabs.io/bridge/usdc.png'
        )
    }
    throw new Error(`Not Support this Token(${tokenId}) in Near Chain`)
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

export const AVAILABLE_TOKENS = (chainId:  CHAIN_ID | string): Currency[] => {
    if (chainId === CHAIN_ID.MAP_MAINNET) {
        return[];
    }
    if (chainId === CHAIN_ID.BNB_MAINNET) {
        return [];
    }
    if (chainId === CHAIN_ID.POLYGON_MAINNET) {
        return [];
    }
    if (chainId === CHAIN_ID.NEAR_MAINNET) {
        return [];
    }
    if (chainId === CHAIN_ID.ETH_PRIV) {
        return [];
    }
    if (chainId === CHAIN_ID.ETH_GOERLI) {
        return [
            TOKEN_GOERLI(TOKEN_ID.NATIVE),
            TOKEN_GOERLI(TOKEN_ID.USDC),
            TOKEN_GOERLI(TOKEN_ID.WRAP)
        ];
    }
    if (chainId === CHAIN_ID.MAP_TEST) {
        return [
            TOKEN_MAP(TOKEN_ID.NATIVE),
            TOKEN_MAP(TOKEN_ID.WRAP),
            TOKEN_MAP(TOKEN_ID.USDC),
            TOKEN_MAP(TOKEN_ID.MOS),
            TOKEN_MAP(TOKEN_ID.BNB),
            TOKEN_MAP(TOKEN_ID.NEAR),
        ];
    }
    if (chainId === CHAIN_ID.BNB_TEST) {
        return [
            TOKEN_BNB(TOKEN_ID.NATIVE),
            TOKEN_BNB(TOKEN_ID.WRAP),
            TOKEN_BNB(TOKEN_ID.MAP),
            TOKEN_BNB(TOKEN_ID.USDC),
            TOKEN_BNB(TOKEN_ID.BMOS),
            TOKEN_BNB(TOKEN_ID.MOST),
        ];
    }
    if (chainId === CHAIN_ID.POLYGON_TEST) {
        return [
            TOKEN_POLYGON(TOKEN_ID.WRAP),
            TOKEN_POLYGON(TOKEN_ID.USDC),
            TOKEN_POLYGON(TOKEN_ID.BMOS),
            TOKEN_POLYGON(TOKEN_ID.MAP),
            TOKEN_MAP(TOKEN_ID.NATIVE),
        ];
    }
    if (chainId === CHAIN_ID.NEAR_TEST) {
        return [
            TOKEN_NEAR(TOKEN_ID.NATIVE),
            TOKEN_NEAR(TOKEN_ID.USDC),
            TOKEN_NEAR(TOKEN_ID.MOST),
            TOKEN_NEAR(TOKEN_ID.WRAP),
            TOKEN_NEAR(TOKEN_ID.MAP),
        ];
    }
    throw new Error(`AVAILABLE_TOKENS: unknown chain id: ${chainId}`);
}

export const SUPPORT_TOKENS = (chainId:  CHAIN_ID | string): Currency[] => {
    if (chainId === CHAIN_ID.MAP_MAINNET) {
        return[];
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
        case ChainId.MAP_MAINNET:
        case ChainId.BSC_MAINNET:
        case ChainId.POLYGON_MAINNET:
        case ChainId.NEAR_MAINNET:
            return true;
        default:
            return false;
    }

}
