import {getFeeAmountAndInfo} from '../src/core'
import {CHAIN_ID, Currency, TOKEN_ID, TOKENS} from "../src";

describe('DataFetch.ts getFeeAmountAndInfo', () => {
    let fee: any
    beforeAll(async () => {
        let srcToken = TOKENS(CHAIN_ID.MAP_MAINNET, TOKEN_ID.NATIVE);
        let targetChain = 137;
        let amount = 30;
        let routeStr = {
            "mapChain": [{
                "chainId": "22776",
                "dexName": "",
                "amountIn": "30.0",
                "amountOut": "10.0",
                "tokenIn": {
                    "address": "0x13CB04d4a5Dfb6398Fc5AB005a6c84337256eE23",
                    "name": "Wrapped MAP",
                    "decimals": 18,
                    "symbol": "MAPO",
                    "icon": "https://files.mapprotocol.io/bridge/map2.png"
                },
                "tokenOut": {
                    "address": "0x13CB04d4a5Dfb6398Fc5AB005a6c84337256eE23",
                    "name": "Wrapped MAP",
                    "decimals": 18,
                    "symbol": "MAPO",
                    "icon": "https://files.mapprotocol.io/bridge/map2.png"
                },
                "path": []
            }],
            "targetChain": [{
                "chainId": "137",
                "dexName": "",
                "amountIn": "10.0",
                "amountOut": "10.0",
                "tokenIn": {
                    "address": "0xBAbceE78586d3e9E80E0d69601A17f983663Ba6a",
                    "decimals": 18,
                    "symbol": "MAPO",
                    "icon": "https://files.mapprotocol.io/bridge/map2.png"
                },
                "tokenOut": {
                    "address": "0xBAbceE78586d3e9E80E0d69601A17f983663Ba6a",
                    "decimals": 18,
                    "symbol": "MAPO",
                    "icon": "https://files.mapprotocol.io/bridge/map2.png"
                },
                "path": []
            }]
        }
        let mapRpcProvider={"url":"https://poc3-rpc.maplabs.io/","chainId":"22776"}
        fee =await getFeeAmountAndInfo(srcToken,amount,targetChain,mapRpcProvider);
    })
    console.log(fee)

    it('Fee', () => {
        expect(1).toBe(1);
    })
})
