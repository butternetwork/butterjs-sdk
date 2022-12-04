import { Contract } from 'web3-eth-contract';
import Web3 from 'web3';
import BN from 'bn.js';
import { Method } from 'web3-core-method';

/**
 * get relaychain token in batch to improve speed
 * @param contract
 * @param fromChainId
 * @param tokenAddressArr
 * @param mapRpcUrl
 */
export async function batchGetRelayChainToken(
  contract: Contract,
  fromChainId: string,
  tokenAddressArr: string[],
  mapRpcUrl: string
): Promise<string[]> {
  let calls: any[] = [];

  for (let i = 0; i < tokenAddressArr.length; i++) {
    const fromTokenAddress = tokenAddressArr[i];
    calls.push(
      contract.methods.getRelayChainToken(fromChainId, fromTokenAddress).call
    );
  }
  return await _makeBatchRequest(calls, mapRpcUrl);
}

/**
 * get tochain token in batch to improve speed
 * @param contract
 * @param tokenAddressArr
 * @param toChain
 * @param mapRpcUrl
 */
export async function batchGetToChainToken(
  contract: Contract,
  tokenAddressArr: string[],
  toChain: string,
  mapRpcUrl: string
): Promise<string[]> {
  let calls: any[] = [];

  for (let i = 0; i < tokenAddressArr.length; i++) {
    const tokenAddress = tokenAddressArr[i];
    calls.push(
      contract.methods.getToChainToken(tokenAddress, new BN(toChain, 10)).call
    );
  }
  return await _makeBatchRequest(calls, mapRpcUrl);
}

/**
 * make actual batch request using web3.js's batch request
 * @param calls
 * @param mapRpcUrl
 */
function _makeBatchRequest(calls: any[], mapRpcUrl: string): Promise<string[]> {
  const web3 = new Web3(mapRpcUrl);
  const batch = new web3.BatchRequest();

  const promises = calls.map((call: Method) => {
    return new Promise((resolve: any, reject: any) => {
      // @ts-ignore
      const req = call.request({}, (err, data: string) => {
        if (err) reject(err);
        else resolve(data);
      });
      batch.add(req);
    });
  });
  batch.execute();

  // @ts-ignore
  return Promise.all(promises);
}
