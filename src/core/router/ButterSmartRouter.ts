import {BigNumber, ethers} from 'ethers';
const superagent = require('superagent');
import {
    BUTTER_SMART_ROUTER_URL,
    BUTTER_SMART_ROUTER_URL_MAINNET,
    IS_MAINNET
} from '../../constants';
import {Currency} from '../../beans';
import {RouteResponse} from '../../types';

export class ButterSmartRouter {
    async getBestRoute(
        fromToken: Currency,
        toToken: Currency,
        amountIn: string
    ): Promise<RouteResponse> {
        const fromChainId = fromToken.chainId;
        const toChainId = toToken.chainId;
        if (IS_MAINNET(fromChainId) != IS_MAINNET(toChainId)) {
            throw new Error(
                `getBestRoute: fromToken and toToken not on the same network. From: ${fromChainId}, To: ${toChainId}`
            );
        }
        const smartRouterServerUrl = IS_MAINNET(fromChainId)
            ? BUTTER_SMART_ROUTER_URL_MAINNET
            : BUTTER_SMART_ROUTER_URL;

        const requestUrl =
            smartRouterServerUrl +
            '?' +
            `fromChainId=${fromChainId}&` +
            `toChainId=${toChainId}&` +
            `amountIn=${ethers.utils.formatUnits(amountIn, fromToken.decimals)}&` +
            `tokenInAddress=${fromToken.address}&` +
            `tokenInDecimal=${fromToken.decimals}&` +
            `tokenInSymbol=${fromToken.symbol}&` +
            `tokenOutAddress=${toToken.address}&` +
            `tokenOutDecimal=${toToken.decimals}&` +
            `tokenOutSymbol=${toToken.symbol}`;
        console.log(requestUrl);
        let routeResponse: RouteResponse;
        try {
            const response = await superagent.get(requestUrl);
            const data = response.body;
            console.log('getBestRoute', data)
            if (data.hasOwnProperty('status') && data.hasOwnProperty('error')) {
                routeResponse = {
                    status: 200,
                    code: 10001,
                    msg: 'Insufficient Liquidity',
                };
            } else if (data.hasOwnProperty('mapChain')) {
                const mapAmountOut = data['mapChain'][0]['amountOut'];
                if (parseFloat(mapAmountOut) <= 0) {
                    routeResponse = {
                        status: 200,
                        code: 10002,
                        msg: 'Input Amount Less Than Fee',
                    };
                } else {
                    routeResponse = {
                        data:data,
                        status: response.status,
                        code: 10000,
                        msg: response.statusText,
                    };
                }
            } else {
                routeResponse = {
                    status: 500,
                    code: 99999,
                    msg: 'Internal Server Error',
                };
            }
        } catch (error: any) {
            routeResponse = {
                status: 500,
                code: 99999,
                msg: error.message,
            };
        }
        return routeResponse!;
    }
}
