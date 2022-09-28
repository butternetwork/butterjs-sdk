import { ethers } from 'ethers';
import { BarterBridge } from '../core/bridge/bridge';
import { BridgeRequestParam } from '../types/requestTypes';
import { Token } from '../entities';
import { ChainId, ID_TO_CHAIN_ID, IS_MAP } from '../constants/chains';
import { MCS_CONTRACT_ADDRESS_SET } from '../constants/addresses';
import { IMapCrossChainService } from '../libs/interfaces/IMapCrossChainService';
import { EVMCrossChainService } from '../libs/EVMCrossChainService';
import MCS_MAP_ABI from '../abis/MAPCrossChainServiceRelayABI.json';
import TOKEN_REG_ABI from '../abis/TokenRegister.json';
import MCS_EVM_ABI from '../abis/MAPCrossChainServiceABI.json';
import { MAPCrossChainService } from '../libs/MAPCrossChainService';
import { TokenRegister } from '../libs/TokenRegister';
import { InMemoryKeyStore } from 'near-api-js/lib/key_stores';
import { KeyPair, keyStores, utils } from 'near-api-js';
import { NearCrossChainService } from '../libs/NearCrossChainService';
import { hexToDecimalArray } from '../utils';
import BN from 'bn.js';

require('dotenv/config');

const mapProvider = new ethers.providers.JsonRpcProvider(
  'http://18.142.54.137:7445',
  212
);
const mapSigner = new ethers.Wallet(process.env.PRIVATE_KEY!, mapProvider);

const ethProvider = new ethers.providers.JsonRpcProvider(
  'http://18.138.248.113:8545',
  34434
);
const ethSigner = new ethers.Wallet(process.env.PRIVATE_KEY!, ethProvider);

const makaluProvider = new ethers.providers.JsonRpcProvider(
  'https://poc2-rpc.maplabs.io',
  22776
);
const makaluSigner = new ethers.Wallet(
  process.env.PRIVATE_KEY!,
  makaluProvider
);

async function main() {
  const keyStore: InMemoryKeyStore = new keyStores.InMemoryKeyStore();
  const keyPair: KeyPair = KeyPair.fromString(
    'ed25519:3V1ZUMUD3pZkKyEFJFHpev32WVipYb7HFu6YhnHrGZMw1bArtcBBzB11W9ouFuB3cd11hZL2miXZnX1N36pgywgU'
  );
  keyStore.setKey('testnet', 'xyli.testnet', keyPair);

  const nearMcs: NearCrossChainService = new NearCrossChainService({
    keyStore: keyStore,
    nodeUrl: 'https://rpc.testnet.near.org',
    networkId: 'testnet',
  });

  const toAddress: number[] = hexToDecimalArray(
    '0x8c9b3cAf7DedD3003f53312779c1b92ba1625D94',
    212
  );

  const txHash: string = await nearMcs.doTransferOutNative(
    'xyli.testnet',
    toAddress,
    212,
    new BN(utils.format.parseNearAmount('1')!, 10)
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
