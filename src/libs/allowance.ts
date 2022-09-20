import { constants, Contract, ContractTransaction, Signer } from 'ethers';
import { BigNumber } from '@ethersproject/bignumber';
import { ERC20_ABI, ERC20Contract } from '../abis/ERC20ABI';
import { Token } from '../entities';

/**
 * get contract allowance for token
 * @param signer
 * @param tokenAddress
 * @param contractAddress
 */
async function readAllowance(
  signer: Signer,
  tokenAddress: string,
  contractAddress: string
): Promise<BigNumber> {
  const signerAddress = await signer.getAddress();
  const erc20 = new Contract(tokenAddress, ERC20_ABI, signer) as ERC20Contract;

  try {
    const approvedAmount = await erc20.allowance(
      signerAddress,
      contractAddress
    );
    return BigNumber.from(approvedAmount.toString());
  } catch (e) {
    return BigNumber.from(0);
  }
}

function doApprove(
  signer: Signer,
  tokenAddress: string,
  contractAddress: string,
  amount: string
): Promise<ContractTransaction> {
  const erc20 = new Contract(tokenAddress, ERC20_ABI, signer) as ERC20Contract;

  return erc20.approve(contractAddress, amount);
}

export async function getApprovedAmount(
  signer: Signer,
  token: Token,
  approvalAddress: string
): Promise<string | undefined> {
  if (token.isNative) {
    return;
  }

  const approvedAmount = await readAllowance(
    signer,
    token.address,
    approvalAddress
  );
  return approvedAmount.toString();
}

export async function approveToken(
  signer: Signer,
  token: Token,
  amount: string,
  approvalAddress: string,
  unlimitedAmount = false
): Promise<void> {
  if (token.isNative) {
    return;
  }

  // check if approvalAddress has enough allowance
  const approvedAmount: BigNumber = await readAllowance(
    signer,
    token.address,
    approvalAddress
  );

  if (approvedAmount.gte(BigNumber.from(amount.toString()))) {
    return;
  }

  // if not enough, do approve
  const approvingAmount = unlimitedAmount
    ? constants.MaxUint256.toString()
    : amount;

  const approveTx = await doApprove(
    signer,
    token.address,
    approvalAddress,
    approvingAmount
  );

  await approveTx.wait();
}

export async function revokeTokenApproval(
  signer: Signer,
  token: Token,
  approvalAddress: string
): Promise<void> {
  if (token.isNative) {
    return;
  }

  const approvedAmount = await readAllowance(
    signer,
    token.address,
    approvalAddress
  );

  if (approvedAmount.isZero()) return;

  const approveTx = await doApprove(
    signer,
    token.address,
    approvalAddress,
    '0'
  );

  await approveTx.wait();
}
