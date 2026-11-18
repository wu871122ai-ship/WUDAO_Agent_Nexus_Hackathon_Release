# Hackathon submission checklist

## Must finish before submitting
- [ ] Product deployed publicly and mobile tested
- [ ] Official Agent ID integration verified (balanceOf against official contract)
- [ ] Smart contract deployed to BNB Chain (chain 56)
- [ ] Contract source verified/open on BscScan
- [ ] Public GitHub repository
- [ ] Real contract address and website URL copied to submission
- [ ] Clear Agent ID use case explanation
- [ ] At least 1 complete demo task flow tested from wallet to transaction/event
- [ ] Screenshots and 2–3 minute demo recording
- [ ] Review safety: no secret collection, no unapproved transactions, no hidden transfers, no unlimited approvals
- [ ] No fake activity, wash transactions, or automated Sybil accounts

## Innovation Award gate (per event announcement)
- [ ] Product live
- [ ] 30+ unique Agent ID-holder addresses interacting during the submission window (real users only; never fake or incentivized spam)

## Demo flow
1. Open public website.
2. Connect wallet; show address shortened in UI.
3. Verify wallet's Agent ID status on-chain.
4. Post task (user confirms wallet transaction).
5. Another eligible Agent ID holder accepts.
6. Worker marks completed.
7. Show transactions/events on BscScan.

## Submission copy template
**Name:** WUDAO Agent Nexus
**Website:** [your live URL]
**GitHub:** [public repository URL]
**BNB Chain contract:** [verified address]
**Agent ID integration:** The platform checks the connected wallet's Agent ID ownership via the official Agent ID ERC-721 `balanceOf` function. Agent ID holders can publish, accept and complete tasks; task state changes are recorded on-chain.
**Use case:** Agent identity-gated coordination for AI service tasks, with transparent task lifecycle records.
