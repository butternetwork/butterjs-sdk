# ButterJS SDK
ButterJS SDK aims to facilitate the development of cross-chain functionality by letting developers integrate asset cross-chain feature in their application with minimal effort possible.

## Table of Contents
1. [Installation](#installation)
2. [Tokens and Chains](#tokenandchain)
3. [Fees](#fees)
4. [Vault Balance](#vaultbalance)
5. [Asset Bridging](#assetbridge)
6. [Cross-chain Swap(Still Under Development)](#crosschainswap)
7. [Omnichain Payment(Still Under Development)](#omnipayment)




<a name="installation"></a>
## Installation
```shell
# npm
npm i --save-dev butterjs-sdk

# yarn
yarn add butterjs-sdk
```
<a name="tokenandchain"></a>
## Tokens and Chains
Currently Butter only support limited chains and tokens and Butter will provide lists of supported chains and tokens in the format of constants.
<br>

```typescript
// To get supported blockchain id
const supportedChainIdList: Chain[] = SUPPORTED_CHAIN_LIST

// return value would be a array of Chain objects as follows:
const BSC_MAINNET_CHAIN = new Chain(
    ChainId.BSC_MAINNET,
    'BSC Mainnet',
    'https://bsc-dataseed1.defibit.io/',
    'https://bscscan.com/',
    'https://files.maplabs.io/bridge/bsc.png',
    'BNB'
);

// To get supported token list by chain id
const supportedTokenList: Token[] = ID_TO_SUPPORTED_TOKEN('1')
// the above will list all the supported token with chainId = 1, 
// note here we use string as parameter type.

// return value would be an array of Token Object as follows
const BSC_MAINNET_WBNB = new Token(
    ChainId.BSC_MAINNET,
    '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
    18,
    'WBNB',
    'Wrapped BNB',
    'https://files.maplabs.io/bridge/bnb.png'
);
```

<a name="fees"></a>
## Fees
Butter charges a small fees for bridging cross-chain assets. It is subject to the destination chain of your transfer. This fee is to compensate the 'messenger' that pre-paid the gas fee on the destination chain.
<br>
### Bridging Fee
To get the bridging fee, use the following method:
```typescript
async function getBridgeFee(
    srcToken: BaseCurrency, // source token, can be the format of native coin or token
    targetChain: string, // target blockchain id
    amount: string, // amount to bridge, in minimal unit
    mapRpcProvider: ButterJsonRpcProvider // map relay chain rpc provider information
): Promise<ButterFee>

// Provider format
type ButterJsonRpcProvider = {
    chainId: number;
    // note here should provide the RPC URL for MAP Relay Chain,
    // since all the fee info is stored on MAP Relay Chain
    url?: string; // use default if not presented, 
};

// return type
interface ButterFee {
    feeToken: BaseCurrency; // fee currency to charge, usally in the format of source token
    amount: string; // amount to charge
    feeRate: ButterFeeRate;
    feeDistribution?: ButterFeeDistribution; // fee distribution, only swap has this field, bridge does not any distribution
}

export type ButterFeeRate = {
    lowest: string; // lowest amount of token to charge
    highest: string; // highest amount of token to charge
    rate: string; // fee rate in bps
};

type ButterFeeDistribution = {
    protocol: number; // base protocol fees in bps
    compensation: number; // gas compensation on target chain
};
```
##### Example: get the fee for bridging 1 USDC from BSC Mainnet to Polygon.

```typescript
// MAP Relay Chain Mainnet Provider
const mapRpcProvider = {
    url: 'https://poc2-rpc.maplabs.io', 
    chainId: 22776,
}

// get the fees for bridging one ether from Ethereum Mainnet to Binance Smart Chain
const fee: ButterFee = await getBridgeFee(
    BSC_MAINNET_USDC, // srcToken
    ChainId.POLYGON_MAINNET, // targetChain
    '1000000000000000000', // amount in minimum unit, here is 3 usdc
    mapRpcProvider
)

console.log("brige fee", fee);
``` 
##### Output

```
bridge fee {
  feeToken: Token {
    address: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d',
    chainId: '56',
    decimals: 18,
    symbol: 'USDC',
    name: 'Binance-Peg USD Coin',
    logo: 'https://files.maplabs.io/bridge/usdc.png',
    isNative: false,
    isToken: true
  },
  feeRate: {
    lowest: '200000000000000000', // lowest amount of feeToken to charge
    rate: '10', // fee rate in bps, here would be 0.1%
    highest: '1000000000000000000' // highest amount of feeToken to charge
  },
  amount: '200000000000000000' // fee amount in feeToken
}

// This means bridging USDC from BSC to Ethereum charge a feee of 0.1%, with minimum 0.2 usdc and maximum 1 usdc.
// In this case bridging 1 usdc would have a fee of 0.2 usdc, user will get 0.8 usdc after the fee deduction.

```
<a name="vaultbalance"></a>
## Vault Balance
In Butter, we deploy one `Vault` smart contract for each blockchain we connected in order to hold asset on that chain. To get the balance of certain token in the vault
```typescript
const mapRpcProvider = {
    url: 'https://poc2-rpc.maplabs.io',
    chainId: 22776,
}

async function getVaultBalance(
  fromChainId: string, // from chain id
  fromToken: BaseCurrency, // from token
  toChainId: string, // to chain id
  mapRpcProvider: ButterJsonRpcProvider // map relay chain rpc provider
): Promise<VaultBalance>;

// return type
interface VaultBalance {
  token: BaseCurrency; // vault token
  balance: string; // amount of token in target chain
  isMintable: boolean; // if token is mintable by 'Vault' on from chain.
}
```

##### Example: get how many USDC tokens in our vault is available to transfer from Ethereum to BSC
```typescript
  const balance: VaultBalance = await getVaultBalance(
    ChainId.ETH_MAINNET,
    ETH_MAINNET_USDC,
    ChainId.BSC_MAINNET,
    mapProvider
  );
  console.log('vault balance', balance);
```

##### Output:
```
vault balance {
  feeToken: Token {
    address: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d',
    chainId: '56',
    decimals: 18,
    symbol: 'USDC',
    name: 'Binance-Peg USD Coin',
    logo: 'https://files.maplabs.io/bridge/usdc.png',
    isNative: false,
    isToken: true
  },
  balance: '100000000000000000000',
  isMintable: false
}

// this represents there are 100 USDC available to transfer from ETH to BSC

```
<a name="assetbridge"></a>
## Asset Bridging
Butter Bridge allows bridging supported tokens from one blockchain to another.<br>

### Gas estimation
```typescript
async function gasEstimateBridgeToken({
    fromAddress,
    fromToken,
    fromChainId,
    toChainId,
    toAddress,
    amount,
    options,
}: BridgeRequestParam): Promise<string>; // estimated gas in string
```
<a name = "bridgeparam"></a>
### Bridge Token
```typescript
async function bridgeToken({
    fromAddress,
    fromToken,
    fromChainId,
    toChainId,
    toAddress, // recipient address
    amount, // amount of 'fromToken' to bridge
    options,
}: BridgeRequestParam): Promise<ButterTransactionResponse>;
 ```
### Parameters
```typescript
// BridgeRequestParam
type BridgeRequestParam = {
    fromAddress: string; // from account address
    token: BaseCurrency; // token to bridge
    fromChainId: string; // from chain id 
    toChainId: string; // to chain id
    toAddress: string; // to address
    amount: string; // amount to bridge
    options: BridgeOptions;
};

// BridgeOptions
type BridgeOptions = {
    // Provide Signer or Provider if you are using ethers.js
    // Provide Eth if you are using web3.js
    signerOrProvider?: Signer | Provider | Eth; // EVM chain signerOrProvider
    
    // Provide WalletConnection if you are connecting through frontend wallet
    // Provide NearNetworkConfig if you are connecting through KeyStore
    // Note Near does not support gas estimation yet.
    nearProvider?: NearNetworkConfig | WalletConnection; // when source chain is Near, provide nearConfig Object
    gas?: string; // maunally input gas
    gasPrice?: string; // gas price
};

```
<a name = "txresult"></a>
### Transaction Return Type
```typescript
// ButterTransactionResponse
interface ButterTransactionResponse {
    hash?: string; // transaction hash
    wait?: () => Promise<ButterTransactionReceipt>; // wait function if using ethers.js or near
    promiReceipt?: PromiEvent<Web3TransactionReceipt>; // promiEvent if web3.js
}

export interface ButterTransactionReceipt {
    to: string;
    from: string;
    gasUsed: string;
    transactionHash: string;
    logs: Array<Log> | string[]; // Array<Log> for evm blockchains, string[] for near logs
    blockHash?: string;
    blockNumber?: number;
    success?: boolean; // 1 success, 0 failed
}

```


for more detail on `BridgeRequestParam` and `ButterTransactionResponse`, please see [parameters](#bridgeparam) and [transaction return type](#txresult).

##### Example1: Bridge 1 USDC from Ethereum Mainnet to BSC using web3.js

```typescript
// initiate ButterBridge Class
import {ButterTransactionResponse} from "./responseTypes";
import {PromiEvent} from "web3-core";

const bridge: ButterBridge = new ButterBridge();

// assemble bridge request parameters
const bridgeRequest: BridgeRequestParam = {
    fromToken: ETH_MAINNET_USDC,
    fromChainId: ChainId.ETH_MAINNET,
    toChainId: ChainId.BSC_MAINNET,
    toAddress: '0x...',
    amount: '1000000',
    options: {
        signerOrProvider: web3.eth, // here we use web3.js as example
    },
};

const response: ButterTransactionResponse = await bridge.bridgeToken(
    bridgeRequest
);

const promiReceipt: PromiEvent<TransactionReceipt> = response.promiReceipt!;

await promiReceipt
    .on('transactionHash', function (hash: string) {
        console.log('hash', hash);
    })
    .on('receipt', function (receipt: any) {
        console.log('receipt', receipt);
    });

```
##### Output:
```
hash 0x..... // transaction hash
receipt { // web3.js TransactionReceipt
    status: boolean;
    transactionHash: string;
    transactionIndex: number;
    blockHash: string;
    blockNumber: number;
    from: string;
    to: string;
    contractAddress?: string;
    cumulativeGasUsed: number;
    gasUsed: number;
    effectiveGasPrice: number;
    logs: Log[]..;
    logsBloom: string;
    events?: {
        [eventName: string]: EventLog;
    };
}
```

##### Example2: Bridge 1 USDC from Ethereum Mainnet to BSC using ethers.js

```typescript
// initiate ButterBridge Class
import {ButterTransactionReceipt, ButterTransactionResponse} from "./responseTypes";
import {PromiEvent} from "web3-core";

const bridge: ButterBridge = new ButterBridge();

// assemble bridge request parameters
const bridgeRequest: BridgeRequestParam = {
    fromToken: ETH_BSC,
    fromChainId: ChainId.ETH_MAINNET,
    toChainId: ChainId.BSC_MAINNET,
    toAddress: '0x...',
    amount: '1000000000000000000',
    options: {
        signerOrProvider: ethers.signer, // here we use ethers.js as example
    },
};

const response: ButterTransactionResponse = await bridge.bridgeToken(
    bridgeRequest
);
console.log("transaction hash", response.hash!)

const receipt: ButterTransactionReceipt = await response.wait!();
console.log('receipt', receipt)

```
##### Output:
```
transaction hash 0x..... 
receipt {
  to: string;
  from: string;
  gasUsed: string;
  transactionHash: string;
  blockHash?: string;
  blockNumber?: number;
  success?: boolean; // 1 success, 0 failed
}
```

<a name="crosschainswap"></a>
## Cross-chain Swap(Still Under Development)
<a name="getroute"></a>
### getSwapRoute
get the best swap route calculated by Butter Smart Router

```typescript
// get best route method
function getBestRoute(
    {
        fromToken: BaseCurrency,
        toToken: BaseCurrency,
        amountIn: string,
        amountOutMin: string,
        tradeType: TradeType,
        options: SwapOptions
    }: SwapRouteRequest
): Promise<CrossChainSwapRoute>;

// TradeType
export enum TradeType {
    EXACT_INPUT = 0,	// regular direction，fromToken -> toToken
    EXACT_OUTPUT = 1,	// reverse direction, toToken -> fromToken
}

// SwapOptions
type SwapOptions = {
    signerOrProvider?: Signer | Provider | Eth; // When source chain is EVM provide Ethers.js Signer/Provider infor or Web3.js Eth info
    nearConfig?: NearNetworkConfig; // mandatory when src chain is near
    useAggregator?: boolean; // whether Butter's Smart Router Aggregator or not
    gas?: string;
};

// return type: CrossChainSwapRoute
type CrossChainSwapRoute = {
    // source chain swap route. e.g. if source chain is Ethereum, this will be the swap route on Ethereum
    srcRoute: ButterSwapRoute;
    // swap route on MAP relay Chain
    relayRoute: ButterSwapRoute;
    // swap route on target chain. e.g. if target chain is Binance Smart Chain, this will be the route of BSC.
    targetRoute: ButterSwapRoute;
}
type ButterSwapRoute = {
    /**
     * The quote for the swap.
     * For EXACT_IN swaps this will be an amount of token out.
     * For EXACT_OUT this will be an amount of token in.
     */
    quote: string;
    /**
     * The quote adjusted for the estimated gas used by the swap.
     * This is computed by estimating the amount of gas used by the swap, converting
     * this estimate to be in terms of the quote token, and subtracting that from the quote.
     * i.e. quoteGasAdjusted = quote - estimatedGasUsedQuoteToken
     */
    quoteGasAdjusted: string;
    /**
     * The estimate of the gas used by the swap.
     */
    estimatedGasUsed: string;
    /**
     * The estimate of the gas used by the swap in terms of the quote token.
     */
    estimatedGasUsedQuoteToken: string;
    /**
     * The estimate of the gas used by the swap in USD.
     */
    estimatedGasUsedUSD: string;
    /**
     * The gas price used when computing quoteGasAdjusted, estimatedGasUsedQuoteToken, etc.
     */
    gasPrice: string;
    /**
     * The routes of the swap.
     */
    route: RouteWithValidQuote[];
    /**
     * The block number used when computing the swap.
     */
    blockNumber: string;
    /**
     * Dex name that doing the swap, e.g. Uniswap, Pancakeswap, etc...
     */
    platform: string;
};

// RouteWithValidQuote
class RouteWithValidQuote {
    public amount: string; // amountIn
    public quote: string; // amountOut
    public percent: number; // percentage of the total amountIn
    public route: Route; // swap route
    public quoteToken: Token;
    public gasEstimate: BigNumber;
    public gasCostInToken: string;
    public gasCostInUSD: string;
    public tradeType: TradeType;
    public poolAddresses: string[]; // pool address for perfoming the swap
    public tokenPath: Token[]; // corresponding 
}

class Route {
    pairs: Pair[]
    path: Token[]
}

class Pair {
    // the current mid price of the pair in terms of token0, i.e. the ratio of reserve1 to reserve0
    token0Price: string;
    // the current mid price of the pair in terms of token1, i.e. the ratio of reserve0 to reserve1
    token1Price: string;
    chainId: number;
    token0: Token;
    token1: Token;
    reserve0: string;
    reserve1: string;
}
```
##### Example: Get the best route swapping 100 Ether on Ethereum Mainnet for at least 43200 Near on Near Network

```typescript
const swapRouteRequest: SwapRouteRequest = {
    fromToken: ETH_MAINNET, 
    toToken: NEAR_MAINNET,
    amountIn: "100000000000000000000", // 100 ehter
    amountOutMin: "432000000000000000000000000000", // 43200 near
    tradeType: TradeType.EXACT_IN,
    options: {
        signerOrProvider,
        userAggregator: true,
    }
}

const bestRoute: CrossChainSwapRoute = getBestRoute(SwapRouteRequest);
console.log(bestRoute);
```
##### Output
```
CrossChainSwapRoute: {
  // srcRoute: swap 100 ether for 134000 usdt on Uniswap      
  srcRoute: {
    quote: '134000000000000000000000',
    quoteGasAdjusted: '134000000000000000000000',
    estimatedGasUsed: '10000',
    estimatedGasUsedQuoteToken: '0.5',
    estimatedGasUsedUSD: '0.5',
    gasPrice: "90",
    // swap route
    route: [
      amount: '100000000000000000000', // amountIn in ether: 100 ether in
      quote: '134000000000000000000000', // amountOut in USDT: 134000 USDT out
      percent: 100, // swap 100% percent of provided token in this route
      route: {
        pairs: [
          token0Price: '1345',
          token1Price: '1',
          chainId: 1,
          token0: Ether,
          token1: USDT,
          reserve0: '123456000000000000000000', // reserve of Ether
          reserve1: '165431040000000000000000000', // reserve of USDT
        ]
        path: [
          Ether,
          USDT
        ]
      },
      quoteToken: USDT,
      gasEstimate: 10000,
      gasCostInToken: '0.5',
      gasCostInUSD: '0.5'',
      tradeType: 'EXACT_IN',
      poolAddresses: '0xabc......123;, // pool address for perfoming the swap
      tokenPath: [Ether, USDT],
    ],
    blockNumber: 123456,
    platform: "Uniswap",
  },
  // swap route on MAP Relay Chain: swap 1340 mapUSDT for 1340 mapUSDC
  relayRoute: {
    quote: '134000000000000000000000',
    quoteGasAdjusted: '134000000000000000000000',
    estimatedGasUsed: '10000',
    estimatedGasUsedQuoteToken: '0.01',
    estimatedGasUsedUSD: '0.01',
    gasPrice: "90",
    // swap route
    route: [
      amount: '134000000000000000000000', // amountIn in mapUSDT: 134000 mapUSDT in
      quote: '134000000000000000000000', // amountOut in mapUSDC: 134000 mapUSDC out
      percent: 100, // swap 100% percent of provided token in this route
      route: {
        pairs: [
          token0Price: '1',
          token1Price: '1',
          chainId: 34434, // map relay chain id
          token0: MAP_USDT,
          token1: MAP_USDC,
          reserve0: '123456000000000000000000', // reserve of Ether
          reserve1: '123456000000000000000000', // reserve of USDT
        ]
        path: [
          MAP_USDT,
          MAP_USDC
        ]
      },
      quoteToken: USDT,
      gasEstimate: 10000,
      gasCostInToken: '0.01',
      gasCostInUSD: '0.01'',
      tradeType: 'EXACT_IN',
      poolAddresses: '0xabc......123;, // pool address for perfoming the swap
      tokenPath: [MAP_USDT, MAP_USDC],
    ],
    blockNumber: 23331,
    platform: "MAP Relay Chain",
  }
  // target route on Near: swap 134000 usdc for 43200 near
  targetRoute: {
    quote: '43200000000000000000000000000',
    quoteGasAdjusted: '43200000000000000000000000000',
    estimatedGasUsed: '10000',
    estimatedGasUsedQuoteToken: '0.03',
    estimatedGasUsedUSD: '0.1',
    gasPrice: "90",
    // swap route swap 134000 usdc for 43200 near on Ref.fi
    route: [
      amount: '134000000000000000000000', // amountIn in USDC: 134000 USDC in
      quote: '43200000000000000000000000000', // amountOut in Near: 43200 near out
      percent: 100, // swap 100% percent of provided token in this route
      route: {
        pairs: [
          token0Price: '1',
          token1Price: '1',
          chainId: 1313161556, // near chain id
          token0: NEAR_USDC,
          token1: NEAR,
          reserve0: '123456000000000000000000', // reserve of Ether
          reserve1: '123456000000000000000000', // reserve of USDT
        ]
        path: [
          NEAR_USDC,
          NEAR
        ]
      },
      quoteToken: USDT,
      gasEstimate: 10000,
      gasCostInToken: '0.01',
      gasCostInUSD: '0.01'',
      tradeType: 'EXACT_IN',
      poolAddresses: 'pool.near;, // pool address for perfoming the swap
      tokenPath: [NEAR_USDC, NEAR],
    ],
    blockNumber: 234556,
    platform: "Ref Finance",
  },
}
```