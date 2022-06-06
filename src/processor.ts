// src/processor.ts
import { SubstrateEvmProcessor , BlockHandlerContext} from "@subsquid/substrate-evm-processor";
import { lookupArchive } from "@subsquid/archive-registry";
import {
  CHAIN_NODE,
  contract,
  createContractEntity,
  processTransfer,
} from "./contract";
import { events } from "./abi/erc721";
//import { Contract, Owner, Token, Transfer } from "./model";
const processor = new SubstrateEvmProcessor("astar-substrate");

processor.setBatchSize(500);
processor.setTypesBundle("astar");
processor.setDataSource({
  chain: CHAIN_NODE,
  archive: lookupArchive("astar")[0].url,
});
processor.setBlockRange({ from:442692} ) //1163310 442692
processor.addPreHook({ range: { from: 0, to: 0 } }, async (ctx:BlockHandlerContext ) => {
//await ctx.store.save(new Owner({ id: ctx.block.height, balance: 0n }));
  await ctx.store.save(createContractEntity());
});

processor.addEvmLogHandler(
  "0xd59fC6Bfd9732AB19b03664a45dC29B8421BDA9a".toLowerCase(),
  {
    range: {from:442692},
    filter: [events["Transfer(address,address,uint256)"].topic]
  },
  processTransfer
);

processor.run();
