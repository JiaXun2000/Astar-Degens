import { EvmLogHandlerContext } from "@subsquid/substrate-evm-processor";
import { ethers } from "ethers";
import { Contract } from "../model";
import { abi } from "../abi/erc721";
import { CHAIN_NODE, processTransfer } from "../contract";

export const astarDegensContract = new ethers.Contract(
  "0xd59fC6Bfd9732AB19b03664a45dC29B8421BDA9a".toLowerCase(),
  abi,
  new ethers.providers.WebSocketProvider(CHAIN_NODE)
);

export function createAstarDegenContract(): Contract {
  return new Contract({
    id: astarDegensContract.address,
    name: "AstarDegens",
    symbol: "DEGEN",
    totalSupply: 10000n,
  });
}

export async function processAstarDegenTransfers(
  ctx: EvmLogHandlerContext
): Promise<void> {
  return processTransfer(ctx, astarDegensContract);
}
