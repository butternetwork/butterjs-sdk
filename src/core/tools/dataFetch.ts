import {Currency} from '../../beans';
import {
    CHAINS,
    DEFAULT_SLIPPAGE,
    GET_MCS_TOKENS,
    IS_MAP,
    IS_NEAR,
    MOS_CONTRACT,
    NEAR_CONNECT,
    SUPPORT_TOKENS,
    TOKEN_REGISTER,
    ZERO_ADDRESS
} from '../../constants';
import {ButterFee, ButterFeeDistribution, ButterFeeRate, ButterJsonRpcProvider, VaultBalance} from '../../types';

import {
    asciiToString,
    assembleCrossChainRouteFromJson, createVLog,
    getHexAddress,
    getRelayChainToken,
    getToChainToken,
    getToken
} from '../../utils';
import {TokenRegister} from '../../libs/TokenRegister';
import {BigNumber, ethers} from 'ethers';
import {VaultToken} from '../../libs/VaultToken';
import {EVMOmnichainService} from '../../libs/mos/EVMOmnichainService';
import MOS_RELAY_METADATA from '../../abis/MAPOmnichainServiceRelay.json';
import MOS_EVM_METADATA from '../../abis/MAPOmnichainService.json';
import {connect} from 'near-api-js';
import {CodeResult} from 'near-api-js/lib/providers/provider';

import Web3 from 'web3';
import TokenRegisterMetadata from '../../abis/TokenRegister.json';
import Decimal from "decimal.js";

const vlog = createVLog('DataFetch');

export async function getFeeAmountAndInfo(
    fromToken: Currency | any,
    amount: string | number,
    toChain: string | number,
    mapRpcProvider: ButterJsonRpcProvider | any): Promise<any> {
    // vlog('getFeeAmountAndInfo', fromToken);
    // vlog('getFeeAmountAndInfo', amount);
    // vlog('getFeeAmountAndInfo', toChain);
    // vlog('getFeeAmountAndInfo', mapRpcProvider);
    let _amount = new Decimal(amount).toString();
    let _fromChain = fromToken.chainId;
    let _toChain = new Decimal(toChain).toString();
    const chainId: string = mapRpcProvider.chainId.toString();
    const mapChainId: string = mapRpcProvider.chainId.toString();
    const mapProvider = new ethers.providers.JsonRpcProvider(
        mapRpcProvider.url ? mapRpcProvider.url : CHAINS(mapChainId).rpc
    );
    const tokenRegister = new TokenRegister(
        TOKEN_REGISTER(chainId)!,
        mapProvider
    );
    let result = await tokenRegister.getFeeAmountAndInfo(fromToken, _amount, _toChain);
    const distribution = await getDistributeRate(mapChainId);
    result.feeDistribution=distribution;
    vlog('getFeeAmountAndInfo', 'result',result);
    return result;
}

/**
 * get fee for bridging srcToken to targetChain
 * @param srcToken
 * @param targetChain
 * @param amount
 * @param mapRpcProvider
 */
export async function getBridgeFee(
    srcToken: Currency,
    targetChain: string,
    amount: string,
    mapRpcProvider: ButterJsonRpcProvider
): Promise<ButterFee> {
    vlog('getBridgeFee', 'srcToken', JSON.stringify(srcToken));
    vlog('getBridgeFee', 'targetChain', JSON.stringify(targetChain));
    vlog('getBridgeFee', 'amount', amount);
    vlog('getBridgeFee', 'mapRpcProvider', mapRpcProvider);
    // vlog('getBridgeFee',srcToken.chainId,targetChain,amount,'mapRpcProvider:',mapRpcProvider);
    const chainId: string = mapRpcProvider.chainId.toString();
    const mapChainId: string = mapRpcProvider.chainId.toString();
    const mapProvider = new ethers.providers.JsonRpcProvider(
        mapRpcProvider.url ? mapRpcProvider.url : CHAINS(mapChainId).rpc
    );
    const tokenRegister = new TokenRegister(
        TOKEN_REGISTER(chainId)!,
        mapProvider
    );
    let feeAmount = '';
    let feeRate: ButterFeeRate = {lowest: '0', rate: '0', highest: '0'};
    if (IS_MAP(srcToken.chainId)) {
        vlog('getBridgeFee', `src token is map`);
        const tokenAddress = srcToken.isNative
            ? srcToken.wrapped.address
            : srcToken.address;
        const tokenFeeRate = await tokenRegister.getFeeRate(
            tokenAddress,
            targetChain
        );
        vlog('getBridgeFee', `src token is map`, 'tokenFeeRate', tokenFeeRate);
        feeRate.lowest = tokenFeeRate.lowest.toString();
        feeRate.highest = tokenFeeRate.highest.toString();
        feeRate.rate = BigNumber.from(tokenFeeRate.rate).div(100).toString();
        feeAmount = _getFeeAmount(amount, feeRate);
    } else {
        vlog('getBridgeFee', `src token is ${srcToken.chainId}`);
        const mapTokenAddress = await tokenRegister.getRelayChainToken(
            srcToken.chainId.toString(),
            srcToken
        );

        const relayChainAmount = await tokenRegister.getRelayChainAmount(
            mapTokenAddress,
            srcToken.chainId.toString(),
            amount
        );
        const tokenFeeRate: ButterFeeRate = await tokenRegister.getFeeRate(
            mapTokenAddress,
            targetChain
        );
        vlog('getBridgeFee', `src token is ${srcToken.chainId}`, 'tokenFeeRate', tokenFeeRate);
        feeRate.lowest = tokenFeeRate.lowest;
        feeRate.highest = tokenFeeRate.highest;
        feeRate.rate = BigNumber.from(tokenFeeRate.rate).div(100).toString();

        const feeAmountInMappingToken = _getFeeAmount(relayChainAmount, feeRate);
        const feeAmountBN = BigNumber.from(feeAmountInMappingToken);
        feeRate.lowest = BigNumber.from(feeRate.lowest)
            .mul(amount)
            .div(relayChainAmount)
            .toString();
        feeRate.highest = BigNumber.from(feeRate.highest)
            .mul(amount)
            .div(relayChainAmount)
            .toString();
        feeAmount = feeAmountBN.mul(amount).div(relayChainAmount).toString();
    }
    const distribution = await getDistributeRate(mapChainId);
    return Promise.resolve({
        feeToken: srcToken,
        feeRate: feeRate,
        amount: feeAmount.toString(),
        feeDistribution: distribution,
    });
}

/**
 * get fee for cross-chain exchange
 * @param srcToken source token
 * @param targetChain target chain id
 * @param amount amount in minimal uint
 * @param routeStr cross-chain route in string format
 * @param mapRpcProvider map relay chain rpc provider
 */
export async function getSwapFee(
    srcToken: Currency,
    targetChain: string,
    amount: string,
    routeStr: string,
    mapRpcProvider: ButterJsonRpcProvider
): Promise<ButterFee> {
    vlog('getSwapFee', 'srcToken', JSON.stringify(srcToken));
    vlog('getSwapFee', 'targetChain', targetChain);
    vlog('getSwapFee', 'amount', amount);
    vlog('getSwapFee', 'routeStr', routeStr);
    vlog('getSwapFee', 'mapRpcProvider', JSON.stringify(mapRpcProvider));
    const routes = assembleCrossChainRouteFromJson(routeStr, DEFAULT_SLIPPAGE);
    const srcRoute = routes.srcChain;

    if (
        srcRoute === undefined ||
        srcRoute.length === 0 ||
        srcRoute[0]!.path.length === 0
    ) {
        vlog('getSwapFee', 'getBridgeFee', 'before request')
        let result = await getBridgeFee(srcToken, targetChain, amount, mapRpcProvider);
        vlog('getSwapFee', 'getBridgeFee', result);
        return result;
    }

    let totalAmountOut: string = '0';
    for (let route of routes.mapChain) {
        totalAmountOut = BigNumber.from(totalAmountOut)
            .add(route.amountOut)
            .toString();
    }
    const tokenOut: Currency = srcRoute[0]!.tokenOut;

    const chainId: string = mapRpcProvider.chainId.toString();

    const mapChainId: string = mapRpcProvider.chainId.toString();
    const mapProvider = new ethers.providers.JsonRpcProvider(
        mapRpcProvider.url ? mapRpcProvider.url : CHAINS(mapChainId).rpc
    );
    const tokenRegister = new TokenRegister(
        TOKEN_REGISTER(chainId)!,
        mapProvider
    );
    let feeAmount = '';
    let feeRate: ButterFeeRate = {lowest: '0', rate: '0', highest: '0'};
    if (IS_MAP(srcToken.chainId)) {
        vlog('getSwapFee', 'srcToken is map');
        const tokenAddress = srcToken.isNative
            ? srcToken.wrapped.address
            : srcToken.address;
        const tokenFeeRate = await tokenRegister.getFeeRate(
            tokenAddress,
            targetChain
        );
        feeRate.lowest = tokenFeeRate.lowest.toString();
        feeRate.highest = tokenFeeRate.highest.toString();
        feeRate.rate = BigNumber.from(tokenFeeRate.rate).div(100).toString();
        feeAmount = _getFeeAmount(amount, feeRate);
    } else {
        vlog('getSwapFee', `srcToken is ${srcToken.chainId}`);
        const mapTokenAddress = await tokenRegister.getRelayChainToken(
            srcToken.chainId.toString(),
            tokenOut
        );

        const relayChainAmount = await tokenRegister.getRelayChainAmount(
            mapTokenAddress,
            srcToken.chainId.toString(),
            totalAmountOut
        );
        const tokenFeeRate: ButterFeeRate = await tokenRegister.getFeeRate(
            mapTokenAddress,
            targetChain
        );
        feeRate.lowest = tokenFeeRate.lowest;
        feeRate.highest = tokenFeeRate.highest;
        feeRate.rate = BigNumber.from(tokenFeeRate.rate).div(100).toString();

        const feeAmountInMappingToken = _getFeeAmount(relayChainAmount, feeRate);
        const feeAmountBN = BigNumber.from(feeAmountInMappingToken);
        feeRate.lowest = BigNumber.from(feeRate.lowest)
            .mul(totalAmountOut)
            .div(relayChainAmount)
            .toString();
        feeRate.highest = BigNumber.from(feeRate.highest)
            .mul(totalAmountOut)
            .div(relayChainAmount)
            .toString();
        feeAmount = feeAmountBN
            .mul(totalAmountOut)
            .div(relayChainAmount)
            .toString();
    }
    const distribution = await getDistributeRate(mapChainId);
    vlog('getSwapFee', ' | tokenOutAddress:', tokenOut.address, ' | srcToken:', srcToken.chainId, ' | IS_NEAR:', !IS_NEAR(srcToken.chainId))
    return Promise.resolve({
        feeToken: getToken(
            getHexAddress(
                tokenOut.address,
                srcToken.chainId,
                !IS_NEAR(srcToken.chainId)
            ),
            srcToken.chainId
        ),
        feeRate: feeRate,
        amount: feeAmount.toString(),
        feeDistribution: distribution,
    });
}

/**
 * get vault balance
 * @param fromChainId
 * @param fromToken
 * @param toChainId
 * @param rpcProvider
 */
export async function getVaultBalance(
    fromChainId: string,
    fromToken: Currency,
    toChainId: string,
    rpcProvider: ButterJsonRpcProvider
): Promise<VaultBalance> {
    if (fromChainId != fromToken.chainId) {
        throw new Error("Request Error: chainId and token.chainId doesn't match");
    }

    const mapChainId: string = rpcProvider.chainId.toString();
    const provider = new ethers.providers.JsonRpcProvider(
        rpcProvider.url ? rpcProvider.url : CHAINS(mapChainId).rpc
    );

    const tokenRegister = new TokenRegister(
        TOKEN_REGISTER(mapChainId)!,
        provider
    );

    if (fromToken.isNative) {
        fromToken = fromToken.wrapped;
    }
    const mapTokenAddress = IS_MAP(fromChainId)
        ? fromToken.address
        : await tokenRegister.getRelayChainToken(fromChainId.toString(), fromToken);
    const vaultAddress = await tokenRegister.getVaultToken(mapTokenAddress);

    if (vaultAddress === ZERO_ADDRESS) {
        throw new Error(
            `getVaultBalance: vault address not found for token: ${mapTokenAddress}`
        );
    }
    const vaultToken = new VaultToken(vaultAddress, provider);

    let tokenBalance = await vaultToken.getVaultBalance(toChainId.toString());

    let toChainTokenAddress = mapTokenAddress;

    if (!IS_MAP(toChainId)) {
        toChainTokenAddress = await tokenRegister.getToChainToken(
            mapTokenAddress,
            toChainId
        );

        if (toChainTokenAddress === '0x') {
            throw new Error(
                'Internal Error: Cannot find corresponding target token on target chain'
            );
        }

        const mapToken = getToken(mapTokenAddress, mapChainId);
        const toChainToken = getToken(
            toChainTokenAddress,
            toChainId
        );
        tokenBalance = BigNumber.from(tokenBalance)
            .mul(ethers.utils.parseUnits('1', toChainToken.decimals))
            .div(ethers.utils.parseUnits('1', mapToken.decimals))
            .toString();
    }

    return Promise.resolve({
        token: getToken(toChainTokenAddress, toChainId),
        balance: tokenBalance.toString(),
        isMintable: await isTokenMintable(toChainTokenAddress, toChainId),
    });
}

/**
 * get srcToken mapping token on target chain
 * @param srcToken
 * @param targetChainId
 * @param rpcProvider
 */
export async function getTargetToken(
    srcToken: Currency,
    targetChainId: string,
    rpcProvider: ButterJsonRpcProvider
): Promise<Currency> {
    const tokenAddress = await getTargetTokenAddress(
        srcToken,
        targetChainId,
        rpcProvider
    );
    if (tokenAddress === '0x') {
        throw new Error('token does not exist');
    }
    return getToken(tokenAddress, targetChainId);
}

/**
 * get srcToken mapping token on target chain
 * @param srcToken
 * @param targetChainId
 * @param rpcProvider
 */
export async function getTargetTokenAddress(
    srcToken: Currency,
    targetChainId: string,
    rpcProvider: ButterJsonRpcProvider
): Promise<string> {
    const mapChainId: string = rpcProvider.chainId.toString();
    const provider = new ethers.providers.JsonRpcProvider(
        rpcProvider.url ? rpcProvider.url : CHAINS(mapChainId).rpc
    );
    const tokenRegister = new TokenRegister(
        TOKEN_REGISTER(mapChainId)!,
        provider
    );
    let mapTokenAddress = srcToken.address;
    if (!IS_MAP(srcToken.chainId)) {
        mapTokenAddress = await tokenRegister.getRelayChainToken(
            srcToken.chainId.toString(),
            srcToken
        );
    }
    let targetTokenAddress = mapTokenAddress;
    if (!IS_MAP(targetChainId)) {
        targetTokenAddress = await tokenRegister.getToChainToken(
            mapTokenAddress,
            targetChainId
        );
    }
    return targetTokenAddress;
}

/**
 * get what token can be bridge from src chain to target chain
 * @param fromChainId
 * @param toChainId
 * @param provider
 */
export async function getTokenCandidatesOneByOne(
    fromChainId: string,
    toChainId: string,
    provider: ButterJsonRpcProvider
): Promise<Currency[]> {
    let ret = [];
    const fromChainTokenList = SUPPORT_TOKENS(fromChainId);
    for (let i = 0; i < fromChainTokenList.length; i++) {
        const token: Currency = fromChainTokenList[i]!;
        const tokenToCheck: Currency = token.isNative ? token.wrapped : token;
        if (
            (await getTargetTokenAddress(tokenToCheck, toChainId, provider)) != '0x'
        ) {
            ret.push(token);
        }
    }
    return ret;
}

/**
 * get token candidates with one transaction call
 * @param fromChainId
 * @param toChainId
 * @param provider
 */
export async function getTokenCandidates(
    fromChainId: string,
    toChainId: string,
    provider: ButterJsonRpcProvider): Promise<Currency[]> {
    // @ts-ignore
    const mapUrl: string = provider.url ? provider.url : CHAINS(provider.chainId.toString()).rpc;
    const web3 = new Web3(mapUrl);

    const tokenRegisterContract = new web3.eth.Contract(
        TokenRegisterMetadata.abi as any,
        TOKEN_REGISTER(provider.chainId.toString())
    );

    let tokenArr = SUPPORT_TOKENS(fromChainId).map(
        (token: Currency) => {
            if (IS_NEAR(token.chainId)) {
                if (token.isNative) {
                    return getHexAddress(token.wrapped.address, token.chainId, false);
                } else return getHexAddress(token.address, token.chainId, false);
            } else {
                if (token.isNative) {
                    return token.wrapped.address;
                } else return token.address;
            }
        }
    );
    if (!IS_MAP(fromChainId)) {
        // @ts-ignore
        tokenArr = await getRelayChainToken(
            tokenRegisterContract,
            fromChainId,
            tokenArr,
            mapUrl
        );
    }

    if (IS_MAP(toChainId)) {
        return SUPPORT_TOKENS(fromChainId);
    }
    const toChainTokenList = await getToChainToken(
        tokenRegisterContract,
        toChainId,
        tokenArr,
        mapUrl
    );
    let supportedFromChainTokenArr: Currency[] = [];
    for (let i = 0; i < toChainTokenList.length; i++) {
        if (toChainTokenList[i] != null && toChainTokenList[i] != '0x') {
            supportedFromChainTokenArr.push(SUPPORT_TOKENS(fromChainId)[i]!);
        }
    }
    return supportedFromChainTokenArr;
}

/**
 * check if a token is mintable on mos
 * @param tokenAddress
 * @param chainId
 */
export async function isTokenMintable(tokenAddress: string, chainId: string): Promise<boolean> {
    const rpcUrl = CHAINS(chainId).rpc;
    const rpcProvider = new ethers.providers.JsonRpcProvider(rpcUrl);
    if (IS_MAP(chainId)) {
        const tokenRegister = new TokenRegister(
            TOKEN_REGISTER(chainId)!,
            rpcProvider
        );
        return tokenRegister.checkMintable(tokenAddress);
    } else if (IS_NEAR(chainId)) {
        const accountId = MOS_CONTRACT(chainId);
        const connectionConfig = NEAR_CONNECT(chainId);
        // @ts-ignore
        const near = await connect(connectionConfig);
        const response: CodeResult = await near.connection.provider.query({
            request_type: 'call_function',
            finality: 'final',
            account_id: accountId,
            method_name: GET_MCS_TOKENS,
            args_base64: 'e30=',
        });
        const mosTokenSet = JSON.parse(asciiToString(response.result));
        for (let i = 0; i < mosTokenSet.length; i++) {
            if (
                getHexAddress(mosTokenSet[i][0].toLowerCase(), chainId, false) ===
                tokenAddress.toLowerCase()
            ) {
                return true;
            }
        }
        return false;
    } else {
        const mos = new EVMOmnichainService(
            MOS_CONTRACT(chainId),
            MOS_EVM_METADATA.abi,
            rpcProvider
        );
        return mos.isMintable(tokenAddress);
    }
}

export async function getDistributeRate(mapChainId: string): Promise<ButterFeeDistribution> {
    const rpcUrl = CHAINS(mapChainId).rpc;
    const rpcProvider = new ethers.providers.JsonRpcProvider(rpcUrl);
    if (!IS_MAP(mapChainId)) {
        throw new Error('chain id is not MAP');
    }

    const mos = new ethers.Contract(
        MOS_CONTRACT(mapChainId),
        MOS_RELAY_METADATA.abi,
        rpcProvider
    );
    const lpRate = await mos.distributeRate(0);
    const relayerRate = await mos.distributeRate(1);
    const protocolRate = await mos.distributeRate(2);
    console.log('relay', relayerRate);
    return Promise.resolve({
        relayer: relayerRate.rate.div(100).toString(),
        lp: lpRate.rate.div(100).toString(),
        protocol: protocolRate.rate.div(100).toString(),
    });
}

function _getFeeAmount(amount: string, feeRate: ButterFeeRate): string {
    const feeAmount = BigNumber.from(amount).mul(feeRate.rate).div(10000);
    if (feeAmount.gt(feeRate.highest)) {
        return feeRate.highest.toString();
    } else if (feeAmount.lt(feeRate.lowest)) {
        return feeRate.lowest.toString();
    }
    return feeAmount.toString();
}
