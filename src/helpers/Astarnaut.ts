import { EvmLogHandlerContext } from "@subsquid/substrate-evm-processor";
import { ethers } from "ethers";
import { Contract } from "../model";
import { abi } from "../abi/erc721";
import { CHAIN_NODE, processTransfer } from "../contract";

export const astarnautContract = new ethers.Contract(
  "0xf008371a7EeD0AB54FDd975fE0d0f66fEFBA3415".toLowerCase(),
  abi,
  new ethers.providers.WebSocketProvider(CHAIN_NODE)
);

export function createContractEntityANAUT(): Contract {
  return new Contract({
    id: astarnautContract.address,
    name: "Astarnaut",
    symbol: "ANAUT",
    totalSupply: 10000n,
  });
}

export async function processTransferANAUT(
  ctx: EvmLogHandlerContext
): Promise<void> {
  console.log("Triggered Astarnauts");
  return processTransfer(ctx, astarnautContract);
}
