import {ethers} from 'ethers';
import {BUTTER_SMART_ROUTER_URL, BUTTER_SMART_ROUTER_URL_MAINNET, IS_MAINNET} from '../../constants';
import {Currency} from '../../beans';
import {RouteResponse} from '../../types';
import {createVLog} from "../../utils";
import {Canceler} from "../tools/canceler";
import Decimal from "decimal.js";

const superagent = require('superagent');

const vlog = createVLog('ButterSmartRouter')

export class ButterSmartRouter {
    requesters?: any;
    public readonly canceler?: Canceler;

    constructor(canceler?: Canceler) {
        this.canceler = canceler;
        this.requesters = {};
        if (this.canceler) {
            this.canceler.on('CallCancel', (key: string) => {
                try {
                    let req = this.requesters[key];
                    req.abort();
                } catch (e) {
                }
            });
            this.canceler.on('CallCancelAll', () => {
                for (const requestersKey in this.requesters) {
                    try {
                        let req = this.requesters[requestersKey];
                        req.abort();
                    } catch (e) {
                    }
                }
            });
        }
    }

    async queryRoute(from: Currency, to: Currency,
                     amount: string | number,
                     cancelerKey?: string,isTest?:Boolean) {
        return new Promise((resolve, reject) => {
            const fromChainId = from.chainId;
            const toChainId = to.chainId;
            if (IS_MAINNET(fromChainId) != IS_MAINNET(toChainId)) {
                reject(new Error(
                    `queryRoute: fromToken and toToken not on the same network. From: ${fromChainId}, To: ${toChainId}`
                ));
            }
            let amountObj = new Decimal(amount);
            if (amountObj.isZero() || amountObj.lessThan(0)) {
                reject(new Error(`Amount must be greater than 0`));
            }
            const smartRouterServerUrl = IS_MAINNET(fromChainId)
                ? BUTTER_SMART_ROUTER_URL_MAINNET
                : BUTTER_SMART_ROUTER_URL;
            let amountIn:string;
            // if (from.decimals) {
            //     amountIn = amountObj.mul(new Decimal('10').pow(from.decimals)).toFixed(0);
            // }else{
            //     amountIn = amountObj.toFixed(0);
            // }
            amountIn = amountObj.toFixed();
            if (amountIn.indexOf('.')<0){
                amountIn=`${amountIn}.0`;
            }

            vlog('queryRoute', `FromId:${fromChainId} ${from.symbol}(${from.decimals})`, ' | ', `ToId:${toChainId} ${to.symbol}`,' | ',amountIn)

            const requestUrl =
                smartRouterServerUrl +
                `?fromChainId=${fromChainId}&` +
                `toChainId=${toChainId}&` +
                `amountIn=${amountIn}&` +
                `tokenInAddress=${from.address}&` +
                `tokenInDecimal=${from.decimals}&` +
                `tokenInSymbol=${from.symbol}&` +
                `tokenOutAddress=${to.address}&` +
                `tokenOutDecimal=${to.decimals}&` +
                `tokenOutSymbol=${to.symbol}`;
            const request = superagent.get(requestUrl);
            if (cancelerKey) {
                this.requesters[cancelerKey] = request;
            }
            let routeResponse: RouteResponse = {
                status: 200,
                code: 10000,
                msg: '',
                data: ''
            }
            request.then((response: any) => {
                const data = response.body;
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
                    if (amount <= 0) {
                        routeResponse.code = 10002;
                        routeResponse.msg = 'Input Amount Less Than Fee';
                    } else {
                        routeResponse.data = data;
                    }
                } else {
                    routeResponse.code = 99999;
                    routeResponse.msg = 'Internal Server Error';
                }
                resolve(routeResponse)
            }).catch((error: any) => {
                let message = '';
                if (error) {
                    if (error.message === 'Aborted') {
                        reject(error);
                    } else {
                        message = error.message;
                    }
                }
                if (message === '') {
                    message = 'Internal Server Error';
                }
                routeResponse.status = 500;
                routeResponse.code = 99999;
                routeResponse.msg = message;
                resolve(routeResponse)
            })
        })
    }

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
            // vlog('getBestRoute', 'result:', data);
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
                if (amount <= 0) {
                    routeResponse.code = 10002;
                    routeResponse.msg = 'Input Amount Less Than Fee';
                } else {
                    routeResponse.data = data;
                }

            } else {
                routeResponse.code = 99999;
                routeResponse.msg = 'Internal Server Error';
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
            let message = error.message ? error.message : '';
            if (message.indexOf("{") === 0) {
                let temp = JSON.parse(message);
                if (temp.message) {
                    message = temp.message;
                }
            }
            vlog('getBestRoute', 'error:', message);
            routeResponse.status = 500;
            routeResponse.code = 99999;
            routeResponse.msg = `Internal Server Error: ${message}`
            // routeResponse = {
            //     status: 500,
            //     code: 99999,
            //     msg: error.message,
            // };
        }
        return routeResponse!;
    }
}
