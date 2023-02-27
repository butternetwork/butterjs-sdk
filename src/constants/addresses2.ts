import {CHAIN_ID} from "./chains2";

const MOS_CONTRACT_ADDRESSES:any={
  [CHAIN_ID.MAP_MAINNET]: '0x630105189c7114667a7179Aa57f07647a5f42B7F',
  [CHAIN_ID.BNB_MAINNET]: '0x630105189c7114667a7179Aa57f07647a5f42B7F',
  [CHAIN_ID.POLYGON_MAINNET]: '0x630105189c7114667a7179Aa57f07647a5f42B7F',
  [CHAIN_ID.NEAR_MAINNET]: 'mos.mfac.butternetwork.near',

  [CHAIN_ID.ETH_PRIV]: '0x43130059C655314d7ba7eDfb8299d26FbDE726F1',
  [CHAIN_ID.ETH_GOERLI]: '0x2e2D0FBF6c69B21a56d49ca3A31fEB8Df923f2FB',
  [CHAIN_ID.BNB_TEST]: '0x6858B990A504D7Fc41D0BBB5178c4675518BDA27',
  [CHAIN_ID.MAP_TEST]: '0xb4fCfdD492202c91A7eBaf887642F437a07A2664',
  [CHAIN_ID.POLYGON_TEST]: '0x6858B990A504D7Fc41D0BBB5178c4675518BDA27',
  [CHAIN_ID.NEAR_TEST]: 'mos.map007.testnet',
}
const BUTTER_ROUTER_ADDRESSES:any={
  [CHAIN_ID.MAP_MAINNET]: '',
  [CHAIN_ID.BNB_MAINNET]: '',
  [CHAIN_ID.POLYGON_MAINNET]: '',
  [CHAIN_ID.NEAR_MAINNET]: '',

  [CHAIN_ID.ETH_PRIV]: '',
  [CHAIN_ID.ETH_GOERLI]: '0x840ED95f521103215c0a1D3772c3776b809231B8',
  [CHAIN_ID.BNB_TEST]: '0x5ABFb17CFeE098EEA3d2Fb026FD7d77486555F93',
  [CHAIN_ID.MAP_TEST]: '',
  [CHAIN_ID.POLYGON_TEST]: '0xCBdb1Da4f99276b0c427776BDE93838Bc19386Cc',
  [CHAIN_ID.NEAR_TEST]: '',
}
const TOKEN_REGISTER_ADDRESSES:any={
  [CHAIN_ID.MAP_MAINNET]: '0xff44790d336d3C004F2Dac7e401E4EA5680529dD',
  [CHAIN_ID.BNB_MAINNET]: '',
  [CHAIN_ID.POLYGON_MAINNET]: '',
  [CHAIN_ID.NEAR_MAINNET]: '',

  [CHAIN_ID.ETH_PRIV]: '',
  [CHAIN_ID.ETH_GOERLI]: '',
  [CHAIN_ID.MAP_TEST]: '0x636fCd559cc620dd7233aFD3c3556f63Bd39e721',
  [CHAIN_ID.BNB_TEST]: '',
  [CHAIN_ID.POLYGON_TEST]: '',
  [CHAIN_ID.NEAR_TEST]: '',
}

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

/**
 * MOS contract address by chainId
 * smart contract source code:
 * {@link https://github.com/butternetwork/butter-mos-contracts/blob/master/evmV2/contracts/MAPCrossChainServiceRelay.sol}
 * {@link https://github.com/butternetwork/
 * butter-mos-contracts/blob/master/evmV2/contracts/MAPCrossChainService.sol}
 * */
export const MOS_CONTRACT = (chainId:CHAIN_ID|string):string => {
  if (MOS_CONTRACT_ADDRESSES[chainId]){
    return MOS_CONTRACT_ADDRESSES[chainId];
  }
  throw new Error(`Unsupport mos with chainId:${chainId}`)
}
export const MOS_CONTRACT_NEAR : any = {
  [CHAIN_ID.NEAR_MAINNET]: 'mos.mfac.butternetwork.near',
  [CHAIN_ID.NEAR_TEST]: 'mos.map007.testnet',
};
export const BUTTER_ROUTER = (chainId:CHAIN_ID|string):string => {
  if (BUTTER_ROUTER_ADDRESSES[chainId]){
    return BUTTER_ROUTER_ADDRESSES[chainId];
  }
  throw new Error(`Unsupport router with chainId:${chainId}`)
}

/**
 * TokenRegister Address: https://github.com/butternetwork/butter-mos-contracts/blob/master/evm/contracts/TokenRegister.sol
 */
export const TOKEN_REGISTER = (chainId:CHAIN_ID|string):string => {
  if (TOKEN_REGISTER_ADDRESSES[chainId]){
    return TOKEN_REGISTER_ADDRESSES[chainId];
  }
  throw new Error(`Unsupport token register with chainId:${chainId}`)
}
