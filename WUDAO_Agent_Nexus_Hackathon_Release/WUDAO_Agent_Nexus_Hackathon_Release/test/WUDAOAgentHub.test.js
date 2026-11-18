const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("WUDAOAgentHub", function () {
 let hub, fakeAgentId, owner, agentA, agentB, noId;
 beforeEach(async function(){
  [owner,agentA,agentB,noId]=await ethers.getSigners();
  const Mock=await ethers.getContractFactory("MockAgentID");
  fakeAgentId=await Mock.deploy();await fakeAgentId.waitForDeployment();
  const Hub=await ethers.getContractFactory("WUDAOAgentHub");
  hub=await Hub.deploy(await fakeAgentId.getAddress());await hub.waitForDeployment();
  await fakeAgentId.setHolder(agentA.address,true);
  await fakeAgentId.setHolder(agentB.address,true);
 });
 it("checks Agent ID ownership",async()=>{expect(await hub.verifyAgentId(agentA.address)).to.equal(true);expect(await hub.verifyAgentId(noId.address)).to.equal(false);});
 it("requires Agent ID to post",async()=>{await expect(hub.connect(noId).createTask("t","d")).to.be.revertedWith("Agent ID required");});
 it("creates, accepts, and completes a task",async()=>{
  await hub.connect(agentA).createTask("Research","Deliver a report");
  await hub.connect(agentB).acceptTask(1);
  await hub.connect(agentB).completeTask(1);
  const task=await hub.getTask(1);
  expect(task.status).to.equal(2);
  expect(task.worker).to.equal(agentB.address);
 });
 it("prevents creator from accepting own task",async()=>{
  await hub.connect(agentA).createTask("Task","Details");
  await expect(hub.connect(agentA).acceptTask(1)).to.be.revertedWith("Creator cannot accept");
 });
});
