import { BigNumber, ethers } from "ethers";
import { TokenRegisterAddress } from "../constants/addresses";
import { TokenRegister } from "../libs/TokenRegister";
import TokenRegisterAbi from "../abis/TokenRegister.json" 
require('dotenv/config');

const mapProvider = new ethers.providers.JsonRpcProvider("http://18.142.54.137:7445", 212);
const mapSigner = new ethers.Wallet(process.env.PRIVATE_KEY!, mapProvider);

const ethProvider = new ethers.providers.JsonRpcProvider("http://18.138.248.113:8545", 34434);
const ethSigner = new ethers.Wallet(process.env.PRIVATE_KEY!, ethProvider);

const makaluProvider = new ethers.providers.JsonRpcProvider("https://poc2-rpc.maplabs.io", 22776);
const makaluSigner = new ethers.Wallet(process.env.PRIVATE_KEY!, makaluProvider);

async function main() {
    const contract = new ethers.Contract(TokenRegisterAddress, TokenRegisterAbi, makaluSigner);
    const gas: BigNumber = await contract.estimateGas.regToken?.(1, "0x0000000000000000000000000000000000001111", "0x0000000000000000000000000000000000000000")!;
    console.log(gas.toBigInt());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
});