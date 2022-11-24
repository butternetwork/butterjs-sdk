# Butter Swap流程详解

我们拿\$BNB 换 \$Near举例



## Butter智能路由计算最佳Swap路径

 根据用户输入规划最佳跨链Swap路径，路径分两类:

### 	类1. Direct Swap直接兑换

当MAP Relay Chain中有特定流动性时，则直接兑换, 比如MAP上有 \$mBNB和\$mNear的token pair

### 	类2. Aggregate Swap聚合兑换

若MAP中没有 \$mBNB和\$mNear的token pair, 则需要借助BSC和Near上的dex流动性完成兑换





## MOS中做跨链Swap

同样分两种情况，direct swap和aggregate swap

### 1. Direct Swap

直接兑换说明MAP上有特定流动性，比如MAP中有\$mBNB -> \$mNear的流动性池，此时流程如下

​	a. 调用bsc mos的swapOut[Native/Token]方法, 逻辑和transferOut基本一致，将用户提供的$BNB锁住，并emit新的mapSwapOutEvent。

​	b. Messenger监听swapOut事件，调用MAP mos的swapIn方法

​	c. MAP mos swapIn方法去map流动性池中进行兑换，将mBNB换为mNear, 并emit mapSwapIn事件

​	d. messenger监听swapIn事件，调用Near mos的transferIn方法



### 2. Aggregate Swap

当map上没有mBNB和mNear的流动性池时，这时需要借助BSC和Near的dex流动性进行跨链兑换。假设map上没有\$mBNB-\$mNear的流动性，但是有mUSDC的流动性，则butter智能路由给出的最佳路径可能为 BNB -> USDC (PancakeSwap), USDC(MAP), USDC -> NEAR(ref.fi)。此类流程如下:

​	a. 调用bsc的barter core，完成BNB->USDC兑换，并调用bsc mos的swapOut方法。

​	b, messenger监听swapOut事件，调用MAP mos的swapIn方法

​	c. MAP mos SwapIn方法做处理并emit swapIn事件

​	d. messenger监听swapIn事件，调用Near mos的transferIn方法

​	e. Near mos transfer方法调用near上的barter core，将usdc -> Near, 存入toAddress.





## Butter Core合约

Barter Core目前主要用于完成聚合兑换，类似MOS，每条链上都有相应的Butter Core来进行改链上的dex合约来完成聚合swap。









