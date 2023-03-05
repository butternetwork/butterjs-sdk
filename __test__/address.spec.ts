// import {ethers} from 'ethers';
// const wallet = ethers.Wallet.createRandom();
import {toChecksumAddress} from 'web3-utils';
import {CHAIN_ID, validateAndParseAddressByChainId} from "../src";

const ACCOUNT = {
    privateKey: '0x8e2739bf7565b2b462c673e1f374f3850cc99f80f618f1c7efa94020ad365d1e',
    // address: '0xb8559ed09eE832477c482a4a4dFeF85d522D47F5',
    address: '0xb8559ed09ee832477c482a4a4dfef85d522d47f5',
    mnemonic: {
        phrase: 'drum erase nothing seven avocado borrow ensure scatter debris laptop another predict',
        path: "m/44'/60'/0'/0/0",
        locale: 'en'
    }
}

describe('Address Validator', () => {
    let result = validateAndParseAddressByChainId(ACCOUNT.address,CHAIN_ID.MAP_TEST);
    console.log(result)
    it('Address', () => {
        expect(result).toBe(toChecksumAddress(ACCOUNT.address));
    })
})

    // [object Object]