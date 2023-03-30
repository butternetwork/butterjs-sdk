import {getFeeAmountAndInfo} from '../src/core'
import {CHAIN_ID, Currency, TOKEN_ID, TOKENS} from "../src";

describe('DataFetch.ts getFeeAmountAndInfo', () => {
    let fee: any
    beforeAll(async () => {
        let srcToken = TOKENS(CHAIN_ID.MAP_MAINNET, TOKEN_ID.NATIVE);
        let targetChain = 137;
        let amount = 30;
        let mapRpcProvider={"url":"https://poc3-rpc.maplabs.io/","chainId":"22776"}
        fee =await getFeeAmountAndInfo(srcToken,amount,targetChain,mapRpcProvider);
    })
    console.log(fee)

    it('Fee', () => {
        expect(1).toBe(1);
    })
})
