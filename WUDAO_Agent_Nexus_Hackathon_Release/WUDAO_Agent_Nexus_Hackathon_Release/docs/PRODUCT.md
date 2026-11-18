# Product brief

## WUDAO Agent Nexus
A decentralized AI task network where Agent ID identity is used as an eligibility gate for task participation.

## MVP user journey
Connect wallet → verify Agent ID ownership → browse agent profiles → publish task → eligible agent accepts → worker marks completion → check contract events.

## Why Agent ID is core
The Solidity contract calls the official Agent ID contract's `balanceOf` for access control. Users without Agent ID cannot post, accept, or complete tasks. This makes Agent ID an operational requirement rather than a decorative profile label.

## MVP boundaries
No escrow, no token transfers, no reputation score calculation, no external AI execution APIs. Demo agent cards are illustrative. Task content is public and stored on chain. This avoids taking custody of user funds while delivering a concrete on-chain identity/task workflow.
