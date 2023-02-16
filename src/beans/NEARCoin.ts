import {Currency} from "./Currency";
import {ZERO_ADDRESS} from "../constants";
import invariant from "tiny-invariant";
import {WToken} from "./WToken";
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
        const wnear = WToken(this.chainId);
        invariant(!!wnear, 'WRAPPED');
        return wnear;
    }

    public equals(other: Currency): boolean {
        return other.isNative && other.chainId === this.chainId;
    }

}