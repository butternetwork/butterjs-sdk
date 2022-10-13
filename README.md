# BarterJS SDK
BarterJS SDK provides a set of tools written in typescript that help web3 applications give their users seamlessly cross-chain experience.

## Preview
The SDK is still under development, but here is a preview of what we provide.

### Cross-chain Exchange
Exchange cross-chain assets.  
[Barter Cross-chain Exchange Introduction](https://docs.barternetwork.io/products/BCES)
````tsx
async exchange(
    fromChain: string, // source chain
    toChain: string, // target chain
    tokenIn: Token, // the token provided
    tokenOut: Token, // the token needed 
    amountIn: BigNumber, // amount of token provided
    amountOutMin: BigNumber, // minimum amount of token needed
    toAddress: string, // recipient address on target chain
    exchangeOptions?: {} // exchange options(TBD)
): Promise<ExchangeReceipt>
````

### Omnichain Payment
Users pay whatever currency they like, you will always receive the cryptocurrency you want.  
[Barter Omnichain Payment System Introduction](https://docs.barternetwork.io/products/BOPS)
````tsx
async payment(
    fromChain: string, // source chain
    toChain: string, // target chain
    tokenIn: Token, // the token provided
    tokenOut: Token, // the token needed 
    amountIn: BigNumber, // amount of token provided
    amountOutMin: BigNumber, // minimum amount of token needed
    toAddress: string, // merchant's address on target chain
    paymentMethod: PaymentMethod, // payment method, fiat or crypto
    paymentOptions?: {} // payment options(TBD)
): Promise<PaymentReceipt>
````

### Barter Bridge/Chain Switcher
Bridge on-chain assets.  
[Barter Bridge Intro](https://docs.barternetwork.io/products/barter-bridge)  

#### Token Bridge
````tsx
async bridgeToken(
    fromChain: string, // source chain
    toChain: string, // target chain
    token: Token, // Token
    amount: BigNumber, // amount
    toAddress: string, // recipient address
    bridgeOptions?: {} // bridge options(TBD)
) Promise<BridgeReceipt>
````
#### NFT Bridge
coming soon.  


### Adding liquidity
Add cross-chain liquidity to our shared liquidity pool
````tsx
async addLiquidity(
    tokenA: Token, // token A
    tokenB: Token, // token B
    amountADesired: BigNumber, // The amount of tokenA to add as liquidity if the B/A price is <= amountBDesired/amountADesired (A depreciates).
    amountBDesired: BigNumber, // The amount of tokenB to add as liquidity if the A/B price is <= amountADesired/amountBDesired (B depreciates).
    amountAMin:BigNumber, // Bounds the extent to which the B/A price can go up before the transaction reverts. Must be <= amountADesired.
    amountBMin: BigNumber, // Bounds the extent to which the A/B price can go up before the transaction reverts. Must be <= amountBDesired.
    options?: {} // TBD
) Promise<LPReceipt>

````

*FYI: The above examples are not final, but just a teaser, all of the contents are subject to change in the future.*