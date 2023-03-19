import {ethers} from 'ethers';
import {BUTTER_SMART_ROUTER_URL, BUTTER_SMART_ROUTER_URL_MAINNET, IS_MAINNET} from '../../constants';
import {Currency} from '../../beans';
import {RouteResponse} from '../../types';
import {createVLog} from "../../utils";

const superagent = require('superagent');

const vlog = createVLog('ButterSmartRouter')

export class ButterSmartRouter {
    async getBestRoute(
        fromToken: Currency,
        toToken: Currency,
        amountIn: string
    ): Promise<RouteResponse> {
        const fromChainId = fromToken.chainId;
        const toChainId = toToken.chainId;
        vlog('getBestRoute', `FromId:${fromChainId} ${fromToken.symbol}`, ' | ', `ToId:${toChainId} ${toToken.symbol}`)
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
        vlog('getBestRoute', 'request url: ', requestUrl);
        let routeResponse: RouteResponse = {
            status: 200,
            code: 10000,
            msg: '',
            data: ''
        }
        try {
            const response = await superagent.get(requestUrl);
            const data = response.body;
           vlog('getBestRoute', 'result:', data);
            if (data.hasOwnProperty('status')) {
                routeResponse.status = data.hasOwnProperty('status');
                routeResponse.code = 10001;
                if (data.error) {
                    routeResponse.msg = data.error;
                } else {
                    routeResponse.msg = 'Insufficient Liquidity';
                }
            } else if (data.hasOwnProperty('mapChain') && data.mapChain.length > 0) {
                let amountOut = data.mapChain[0].amountOut;
                let amount = parseFloat(amountOut);
                if (amount<=0){
                    routeResponse.code=10002;
                    routeResponse.msg='Input Amount Less Than Fee';
                }else{
                    routeResponse.data=data;
                }

            }
            else{
                routeResponse.code=99999;
                routeResponse.msg='Internal Server Error';
            }
            // if (data.hasOwnProperty('status') && data.hasOwnProperty('error')) {
            //     routeResponse = {
            //         status: 200,
            //         code: 10001,
            //         msg: 'Insufficient Liquidity',
            //     };
            // } else if (data.hasOwnProperty('mapChain')) {
            //     const mapAmountOut = data['mapChain'][0]['amountOut'];
            //     if (parseFloat(mapAmountOut) <= 0) {
            //         routeResponse = {
            //             status: 200,
            //             code: 10002,
            //             msg: 'Input Amount Less Than Fee',
            //         };
            //     } else {
            //         routeResponse = {
            //             data: data,
            //             status: response.status,
            //             code: 10000,
            //             msg: response.statusText,
            //         };
            //     }
            // } else {
            //     routeResponse = {
            //         status: 500,
            //         code: 99999,
            //         msg: 'Internal Server Error',
            //     };
            // }
        } catch (error: any) {
            let message=error.message?error.message:'';
            if (message.indexOf("{")===0){
                let temp = JSON.parse(message);
                if (temp.message){
                    message=temp.message;
                }
            }
            vlog('getBestRoute', 'error:',message);
            routeResponse.status=500;
            routeResponse.code=99999;
            routeResponse.msg=`Internal Server Error: ${message}`
            // routeResponse = {
            //     status: 500,
            //     code: 99999,
            //     msg: error.message,
            // };
        }
        return routeResponse!;
    }
}
