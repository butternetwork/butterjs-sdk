import {Currency} from "./Currency";
import {TOKEN_ID, TOKENS, ZERO_ADDRESS} from "../constants";
import invariant from "tiny-invariant";
import {Token} from "./Token";

export class NEARCoin extends Currency{
    readonly isNative: boolean=true;
    readonly isToken: boolean=false;

    public constructor(chainId: string) {
        super(
            chainId,
            24,
            ZERO_ADDRESS,
            'NEAR',
            'NEAR',
            'https://cryptologos.cc/logos/near-protocol-near-logo.png'
        );
    }

    public get wrapped(): Token {
        const wnear = TOKENS(this.chainId,TOKEN_ID.WRAP);
        invariant(!!wnear, 'WRAPPED');
        return wnear;
    }

    public equals(other: Currency): boolean {
        return other.isNative && other.chainId === this.chainId;
    }

    get copy(): Currency {
        return new NEARCoin(this.chainId);
    }

}