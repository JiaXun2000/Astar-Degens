import { EvmLogHandlerContext } from "@subsquid/substrate-evm-processor";
import { ethers } from "ethers";
import { Contract } from "../model";
import { abi } from "../abi/erc721";
import { CHAIN_NODE, processTransfer } from "../contract";

export const astarBoredApesContract = new ethers.Contract(
  "0xC5F0B515a1712D0C7234d2361412EabB5061EA85".toLowerCase(),
  abi,
  new ethers.providers.WebSocketProvider(CHAIN_NODE)
);

export function createContractEntityABA(): Contract {
  return new Contract({
    id: astarBoredApesContract.address,
    name: "AstarBoredApes",
    symbol: "ABA",
    totalSupply: 1926n,
  });
}

export async function processTransferABA(
  ctx: EvmLogHandlerContext
): Promise<void> {
  console.log("Triggered Bored Apes");
  return processTransfer(ctx, astarBoredApesContract);
}
