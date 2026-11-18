# Publish to GitHub and public web

## A. GitHub (public source code)
1. Create/sign in to GitHub.
2. Create a new repository named `wudao-agent-nexus`; choose **Public**; do not initialize with files.
3. Install Git if needed, then in project folder run:
   ```bash
   git init
   git add .
   git commit -m "Initial WUDAO Agent Nexus hackathon release"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/wudao-agent-nexus.git
   git push -u origin main
   ```
4. Replace `YOUR_USERNAME` with your account name. Check the repo's Code page is public.
5. Never add `.env`, private keys, seed phrases, or wallet backup files. `.gitignore` already excludes `.env`.

## B. Deploy the public website (Vercel)
1. Visit https://vercel.com and sign in (GitHub sign-in).
2. Click **Add New → Project**, import `wudao-agent-nexus`.
3. Framework should detect Next.js. Build command: `npm run build`; output settings leave defaults.
4. Add environment variables (after contract deployment):
   - `NEXT_PUBLIC_HUB_ADDRESS`: deployed contract address
   - `NEXT_PUBLIC_AGENT_ID_CONTRACT`: official Agent ID contract address
   - `NEXT_PUBLIC_CHAIN_ID`: 56 (mainnet) or 97 (testnet)
5. Click Deploy. Once successful, copy the `*.vercel.app` URL and test it in a private browser and on mobile.
6. Every later GitHub push triggers a deployment (if integration remains enabled).

## C. Optional custom domain
In Vercel Project → Settings → Domains, add the domain you own, then follow the DNS records shown by Vercel. Do not guess DNS values.

## D. Verify publicly visible
- Open the URL from another device/network.
- Confirm no login is required to view public pages.
- Test wallet connection and check contract address on the explorer.
