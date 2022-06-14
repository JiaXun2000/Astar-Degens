// src/contract.ts
import { assertNotNull, EvmLogHandlerContext, Store } from "@subsquid/substrate-evm-processor";
import { ethers } from "ethers";
import { Contract, Owner, Token, Transfer } from "./model";
import { events, abi } from "./abi/erc721"

export const CHAIN_NODE = "wss://astar.api.onfinality.io/public-ws";

// First contract instantiation
export const contract = new ethers.Contract(
  "0xd59fC6Bfd9732AB19b03664a45dC29B8421BDA9a".toLowerCase(),
  abi,
  new ethers.providers.WebSocketProvider(CHAIN_NODE)
);

export function createContractEntity(): Contract {
  return new Contract({
    id: contract.address,
    name: "AstarDegens",
    symbol: "DEGEN",
    totalSupply: 10000n,
  });
}

// Second contract instantiation
export const contractAnontherOne = new ethers.Contract(
  "0x8b5d62f396Ca3C6cF19803234685e693733f9779".toLowerCase(),
  abi,
  new ethers.providers.WebSocketProvider(CHAIN_NODE)
);

export function createContractEntityCat(): Contract {
  return new Contract(
    {
      id: contractAnontherOne.address,
      name: "AstarCats",
      symbol: "CAT",
      totalSupply: 7777n,
    }
  )
}


let contractEntity: Contract | undefined;
export async function getContractEntity({
  store,
}: {
  store: Store;
}): Promise<Contract> {
  if (contractEntity == null) {
    contractEntity = await store.get(Contract, contract.address);
  }
  return assertNotNull(contractEntity);
}


let contractEntityCAT: Contract | undefined;                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       
export async function getContractEntityAstarCats({
  store,
}: {
  store: Store;
}): Promise<Contract> {
  if (contractEntityCAT == null) {
    contractEntityCAT = await store.get(Contract, contractAnontherOne.address);
  }
  return assertNotNull(contractEntityCAT);
}


export async function processTransfer(ctx: EvmLogHandlerContext): Promise<void> {
  // await ctx.store.save(new Owner({ id: "XJX"+ctx.substrate.block.height, balance: 0n }));
  const contractLog = await getContractEntity(ctx);
  console.log(`Triggered ${ contractLog.name || '' }`);

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
      uri: await contract.tokenURI(transfer.tokenId),
      contract: await getContractEntity(ctx),
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


export async function processTransferAstarCats(ctx: EvmLogHandlerContext): Promise<void> {
  const contractLog = await getContractEntityAstarCats(ctx);
  console.log(`Triggered ${ contractLog.name || '' }`);
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
  
  // Handling of token
  if (token == null) {
    token = new Token({
      id: transfer.tokenId.toString(),
      uri: await contractAnontherOne.tokenURI(transfer.tokenId),
      contract: await getContractEntityAstarCats(ctx),
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