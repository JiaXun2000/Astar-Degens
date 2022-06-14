import { EvmLogHandlerContext } from "@subsquid/substrate-evm-processor";
import { ethers } from "ethers";
import { Contract } from "../model";
import { abi } from "../abi/erc721";
import { CHAIN_NODE, processTransfer } from "../contract";

export const samuiSkywalkerContract = new ethers.Contract(
    "0x7b458a1aA7d42A74c6f96E45797358c1FDDD496C".toLowerCase(),
    abi,
    new ethers.providers.WebSocketProvider(CHAIN_NODE)
);

export function createContractEntitySamui(): Contract {
    return new Contract({
      id: samuiSkywalkerContract.address,
      name: "SamuiSkywalker",
      symbol: "Samui",
      totalSupply: 1000n,
    });
}
export async function processTransferSamui(ctx: EvmLogHandlerContext): Promise<void> {
  console.log("Triggered SamuiSkywalker");
  return processTransfer(ctx, samuiSkywalkerContract);
}