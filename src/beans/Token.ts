import invariant from "tiny-invariant";
import {Currency} from "./Currency";


export class Token  extends Currency{
    readonly isNative: boolean=false;
    readonly isToken: boolean=true;

    static from(data:any):Currency{
        if (!data){
            throw new Error('No Data find for Token!')
        }
        return new Token(data.chainId,data.decimals,data.address,data.symbol,data.name,data.logo);
    }
}
