# BarterJS SDK
BarterJS SDK aims to facilitate the development of cross-chain functionality by letting developers integrate asset cross-chain feature in their application with minimal effort possible.

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
npm i --save-dev barterjs-sdk

# yarn
yarn add barterjs-sdk
```
<a name="tokenandchain"></a>
## Tokens and Chains 
Currently Barter only support limited chains and tokens and Barter will provide lists of supported chains and tokens in the format of constants.

```typescript
// To get supported blockchain id
const supportedChainIdList = SUPPORTED_CHAIN_IDS_LIST

// To get supported token list by chain id
const supportedTokenList = ID_TO_SUPPORTED_TOKEN(ChainId.Mainnet)
```

<a name="fees"></a>
## Fees
Barter charges a small fees for bridging or exchanging cross-chain assets. It is subject to what kind of token you want to bridge or swap.
<br>
### Bridging Fee
To get the bridging fee, use the following method:
```typescript
async function getBridgeFee(
    srcToken: BaseCurrency, // source token, can be the format of native coin or token
    targetChain: number, // target blockchain id
    amount: string, // amount to bridge, in minimal unit
    mapRpcProvider: BarterJsonRpcProvider // map relay chain rpc provider information
): Promise<BarterFee>

// Provider format
type BarterJsonRpcProvider = {
    chainId: number;
    url?: string; // use default if not presented
};

// return type
interface BarterFee {
    feeToken: BaseCurrency; // fee currency to charge, usally in the format of source token
    amount: string; // amount to charge
    feeDistribution?: BarterFeeDistribution; // fee distribution
}

type BarterFeeDistribution = {
    protocol: number; // base protocol fees in bps
    compensation: number; // gas compensation on target chain
    lp?: number;
};
```
##### Example: get the fee for bridging 1 Ether from Ehtereum Mainnet to BSC Mainnet.

```typescript
const mapRpcProvider = {
    url: 'http://18.142.54.137:7445',
    chainId: 212,
}

// get the fees for bridging one ether from Ethereum Mainnet to Binance Smart Chain
const fee: BarterFee = await getBridgeFee(
    Ether,
    ChainId.BSC_MAINNET,
    '1000000000000000000',
    mapRpcProvider
)

console.log("brige fee", fee);
``` 
##### Output
```
bridge fee {
    feeToken: Token {
        address: '0x0000000000000000000000000000000000000000',
            chainId: 1,
            decimals: 18,
            symbol: 'ETH',
            name: 'Ether',
            isNative: true,
            isToken: false
    },
    amount: '20000000000000',
    feeDistribution: {
        protocol: 1, // 0.01%
        compensation: 1 // 0.01%,
    }    
}

```
<a name="vaultbalance"></a>
## Vault Balance 
In Barter, we deploy one `Vault` smart contract for each blockchain we connected in order to hold asset on that chain. To get the balance of certain token in the vault
```typescript
async function getVaultBalance(
  fromChainId: number, // from chain id
  fromToken: BaseCurrency, // from token
  toChainId: number, // to chain id
  rpcProvider: BarterJsonRpcProvider // map relay chain rpc provider
): Promise<VaultBalance>;

// return type
interface VaultBalance {
  token: BaseCurrency; // vault token
  balance: string; // amount of token in target chain
}
```

##### Example: get the balance of Near native token in the vault of Near chain where source chain is Ethereum
```typescript
  const balance: VaultBalance = await getVaultBalance(
    ChainId.ETH_MAINNET,
    ETH_NEAR,
    ChainId.NEAR_MAINNET,
    provider
  );
  console.log('vault balance', balance);
```

##### Output:
```
vault balance {
  token: NearNativeCoin {
    address: '0x0000000000000000000000000000000000000000',
    chainId: 1313161556,
    decimals: 24,
    symbol: 'NEAR',
    name: 'NEAR',
    isNative: true,
    isToken: false
  },
  balance: '8000000000000000000000000'
}

```
<a name="assetbridge"></a>
## Asset Bridging
Barter Bridge allows bridging supported tokens from one blockchain to another.<br>

### Gas estimation
```typescript
async function gasEstimateBridgeToken({
    token,
    toChainId,
    toAddress,
    amount,
    options,
}: BridgeRequestParam): Promise<string>; // estimated gas in string
```
### Parameters
```typescript
// BridgeRequestParam
type BridgeRequestParam = {
    token: BaseCurrency;
    fromChainId: ChainId;
    toChainId: ChainId;
    toAddress: string;
    amount: string;
    options: BridgeOptions;
};

// BridgeOptions
type BridgeOptions = {
    signerOrProvider?: Signer | Provider | Eth; // When source chain is EVM provide Ethers.js Signer/Provider infor or Web3.js Eth info
    nearConfig?: NearNetworkConfig; // when source chain is Near, provide nearConfig Object
    gas?: string; // maunally input gas
};

// BarterContractCallReceipt
interface BarterContractCallReceipt {
    to: string;
    from: string;
    gasUsed: string;
    transactionHash: string;
    blockHash?: string;
    blockNumber?: number;
}
```

### bridgeToken
```typescript
async function bridgeToken({
    fromToken,
    toChainId,
    toAddress, // recipient address
    amount, // amount of 'fromToken' to bridge
    options,
}: BridgeRequestParam): Promise<BarterContractCallReceipt>;
 ```
for more detail on `BridgeRequestParam` and `BarterContractCallRecept`, please see [parameters](#bridgeparam).

##### Example: Bridge 1 ethNear from Ethereum Mainnet to Near Network so the `toAddress` will receive 1 native Near coin.

```typescript
// initiate BarterBridge Class
const bridge: BarterBridge = new BarterBridge();

// assemble bridge request parameters
const bridgeRequest: BridgeRequestParam = {
    fromToken: ETH_NEAR,
    fromChainId: ChainId.ETH_MAINNET,
    toChainId: ChainId.NEAR_MAINNET,
    toAddress: 'toaddress.near',
    amount: '1000000000000000000',
    options: {
      signerOrProvider: web3.eth, // here we use web3.js as example, but we are ethers.js compitable as well
      gas: '61795',
    },
};

const receipt: BarterContractCallReceipt = await bridge.bridgeToken(
    bridgeRequest
);

console.log('tx receipt', receipt);
```
##### Output:
```
tx receipt {
  to: '0x...726f1',
  from: '0x...386cc',
  gasUsed: '61795',
  blockHash: '0xeaf24e6311ed95390d0cc0d378214f2d4c4780fe052439d1ad6e9f811c6d2675',
  transactionHash: '0x40e351687cc6eeb8a59ba4ddf395711e6b3c6c328c908cd41d126977a24b59ac',
  blockNumber: 767820
}
```


<a name="crosschainswap"></a>
## Cross-chain Swap(Still Under Development)
<a name="getroute"></a>
### getSwapRoute 
get the best swap route calculated by Barter Smart Router

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
    useAggregator?: boolean; // whether Barter's Smart Router Aggregator or not
    gas?: string;
};

// return type: CrossChainSwapRoute
type CrossChainSwapRoute = {
    // source chain swap route. e.g. if source chain is Ethereum, this will be the swap route on Ethereum
    srcRoute: BarterSwapRoute;
    // swap route on MAP relay Chain
    relayRoute: BarterSwapRoute;
    // swap route on target chain. e.g. if target chain is Binance Smart Chain, this will be the route of BSC.
    targetRoute: BarterSwapRoute;
}
type BarterSwapRoute = {
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
### swap
do cross-chain swap
```typescript
async function omniSwap({
    ... // too long... omitted for simplicity
}: CrossChainSwapRoute) // the input is what we get after invoking getBestRoute
```
##### Example: swap 100 ethers on Ethereum Mainnet for at least 43200 nears on Near network
```typescript
const swapRouteRequest: SwapRouteRequestParam = {
    fromToken: ETH_MAINNET, 
    toToken: NEAR_MAINNET,
    amountIn: "100000000000000000000", // 100 ehter
    amountOutMin: "432000000000000000000000000000", // 43200 near
    options: {
        signerOrProvider,
        userAggregator: true,
    }
}

const bestRoute: CrossChainSwapRoute = getBestRoute(swapRouteRequest);

const result = await omniSwap(bestRoute);
```
<a name="omnipayment"></a>
## Omnichain Payment(Still Under Development) 
Pay whatever crypto users want, merchant will always get their desired token.
### getPaymentInfo
get minimal amount of token needed to meet required price, as well as the swap route.

```typescript
async function getPaymentInfo({
    paidToken: Token,
    requiredToken: Token,
    requiredAmount: string,
    toAddress: string,
    options: SwapOptions}: PaymentInfoRequest): Promise<PaymentInfo>

type PaymentInfo = {
    paidToken: Token
    amountInMin: string, // minimum amount of token needed to complete purchase
    swapRoute: CrossChainSwapRoute
}
```
For more information on `CrossChainSwapRoute`, please see [getSwapRoute](#getroute).

##### Example: get the payment info of Alice paying Ether on Ethereum Mainnet to get a NFT that requires Near coin as payment price at 100 $Near.
```typescript
const paymentInfoRequest: PaymentInfoRequest = {
    paidToken: Ether,
    requiredToken: Near,
    requiredAmount: '100000000000000000000000000', // 100 Near with 24 decimal
    toAddress: 'seller.near',
    options: {
        signerOrProvider: ethersSigner
    }
}

const paymentInfo: PaymentInfo = await getPaymentInfo(paymentInfoRequest);
console.log(paymentInfo);
```
##### Output
```
PaymentInfo: {
    paidToken: Ether,
    amountInMin: '400000000000000000', // at least 0.4 ether required
    swapRoute: ... // ommited, CrossChainSwapRoute for more info.
}
```

### payment
make a payment
```typescript
async function omniPay(paymentInfo: PaymentInfo);
```
##### Example: pay ether for a NFT on Near that requires 100 $Near.
```typescript
const paymentInfoRequest: PaymentInfoRequest = {
    paidToken: Ether,
    requiredToken: Near,
    requiredAmount: '100000000000000000000000000', // 100 Near with 24 decimal
    toAddress: 'seller.near',
    options: {
        signerOrProvider: ethersSigner
    }
}

const paymentInfo: PaymentInfo = await getPaymentInfo(paymentInfoRequest);

const result = await omniPay(paymentInfo);
```

***_Note: BarterJS SDK is still under development, all contents are subject to change. Stay tuned for our first relase!_***
