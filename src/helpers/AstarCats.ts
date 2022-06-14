import { EvmLogHandlerContext } from "@subsquid/substrate-evm-processor";
import { ethers } from "ethers";
import { Contract } from "../model";
import { abi } from "../abi/erc721";
import { CHAIN_NODE, processTransfer } from "../contract";

export const astarCatsContract = new ethers.Contract(
  "0x8b5d62f396Ca3C6cF19803234685e693733f9779".toLowerCase(),
  abi,
  new ethers.providers.WebSocketProvider(CHAIN_NODE)
);

export function createAstarCatsContract(): Contract {
  return new Contract({
    id: astarCatsContract.address,
    name: "AstarCats",
    symbol: "CAT",
    totalSupply: 7777n,
  });
}

export async function processAstarCatsTransfers(
  ctx: EvmLogHandlerContext
): Promise<void> {
  return processTransfer(ctx, astarCatsContract);
}
