import {Currency} from "./Currency";
import {ZERO_ADDRESS} from "../constants";
import invariant from "tiny-invariant";
import {Token} from "./Token";
import {WToken} from "./WToken";

export class EVMCoin extends Currency{
    readonly isNative: boolean=true;
    readonly isToken: boolean=false;

    public constructor(
        chainId: string,
        decimals: number,
        symbol?: string,
        name?: string,
        logo?: string
    ) {
        super(chainId, decimals, ZERO_ADDRESS, symbol, name, logo);
    }

    public get wrapped(): Token {
        const weth9 = WToken(this.chainId);
        invariant(!!weth9, 'WRAPPED');
        return weth9;
    }

    public equals(other: Currency): boolean {
        return other.isNative && other.chainId === this.chainId;
    }

    get copy(): EVMCoin {
        return new EVMCoin(this.chainId,this.decimals,this.symbol,this.name,this.logo);
    }

}