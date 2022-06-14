import { EvmLogHandlerContext } from "@subsquid/substrate-evm-processor";
import { ethers } from "ethers";
import { Contract } from "../model";
import { abi } from "../abi/erc721";
import { CHAIN_NODE, processTransfer } from "../contract";

export const nikaConquerorContract = new ethers.Contract(
    "0xE6cB7CE7737D9ffA29267fcBdD0940Ee624d897D".toLowerCase(),
    abi,
    new ethers.providers.WebSocketProvider(CHAIN_NODE)
);

export function createContractEntityNICO(): Contract {
    return new Contract({
      id: nikaConquerorContract.address,
      name: "NikaConqueror",
      symbol: "NICO",
      totalSupply: 4440n,
    });
}

export async function processTransferNICO(ctx: EvmLogHandlerContext): Promise<void> {
  console.log("Triggered NikaConqueror");
  return processTransfer(ctx, nikaConquerorContract);
}