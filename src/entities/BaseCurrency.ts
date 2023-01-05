import invariant from 'tiny-invariant';
import { Currency } from './Currency';
import { Token } from './Token';

/**
 * A currency is any fungible financial instrument, including EVMNativCoin, all ERC20 tokens, and other chain-native currencies
 */
export abstract class BaseCurrency {
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

  /**
   * Returns whether this currency is functionally equivalent to the other currency
   * @param other the other currency
   */
  public abstract equals(other: BaseCurrency): boolean;

  /**
   * Return the wrapped version of this currency that can be used with the butter contracts. Currencies must
   * implement this to be used in butter
   */
  public abstract get wrapped(): Token;
}
