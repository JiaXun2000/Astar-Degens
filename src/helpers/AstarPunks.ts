import { EvmLogHandlerContext } from "@subsquid/substrate-evm-processor";
import { ethers } from "ethers";
import { Contract } from "../model";
import { abi } from "../abi/erc721";
import { CHAIN_NODE, processTransfer } from "../contract";

export const astarPunksContract = new ethers.Contract(
  "0x1b57C69838cDbC59c8236DDa73287a4780B4831F".toLowerCase(),
  abi,
  new ethers.providers.WebSocketProvider(CHAIN_NODE)
);

export function createContractEntityAP(): Contract {
  return new Contract({
    id: astarPunksContract.address,
    name: "AstarPunks",
    symbol: "AP",
    totalSupply: 8888n,
  });
}

export async function processTransferAP(
  ctx: EvmLogHandlerContext
): Promise<void> {
  console.log("Triggered AstarPunks");
  return processTransfer(ctx, astarPunksContract);
}
