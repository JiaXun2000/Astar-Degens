// src/contract.ts
import { assertNotNull, EvmLogHandlerContext, Store } from "@subsquid/substrate-evm-processor";
import { ethers } from "ethers";
import { Contract, Owner, Token, Transfer } from "./model";
import { events } from "./abi/erc721"

export const CHAIN_NODE = "wss://astar.api.onfinality.io/public-ws";

export async function getContractEntity({
  store,
}: {
  store: Store;
}, ethersContract: ethers.Contract, contractEntity: Contract | undefined): Promise<Contract> {
  if (contractEntity == null) {
    contractEntity = await store.get(Contract, ethersContract.address);
  }
  return assertNotNull(contractEntity);
}

export async function processTransfer(ctx: EvmLogHandlerContext, ethersContract: ethers.Contract): Promise<void> {
  // await ctx.store.save(new Owner({ id: "XJX"+ctx.substrate.block.height, balance: 0n }));
  // const contractLog = await getContractEntity(ctx, ethersContract, undefined);
  // console.log(`Triggered ${ contractLog.name || '' }`);

  // A single event in ctx
  const transfer =
    events["Transfer(address,address,uint256)"].decode(ctx);

  // Instantiation of From、To、Token
  let from = await ctx.store.get(Owner, transfer.from);
  let to = await ctx.store.get(Owner, transfer.to);
  let token = await ctx.store.get(Token, transfer.tokenId.toString());

  // Handling of From
  if (from == null) {
    from = new Owner({ id: transfer.from, ownedTokens: new Array<string>(), balance: BigInt(0) });
    await ctx.store.save(from);
  }else {
    const ownedTokensSize = from.ownedTokens ? from.ownedTokens.length : 0;
    for(let i = 0; i <= ownedTokensSize - 1; i += 1){
      if(from.ownedTokens[i] === transfer.tokenId.toString()){
        const lastFromArrayNums = ownedTokensSize > 1 ? from.ownedTokens[ownedTokensSize - 1] : from.ownedTokens[0];
        from.ownedTokens[i] = lastFromArrayNums;
        from.ownedTokens.pop();
        break;
      }
    }
    // if(from.ownedTokens === undefined) {
    //  from.ownedTokens = []
    // }
    from.balance = BigInt(from.ownedTokens.length);
    await ctx.store.save(from);
  }

  // Handling of To
  if (to == null) {
    to = new Owner({ id: transfer.to, ownedTokens: new Array<string>(), balance: BigInt(0) });
    await ctx.store.save(to);
  }

  // Handling of Token 
  if (token == null) {
    token = new Token({
      id: transfer.tokenId.toString(),
      uri: await ethersContract.tokenURI(transfer.tokenId),
      contract: await getContractEntity(ctx, ethersContract, undefined),
      owner: to,
    });
    await ctx.store.save(token);
  } else {
    token.owner = to;
    await ctx.store.save(token);
  }
  // if (to.ownedTokens === undefined) {
  //   to.ownedTokens = ["string"];
  // }

  to.ownedTokens.push(transfer.tokenId.toString());
  to.balance = BigInt(to.ownedTokens.length);
  await ctx.store.save(to);

  await ctx.store.save(
    new Transfer({
      id: ctx.txHash,
      token,
      from,
      to,
      timestamp: BigInt(ctx.substrate.block.timestamp),
      block: ctx.substrate.block.height,
      transactionHash: ctx.txHash,
    })
  );
}
