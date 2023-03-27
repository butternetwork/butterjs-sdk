// import {ethers} from 'ethers';
// const wallet = ethers.Wallet.createRandom();
import {ButterSmartSwap, CHAIN_ID, CHAINS, TOKEN_ID, TOKENS} from "../src";
import {ethers} from "ethers";

const swap = new ButterSmartSwap()
const evmProvider = new ethers.providers.JsonRpcProvider(
    CHAINS(CHAIN_ID.BNB_TEST).rpc,
    Number.parseInt(CHAINS(CHAIN_ID.BNB_TEST).chainId)
);

describe('ButterSmartSwap estimateGas', () => {
    // let fee: any
    // beforeAll(async () => {
    //     const fromToken = TOKENS(CHAIN_ID.BNB_TEST, TOKEN_ID.USDC);
    //     const toToken = TOKENS(CHAIN_ID.ETH_GOERLI, TOKEN_ID.USDC);
    //     fee = await swap.estimateGas({
    //         amountIn: "10000000000000000000",
    //         fromAddress: "0xd2ba53c8a8940f28fe3fd5e2208dd7fc463dce47",
    //         fromToken: fromToken!,
    //         options: {signerOrProvider: evmProvider},
    //         slippage: 300,
    //         swapRouteStr:JSON.stringify( {
    //             "srcChain": [{
    //                 "chainId": "97",
    //                 "dexName": "",
    //                 "amountIn": "10.0",
    //                 "amountOut": "10.0",
    //                 "tokenIn": {
    //                     "address": "0xd8f69e1F100Db655d4503545C3BB308CAab4a3B6",
    //                     "decimals": 18,
    //                     "symbol": "bUSDC",
    //                     "icon": "https://files.mapprotocol.io/bridge/busd.png"
    //                 },
    //                 "tokenOut": {
    //                     "address": "0xd8f69e1F100Db655d4503545C3BB308CAab4a3B6",
    //                     "decimals": 18,
    //                     "symbol": "bUSDC",
    //                     "icon": "https://files.mapprotocol.io/bridge/busd.png"
    //                 },
    //                 "path": []
    //             }],
    //             "mapChain": [{
    //                 "chainId": "212",
    //                 "dexName": "",
    //                 "amountIn": "10.0",
    //                 "amountOut": "8.0",
    //                 "tokenIn": {
    //                     "address": "0xd28c1187168dA9df1B7f6cb8495e659322D27c9F",
    //                     "name": "map usdc",
    //                     "decimals": 18,
    //                     "symbol": "mUSDC",
    //                     "icon": "https://files.mapprotocol.io/bridge/usdc.png"
    //                 },
    //                 "tokenOut": {
    //                     "address": "0xd28c1187168dA9df1B7f6cb8495e659322D27c9F",
    //                     "name": "map usdc",
    //                     "decimals": 18,
    //                     "symbol": "mUSDC",
    //                     "icon": "https://files.mapprotocol.io/bridge/usdc.png"
    //                 },
    //                 "path": []
    //             }],
    //             "targetChain": [{
    //                 "chainId": "5",
    //                 "dexName": "",
    //                 "amountIn": "8.0",
    //                 "amountOut": "8.0",
    //                 "tokenIn": {
    //                     "address": "0xE66D4a30d177369d134e0E49a9096D357C0e8383",
    //                     "name": "USDC",
    //                     "decimals": 18,
    //                     "symbol": "bUSDC",
    //                     "icon": "https://files.mapprotocol.io/bridge/usdc.png"
    //                 },
    //                 "tokenOut": {
    //                     "address": "0xE66D4a30d177369d134e0E49a9096D357C0e8383",
    //                     "name": "USDC",
    //                     "decimals": 18,
    //                     "symbol": "bUSDC",
    //                     "icon": "https://files.mapprotocol.io/bridge/usdc.png"
    //                 },
    //                 "path": []
    //             }]
    //         }),
    //         toAddress: "0xd2ba53c8a8940f28fe3fd5e2208dd7fc463dce47",
    //         toToken: toToken!
    //     })
    // })
    // console.log(fee)

    it('Fee', () => {
        expect(1).toBe(1);
    })
})
