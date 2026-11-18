const { ethers } = require("hardhat");
async function main() {
 const net = await ethers.provider.getNetwork();
 const chainId = Number(net.chainId);
 const officialAgentId = process.env.NEXT_PUBLIC_AGENT_ID_CONTRACT || "0x60b9262456de011f7d15a54cdd8c48baaa8b022f";
 let agentIdAddress = officialAgentId;
 // Testnet-only mock makes the task lifecycle testable without assuming Agent ID is deployed on testnet.
 if (chainId === 97) {
   const Mock = await ethers.getContractFactory("MockAgentID");
   const mock = await Mock.deploy(); await mock.waitForDeployment();
   agentIdAddress = await mock.getAddress();
   const [deployer] = await ethers.getSigners();
   await (await mock.setHolder(deployer.address, true)).wait();
   console.log("TEST-ONLY mock Agent ID contract:", agentIdAddress);
   console.log("Test deployer granted mock ID. Do not use this mock on mainnet.");
 }
 const [deployer] = await ethers.getSigners();
 console.log("Deploying from:", deployer.address);
 const Hub = await ethers.getContractFactory("WUDAOAgentHub");
 const hub = await Hub.deploy(agentIdAddress);
 await hub.waitForDeployment();
 console.log("WUDAOAgentHub deployed:", await hub.getAddress());
 console.log("Agent ID contract used:", agentIdAddress);
 console.log("Network chain ID:", chainId);
}
main().catch(e=>{console.error(e);process.exitCode=1;});