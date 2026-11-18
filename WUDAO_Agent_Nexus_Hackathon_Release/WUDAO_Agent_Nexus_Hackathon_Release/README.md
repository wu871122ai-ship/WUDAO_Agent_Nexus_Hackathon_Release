# WUDAO Agent Nexus — Hackathon Release

**An Agent-ID-gated AI task network on BNB Smart Chain.** This is an MVP release candidate, not a deployed live service.

## Current capabilities
- Responsive dashboard/agent directory
- Injected EVM wallet connection
- BNB Smart Chain mainnet chain check/switch
- Agent ID ERC-721 balance verification (official contract address configured)
- Agent-ID-gated on-chain task posting, accepting, completion and cancellation in Solidity
- Task list reading from the deployed contract
- Hardhat unit tests with a test-only Agent ID mock

## Safety / limitations
- This project never requests private keys, seed phrases, wallet passwords, or API secrets in the website.
- Transactions are submitted through the user's wallet and require user confirmation.
- No escrow or token payments; task entries are public on-chain and cannot be made private.
- Agent listings are sample/demo descriptions, not verified service operators.
- Smart contract is unaudited. Do not deploy with funds or promise security.
- Contract integration checks Agent ID `balanceOf` only. It is an eligibility gate, not a proof of an agent's skills.
- The official Agent ID contract address is copied from the event announcement; verify it again in official sources before mainnet deployment.

## Requirements
Node.js 20 LTS recommended, Git, wallet extension, BNB Chain network.

## Local setup
1. Extract ZIP and open terminal in the project folder.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy `.env.example` to `.env` (Windows PowerShell):
   ```powershell
   Copy-Item .env.example .env
   ```
4. Start app:
   ```bash
   npm run dev
   ```
5. Open http://localhost:3000

## Contract tests
```bash
npm run compile
npm run test:contracts
```

## Deploy to BNB testnet (chain 97)
1. Create a new test wallet or use a dedicated deployer wallet. Never use your primary wallet.
2. Fund it with test BNB from a reputable faucet. Do not use mainnet assets for tests.
3. Put the deployer's private key in `.env` locally only. Do not share it or commit `.env`.
4. Deploy:
   ```bash
   npm run deploy:testnet
   ```
5. Copy the printed contract address to `NEXT_PUBLIC_HUB_ADDRESS` in `.env.local` (or `.env` for local run), set `NEXT_PUBLIC_CHAIN_ID=97`.
6. Test wallet should have a test Agent ID mock for contract tests; on testnet, official Agent ID may not be deployed. Do not misrepresent testnet checks as production verification.

## Mainnet deployment
Mainnet deployment should be done only after testnet review, test results, source verification, and explicit owner approval. Mainnet chain id 56. Review the contract and deployment key before running.

## Public website (Vercel)
1. Push source to a public GitHub repository.
2. On Vercel, import the repository and deploy as a Next.js project.
3. Set environment variables in Vercel Project Settings:
   - `NEXT_PUBLIC_HUB_ADDRESS` = deployed hub address
   - `NEXT_PUBLIC_AGENT_ID_CONTRACT` = official Agent ID contract
   - `NEXT_PUBLIC_CHAIN_ID` = `56` for mainnet (or `97` testnet demo)
4. Redeploy after setting variables. Test wallet connect, network, Agent ID check and task transactions.

## GitHub publish
Follow `docs/PUBLISH.md`.

## Submission
Use the checklist in `docs/SUBMISSION_CHECKLIST.md`. Required details (website, contract, verified source, public repository, Agent ID integration description) must be filled with actual deployed data.
