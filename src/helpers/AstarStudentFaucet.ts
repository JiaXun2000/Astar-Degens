import { EvmLogHandlerContext } from "@subsquid/substrate-evm-processor";
import { ethers } from "ethers";
import { Contract } from "../model";
import { abi } from "../abi/erc721";
import { CHAIN_NODE, processTransfer } from "../contract";

export const astarStudentFaucetContract = new ethers.Contract(
    "0x26DA9C05A9f7bcEFb9e342Bb35FA8aE338F9cCed".toLowerCase(),
    abi,
    new ethers.providers.WebSocketProvider(CHAIN_NODE)
);

export function createContractEntityASF(): Contract {
    return new Contract({
      id: astarStudentFaucetContract.address,
      name: "AStarStudentFaucet",
      symbol: "ASF",
      totalSupply: 161n,
    });
}
export async function processTransferASF(ctx: EvmLogHandlerContext): Promise<void> {
  console.log("Triggered AStarStudentFaucet");
  return processTransfer(ctx, astarStudentFaucetContract);
}
  