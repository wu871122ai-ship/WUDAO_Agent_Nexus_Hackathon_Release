 "use client";

import { useState } from "react";
import { ethers } from "ethers";
import { Activity, ArrowUpRight, Bot, CheckCircle2, CircleDot, ClipboardList, Compass, Github, Globe, ShieldCheck, Wallet, Zap } from "lucide-react";

const AGENT_ID_CONTRACT = process.env.NEXT_PUBLIC_AGENT_ID_CONTRACT || "0x60b9262456de011f7d15a54cdd8c48baaa8b022f";
const TARGET_CHAIN_ID = Number(process.env.NEXT_PUBLIC_CHAIN_ID || 56);
const AGENT_ABI = ["function balanceOf(address owner) view returns (uint256)"];
const HUB_ABI = [
 "function createTask(string calldata title,string calldata details) external returns (uint256)",
 "function acceptTask(uint256 taskId) external",
 "function completeTask(uint256 taskId) external",
 "function taskCount() view returns (uint256)",
 "function getTask(uint256 taskId) view returns (address creator,address worker,string title,string details,uint8 status,uint64 createdAt)"
];

type Task = { id:number; title:string; details:string; creator:string; worker:string; status:number; createdAt:number };
const demoAgents = [
 {name:"WUDAO Builder",tag:"BUILD",description:"Builds and reviews web app prototypes, code structure and implementation plans.",badge:"Developer Agent"},
 {name:"Research Scout",tag:"RESEARCH",description:"Turns research questions into sourced summaries and structured analysis.",badge:"Research Agent"},
 {name:"Document Studio",tag:"CONTENT",description:"Creates product briefs, documentation, pitch material and content drafts.",badge:"Content Agent"}
];

export default function Home() {
 const [section,setSection]=useState("Overview");
 const [address,setAddress]=useState("");
 const [agentId,setAgentId]=useState(false);
 const [agentBalance,setAgentBalance]=useState("—");
 const [chain,setChain]=useState("");
 const [hub,setHub]=useState(process.env.NEXT_PUBLIC_HUB_ADDRESS||"");
 const [tasks,setTasks]=useState<Task[]>([]);
 const [title,setTitle]=useState("");
 const [details,setDetails]=useState("");
 const [message,setMessage]=useState("");
 const [busy,setBusy]=useState(false);

 async function connect() {
  const eth=(window as any).ethereum;
  if(!eth){setMessage("No injected EVM wallet detected. Install a compatible wallet.");return;}
  try {
   const accts=await eth.request({method:"eth_requestAccounts"});
   const addr=accts?.[0];
   if(!addr)return;
   const cid=await eth.request({method:"eth_chainId"});
   setAddress(addr);setChain(cid);
   if(parseInt(cid,16)!==TARGET_CHAIN_ID) setMessage(`Wallet connected. Please switch to configured BNB network (Chain ID ${TARGET_CHAIN_ID}).`);
   else setMessage("Wallet connected to configured BNB network.");
   await checkAgent(addr,eth);
  }catch(e:any){setMessage(e?.message||"Wallet connection failed.");}
 }
 async function checkAgent(addr:string,eth:any) {
  try {
   const provider=new ethers.BrowserProvider(eth);
   const c=new ethers.Contract(AGENT_ID_CONTRACT,AGENT_ABI,provider);
   const n=await c.balanceOf(addr);
   setAgentBalance(n.toString());setAgentId(n>0n);
  }catch(e:any){setAgentBalance("Check failed");setAgentId(false);setMessage("Could not read Agent ID balance. Check network and contract address.");}
 }
 async function switchChain() {
  const eth=(window as any).ethereum;
  try { const targetHex="0x"+TARGET_CHAIN_ID.toString(16); await eth.request({method:"wallet_switchEthereumChain",params:[{chainId:targetHex}]});setChain(targetHex);if(address)await checkAgent(address,eth);setMessage("Network switched.");}
  catch(e:any){setMessage(e?.message||"Chain switch failed.");}
 }
 async function submitTask(){
  if(!title.trim()||!details.trim()){setMessage("Please enter task title and details.");return;}
  if(!address){setMessage("Connect wallet first.");return;}
  if(!agentId){setMessage("Agent ID ownership is required by this prototype's task-posting gate.");return;}
  if(!hub||!ethers.isAddress(hub)){setMessage("Hub contract address is not configured. Set NEXT_PUBLIC_HUB_ADDRESS after deployment.");return;}
  setBusy(true);
  try{
   const eth=(window as any).ethereum;const p=new ethers.BrowserProvider(eth);const signer=await p.getSigner();
   const c=new ethers.Contract(hub,HUB_ABI,signer);
   const tx=await c.createTask(title.trim(),details.trim());setMessage("Transaction submitted: "+tx.hash);
   await tx.wait();setMessage("Task published on-chain! Tx: "+tx.hash);
   setTitle("");setDetails("");
  }catch(e:any){setMessage(e?.shortMessage||e?.message||"Transaction failed.");}
  finally{setBusy(false);}
 }
 async function loadTasks(){
  if(!hub||!ethers.isAddress(hub)){setMessage("Set contract address after deployment to load on-chain tasks.");return;}
  try{
   const eth=(window as any).ethereum;const p=new ethers.BrowserProvider(eth);const c=new ethers.Contract(hub,HUB_ABI,p);
   const count=Number(await c.taskCount());const list:Task[]=[];
   for(let i=Math.max(1,count-20);i<=count;i++){const t=await c.getTask(i);list.push({id:i,creator:t.creator,worker:t.worker,title:t.title,details:t.details,status:Number(t.status),createdAt:Number(t.createdAt)});}
   setTasks(list.reverse());setMessage(`Loaded ${list.length} on-chain task(s).`);
  }catch(e:any){setMessage(e?.shortMessage||e?.message||"Read failed.");}
 }
 async function accept(id:number){
  try{if(!address||!hub){setMessage("Connect wallet and configure deployed hub.");return;}
   const p=new ethers.BrowserProvider((window as any).ethereum);const s=await p.getSigner();const c=new ethers.Contract(hub,HUB_ABI,s);
   const tx=await c.acceptTask(id);setMessage("Acceptance transaction sent.");await tx.wait();setMessage("Task accepted on-chain.");await loadTasks();
  }catch(e:any){setMessage(e?.shortMessage||e?.message||"Could not accept task.");}
 }
 async function complete(id:number){
  try{if(!address||!hub){setMessage("Connect wallet and configure deployed hub.");return;}
   const p=new ethers.BrowserProvider((window as any).ethereum);const s=await p.getSigner();const c=new ethers.Contract(hub,HUB_ABI,s);
   const tx=await c.completeTask(id);setMessage("Completion transaction sent.");await tx.wait();setMessage("Task completed on-chain.");await loadTasks();
  }catch(e:any){setMessage(e?.shortMessage||e?.message||"Could not complete task.");}
 }
 const nav=[["Overview",Compass],["Agent Market",Bot],["Task Center",ClipboardList],["Activity",Activity]];
 return <main className="app">
  <aside className="sidebar"><div className="brand"><div className="logo">W</div><div><b>WUDAO</b><small>AGENT NEXUS</small></div></div>
   <div className="navcap">WORKSPACE</div>{nav.map(([name,Icon]:any)=><button key={name} className={"nav "+(section===name?"selected":"")} onClick={()=>setSection(name)}><Icon size={17}/>{name}</button>)}
   <div className="sidefoot"><span className="liveDot"/> HACKATHON MVP<br/><small>BNB Smart Chain · Agent ID</small></div>
  </aside>
  <div className="content">
   <header className="top"><div><span className="kicker">DECENTRALIZED AGENT WORKSPACE</span><h1>{section}</h1></div><button className="connect" onClick={connect}><Wallet size={16}/>{address?address.slice(0,6)+"…"+address.slice(-4):"Connect wallet"}</button></header>
   {message&&<div className="notice">{message}<button onClick={()=>setMessage("")}>×</button></div>}
   {section==="Overview"&&<>
    <section className="hero"><div className="heroText"><span className="tag"><Zap size={14}/> AGENT ID · ON-CHAIN TASKS</span><h2>Give agents an identity.<br/><em>Build a network of trust.</em></h2><p>Discover AI services, publish tasks, and make identity and collaboration activity verifiable on BNB Smart Chain.</p><button className="gold" onClick={()=>setSection("Agent Market")}>Explore agents <ArrowUpRight size={16}/></button></div><div className="sphere"><div className="sphereCore"><Bot size={46}/><span>NEXUS</span></div></div></section>
    <div className="stats"><div><small>Agent ID status</small><strong>{address?(agentId?"Verified holder":"Not detected"):"Connect wallet"}</strong><span>{address?`Balance: ${agentBalance}`:"Verify on-chain ownership"}</span></div><div><small>Network</small><strong>{chain==="0x38"?"BNB Smart Chain":chain?"Wrong network":"Not connected"}</strong><span>Chain ID 56</span></div><div><small>Task contract</small><strong>{hub?"Configured":"Not configured"}</strong><span>Deployment required</span></div></div>
    <div className="sectiontitle"><div><h3>Featured agents</h3><p>Explore service agents</p></div><button className="plain" onClick={()=>setSection("Agent Market")}>See all →</button></div>
    <div className="cards">{demoAgents.map(a=><AgentCard key={a.tag} a={a}/>)}</div>
    <div className="panel rowpanel"><div><ShieldCheck/><div><b>Agent ID verification</b><p>Wallet ownership is checked against the official Agent ID ERC-721 contract.</p></div></div><button className="outline" onClick={()=>address?checkAgent(address,(window as any).ethereum):connect()}>Verify wallet</button></div>
   </>}
   {section==="Agent Market"&&<><div className="sectiontitle"><div><h3>Agent Directory</h3><p>Demo agent listings; not external service providers yet.</p></div></div><div className="cards">{demoAgents.map(a=><AgentCard key={a.tag} a={a}/>)}</div></>}
   {section==="Task Center"&&<div className="tasklayout"><div className="panel"><h3>Publish a task</h3><p>Requires connected wallet with Agent ID. Submission requires an on-chain transaction and gas.</p><label>Task title</label><input value={title} onChange={e=>setTitle(e.target.value)} placeholder="e.g. Research BNB agent identity use cases"/><label>Task details</label><textarea value={details} onChange={e=>setDetails(e.target.value)} placeholder="Describe requirements, deliverables, and acceptance criteria."/><button className="gold wide" disabled={busy} onClick={submitTask}>{busy?"Waiting…":"Publish on-chain"}</button></div><div className="panel"><div className="panelHead"><div><h3>On-chain tasks</h3><p>Read from deployed hub contract</p></div><button className="outline" onClick={loadTasks}>Refresh</button></div>{tasks.length===0?<div className="empty">No tasks loaded. Deploy contract and refresh.</div>:tasks.map(t=><div className="task" key={t.id}><b>#{t.id} · {t.title}</b><p>{t.details}</p><small>Status: {["Open","Accepted","Completed","Cancelled"][t.status]||"Unknown"}</small><div className="taskActions">{t.status===0&&<button className="outline" onClick={()=>accept(t.id)}>Accept task</button>}{t.status===1&&t.worker.toLowerCase()===address.toLowerCase()&&<button className="outline" onClick={()=>complete(t.id)}>Mark complete</button>}</div></div>)}</div></div>}
   {section==="Activity"&&<div className="panel"><h3>Activity & reputation</h3><p>Reputation data is based on emitted contract events. After deployment, use BscScan to independently verify transactions and event logs.</p><div className="checks"><div><CheckCircle2/> Wallet connect prototype</div><div><CheckCircle2/> Agent ID on-chain ownership check</div><div><CircleDot/> Contract deployment & source verification pending</div><div><CircleDot/> Live user activity pending</div></div></div>}
   <footer>WUDAO Agent Nexus · Hackathon MVP · User-controlled transactions only</footer>
  </div>
 </main>;
}
function AgentCard({a}:{a:any}){return <article className="agentcard"><div className="agentmark"><Bot size={21}/></div><span className="agentbadge">{a.badge}</span><h4>{a.name}</h4><div className="fakeid">{a.tag.toLowerCase()}.agent · demo listing</div><p>{a.description}</p><div className="cardfoot"><span>Service profile</span><ArrowUpRight size={16}/></div></article>}
