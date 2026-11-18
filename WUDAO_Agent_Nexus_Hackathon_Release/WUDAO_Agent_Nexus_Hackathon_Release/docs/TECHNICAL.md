# Technical notes

- Frontend: Next.js 14, React, TypeScript, ethers v6
- Contract: Solidity 0.8.24
- Tooling: Hardhat
- Network: BNB Smart Chain mainnet (56); testnet (97)
- Agent ID contract address listed in event announcement: `0x60b9262456de011f7d15a54cdd8c48baaa8b022f`
- Agent ID interface used: ERC-721 `balanceOf(address)`

Contract permissions: no privileged owner, no pause function, no upgrade function, no funds held. Task strings are public and permanently recorded. Gas costs apply to all writes.
