import {Currency} from "./Currency";


export class Token  extends Currency{
    readonly isNative: boolean=false;
    readonly isToken: boolean=true;
    public readonly tokenId?: string;

    constructor(   chainId: string,
                   decimals: number,
                   address: string,
                   symbol?: string,
                   name?: string,
                   logo?: string,
                   tokenId?: string
    ) {
        super(chainId, decimals, address, symbol, name, logo);
        this.tokenId = tokenId?tokenId:symbol;
    }

    static from(data:any):Currency{
        if (!data){
            throw new Error('No Data find for Token!')
        }
        return new Token(data.chainId,data.decimals,data.address,data.symbol,data.name,data.tokenId);
    }

    get copy(): Token {
        return new Token(this.chainId,this.decimals,this.address,this.symbol,this.name,this.logo,this.tokenId);
    }
}
