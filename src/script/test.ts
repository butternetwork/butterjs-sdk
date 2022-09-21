import { ethers } from 'ethers';
import { BarterBridge } from '../core/bridge/bridge';
import { BridgeRequestParam } from '../types/requestTypes';
import { Token } from '../entities';
import { ChainId } from '../constants/chains';

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
  const bridge: BarterBridge = new BarterBridge();
  const request: BridgeRequestParam = {
    token: new Token(212, '0x0000000000000000000000000000000000000000', 18),
    fromChainId: ChainId.MAP_TEST,
    toChainId: ChainId.ETH_PRIV,
    toAddress: '0x8c9b3cAf7DedD3003f53312779c1b92ba1625D94',
    amount: ethers.utils.parseEther('1').toString(),
    signer: mapSigner,
  };

  console.log(await bridge.bridgeToken(request));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
