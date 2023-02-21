import {Currency} from "./Currency";
import Decimal from 'decimal.js';
/**
 * Represents a chain with some metadata.
 */
export class Chain {
  /** chain id, we use string because some non-evm chain might have larger chainId that we defiend*/
  public readonly chainId: string;
  public readonly chainHex?: string;

  /** name of the chain */
  public readonly name?: string;

  /** chain rpc uri */
  public readonly rpc?: string;

  /** chain scan url */
  public readonly scan?: string;

  /** chain logo */
  public readonly logo?: string;

  /** chain symbol **/
  public readonly symbol?: string;
  public readonly chainName?: string;
  public token?: Currency;


  constructor(
    chainId: string,
    name: string,
    symbol?: string,
    rpc?: string,
    scan?: string,
    logo?: string,
    chainName?: string,
    token?:Currency,
  ) {
    // this.chainId = new Decimals(chainId).toNumber();
    this.chainId = chainId;
    this.name = name;
    if (rpc) {
      this.rpc = rpc;
    }
    if (scan) {
      this.scan = scan;
    }
    if (logo) {
      this.logo = logo;
    }
    if (symbol) {
      this.symbol = symbol;
      if (name){
        this.name=symbol;
      }
    }
    this.chainName=chainName;
    if (!this.chainName){
      this.chainName=name;
    }
    this.token =token;
    if (this.chainId){
      this.chainHex = new Decimal(this.chainId).toHex();
    }
  }

  /**
   *
   * @param data{Object:{
   *      chainId: string,
   *     name: string,
   *     rpc?: string,
   *     scan?: string,
   *     logo?: string,
   *     symbol?: string
   * }}
   */
  static from(data:any):Chain{
    return new Chain(data.chainId,data.name,data.symbol,data.rpc,data.scan,data.logo);
  }

}
