// src/processor.ts
import { SubstrateEvmProcessor , BlockHandlerContext} from "@subsquid/substrate-evm-processor";
import { lookupArchive } from "@subsquid/archive-registry";
import {
  CHAIN_NODE,
  createContractEntity,
  createContractEntityCat,
  processTransfer,
  processTransferAstarCats,
} from "./contract";
import {createContractEntityASF, processTransferASF}              from "./helpers/AstarStudentFaucet";
import {createContractEntitySamui, processTransferSamui}          from "./helpers/SamuiSkywalker"
import {createContractEntityAWD, processTransferAWD}              from "./helpers/AstarWeb3Domains"
import {createContractEntityNICO, processTransferNICO}            from "./helpers/NikaConqueror"
import {createContractEntityANAUT, processTransferANAUT}          from "./helpers/Astarnaut"
import {createContractEntityAP, processTransferAP}                from "./helpers/AstarPunks"
import {createContractEntityStarCards, processTransferStarCards}  from "./helpers/StarCards"
import {createContractEntityASW, processTransferASW}              from "./helpers/AstarSignWitch"
import {createContractEntityABA, processTransferABA}              from "./helpers/AstarBoredApes"



import { events } from "./abi/erc721";
//import { Contract, Owner, Token, Transfer } from "./model";
const processor = new SubstrateEvmProcessor("astar-substrate");

processor.setBatchSize(600);
processor.setTypesBundle("astar");
processor.setDataSource({chain: CHAIN_NODE, archive: lookupArchive("astar")[0].url, });

processor.setBlockRange({ from:442693} ) //1163310 442692  442693

processor.addPreHook({ range: { from: 442693, to: 442693} }, async (ctx:BlockHandlerContext ) => { //0         551408
//await ctx.store.save(new Owner({ id: ctx.block.height, balance: 0n }));
  await ctx.store.save(createContractEntity());
});

processor.addPreHook({ range: { from: 469669, to: 469669} }, async (ctx:BlockHandlerContext ) => {await ctx.store.save(createContractEntityAP())});
processor.addPreHook({ range: { from: 551408, to: 551408} }, async (ctx:BlockHandlerContext ) => {await ctx.store.save(createContractEntityABA())});
processor.addPreHook({ range: { from: 697450, to: 697450} }, async (ctx:BlockHandlerContext ) => {await ctx.store.save(createContractEntityASF())});
processor.addPreHook({ range: { from: 800854, to: 800854} }, async (ctx:BlockHandlerContext ) => {await ctx.store.save(createContractEntityCat())});
processor.addPreHook({ range: { from: 814723, to: 814723} }, async (ctx:BlockHandlerContext ) => {await ctx.store.save(createContractEntityNICO())});
processor.addPreHook({ range: { from: 828350, to: 828350} }, async (ctx:BlockHandlerContext ) => {await ctx.store.save(createContractEntityANAUT())});
processor.addPreHook({ range: { from: 854698, to: 854698} }, async (ctx:BlockHandlerContext ) => {await ctx.store.save(createContractEntityAWD())});
processor.addPreHook({ range: { from: 961304, to: 961304} }, async (ctx:BlockHandlerContext ) => {await ctx.store.save(createContractEntityStarCards())});
processor.addPreHook({ range: { from: 1114966, to: 1114966} }, async (ctx:BlockHandlerContext ) => {await ctx.store.save(createContractEntityASW())});
processor.addPreHook({ range: { from: 1173555, to: 1173555} }, async (ctx:BlockHandlerContext ) => {await ctx.store.save(createContractEntitySamui())});


processor.addEvmLogHandler(
  "0xd59fC6Bfd9732AB19b03664a45dC29B8421BDA9a".toLowerCase(),
  {
    range: {from:442693},
    filter: [events["Transfer(address,address,uint256)"].topic]
  },
  processTransfer
);

processor.addEvmLogHandler("0x1b57C69838cDbC59c8236DDa73287a4780B4831F".toLowerCase(),{range: {from:469669},filter: [events["Transfer(address,address,uint256)"].topic]},processTransferAP);
processor.addEvmLogHandler("0xC5F0B515a1712D0C7234d2361412EabB5061EA85".toLowerCase(),{range: {from:551408},filter: [events["Transfer(address,address,uint256)"].topic]},processTransferABA);
processor.addEvmLogHandler("0x26DA9C05A9f7bcEFb9e342Bb35FA8aE338F9cCed".toLowerCase(),{range: {from:697450},filter: [events["Transfer(address,address,uint256)"].topic]},processTransferASF);
processor.addEvmLogHandler("0x8b5d62f396Ca3C6cF19803234685e693733f9779".toLowerCase(),{range: {from:800854},filter: [events["Transfer(address,address,uint256)"].topic]},processTransferAstarCats);
processor.addEvmLogHandler("0xE6cB7CE7737D9ffA29267fcBdD0940Ee624d897D".toLowerCase(),{range: {from:814723},filter: [events["Transfer(address,address,uint256)"].topic]},processTransferNICO);
processor.addEvmLogHandler("0xf008371a7EeD0AB54FDd975fE0d0f66fEFBA3415".toLowerCase(),{range: {from:828350},filter: [events["Transfer(address,address,uint256)"].topic]},processTransferANAUT);
processor.addEvmLogHandler("0xA1019535E6b364523949EaF45F4B17521c1cb074".toLowerCase(),{range: {from:854698},filter: [events["Transfer(address,address,uint256)"].topic]},processTransferAWD);
processor.addEvmLogHandler("0xDECA4Af02ecD70a82D0E810D707E4fEB53C25206".toLowerCase(),{range: {from:961304},filter: [events["Transfer(address,address,uint256)"].topic]},processTransferStarCards);
processor.addEvmLogHandler("0x7b2152e51130439374672af463b735a59a47ea85".toLowerCase(),{range: {from:1114966},filter: [events["Transfer(address,address,uint256)"].topic]},processTransferASW);
processor.addEvmLogHandler("0x7b458a1aA7d42A74c6f96E45797358c1FDDD496C".toLowerCase(),{range: {from:1173555},filter: [events["Transfer(address,address,uint256)"].topic]},processTransferSamui);

processor.run();
