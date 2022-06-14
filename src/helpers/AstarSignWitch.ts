import { EvmLogHandlerContext } from "@subsquid/substrate-evm-processor";
import { ethers } from "ethers";
import { Contract } from "../model";
import { abi } from "../abi/erc721";
import { CHAIN_NODE, processTransfer } from "../contract";

export const astarSignWitchContract = new ethers.Contract(
    "0x7b2152e51130439374672af463b735a59a47ea85".toLowerCase(),
    abi,
    new ethers.providers.WebSocketProvider(CHAIN_NODE)
);

export function createContractEntityASW(): Contract {
    return new Contract({
      id: astarSignWitchContract.address,
      name: "AstarSignWitch",
      symbol: "ASW",
      totalSupply: 11036n,
    });
}

export async function processTransferASW(ctx: EvmLogHandlerContext): Promise<void> {
  console.log("Triggered AstarSignWitch");
  return processTransfer(ctx, astarSignWitchContract);
}