import { EvmLogHandlerContext } from "@subsquid/substrate-evm-processor";
import { ethers } from "ethers";
import { Contract } from "../model";
import { abi } from "../abi/erc721";
import { CHAIN_NODE, processTransfer } from "../contract";

export const astarWeb3DomainsContract = new ethers.Contract(
    "0xA1019535E6b364523949EaF45F4B17521c1cb074".toLowerCase(),
    abi,
    new ethers.providers.WebSocketProvider(CHAIN_NODE)
);

export function createContractEntityAWD(): Contract {
    return new Contract({
      id: astarWeb3DomainsContract.address,
      name: "AstarWeb3Domains",
      symbol: "AWD",
      totalSupply: 4273n,
    });
}

export async function processTransferAWD(ctx: EvmLogHandlerContext): Promise<void> {
  console.log("Triggered AstarWeb3Domains");
  return processTransfer(ctx, astarWeb3DomainsContract);
}