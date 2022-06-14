import { EvmLogHandlerContext } from "@subsquid/substrate-evm-processor";
import { ethers } from "ethers";
import { Contract } from "../model";
import { abi } from "../abi/erc721";
import { CHAIN_NODE, processTransfer } from "../contract";

export const starCardsContract = new ethers.Contract(
    "0xDECA4Af02ecD70a82D0E810D707E4fEB53C25206".toLowerCase(),
    abi,
    new ethers.providers.WebSocketProvider(CHAIN_NODE)
);

export function createContractEntityStarCards(): Contract {
    return new Contract({
      id: starCardsContract.address,
      name: "StarCards",
      symbol: "StarCards",
      totalSupply: 1000n,
    });
}

export async function processTransferStarCards(ctx: EvmLogHandlerContext): Promise<void> {
  return processTransfer(ctx, starCardsContract);
}