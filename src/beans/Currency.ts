import invariant from "tiny-invariant";
import {Token} from "./Token";
import {TOKEN_ID, TOKENS} from "../constants";

export abstract class Currency {
    /**
     * Returns whether the currency is native to the chain and must be wrapped (e.g. EVMNativCoin)
     */
    public abstract readonly isNative: boolean;
    /**
     * Returns whether the currency is a token that is usable in Butter without wrapping
     */
    public abstract readonly isToken: boolean;

    /**
     * The chain ID on which this currency resides
     */
    public readonly chainId: string;
    /**
     * The decimals used in representing currency amounts
     */
    public readonly decimals: number;

    /**
     * The address of the token, 'ZERO_ADDRESS' when token is native token
     */
    public readonly address: string;
    /**
     * The symbol of the currency, i.e. a short textual non-unique identifier
     */
    public readonly symbol?: string;
    /**
     * The name of the currency, i.e. a descriptive textual non-unique identifier
     */
    public readonly name?: string;

    /**
     * logo of the token, for display only
     */
    public readonly logo?: string;

    /**
     * Constructs an instance of the base class `BaseCurrency`.
     * @param chainId the chain ID on which this currency resides
     * @param decimals decimals of the currency
     * @param address address of the currency
     * @param symbol symbol of the currency
     * @param name of the currency
     * @param logo of the currency
     */
    protected constructor(
        chainId: string,
        decimals: number,
        address: string,
        symbol?: string,
        name?: string,
        logo?: string
    ) {
        invariant(
            decimals >= 0 && decimals < 255 && Number.isInteger(decimals),
            'DECIMALS'
        );
        this.address = address;
        this.chainId = chainId;
        this.decimals = decimals;
        this.symbol = symbol;
        this.name = name;
        this.logo = logo;
    }

    // static from(data:any):Currency{
    //     if (!data){
    //         throw new Error('No Data find!')
    //     }
    //     return new Currency(data.chainId,data.decimals,data.address,data.symbol,data.name,data.logo);
    // }

    /**
     * Returns whether this currency is functionally equivalent to the other currency
     * @param other the other currency
     */
    public equals(other: Currency): boolean {
        return (
            other.isToken &&
            this.chainId === other.chainId &&
            this.address === other.address
        );
    }

    /**
     * Return the wrapped version of this currency that can be used with the butter contracts. Currencies must
     * implement this to be used in butter
     */
    public get wrapped(): Currency {
        return this
    }

    public get copy(): Currency {
        return this;
    }
}