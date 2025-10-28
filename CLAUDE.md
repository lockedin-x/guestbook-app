# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a decentralized guest book application built on the Base blockchain. Users can connect their Web3 wallets and post messages that are permanently stored on-chain. The project consists of:
- A Next.js 15 frontend (React 19) with Tailwind CSS
- Solidity smart contract deployed on Base mainnet
- Web3 integration using Wagmi v2 and Web3Modal v5

## Development Commands

### Frontend (Next.js)
```bash
# Start development server (runs on http://localhost:3000)
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

### Smart Contract (Hardhat)
```bash
# Navigate to contract directory first
cd contract

# Compile smart contract
npx hardhat compile

# Deploy to Base mainnet (requires PRIVATE_KEY in .env)
npx hardhat run scripts/deploy.js --network base

# Verify contract on BaseScan (requires BASESCAN_API_KEY in .env)
npx hardhat verify --network base <CONTRACT_ADDRESS>
```

## Environment Configuration

### Frontend (.env.local)
- `NEXT_PUBLIC_PROJECT_ID`: WalletConnect Cloud project ID (get from https://cloud.walletconnect.com/)

### Smart Contract (contract/.env)
- `PRIVATE_KEY`: Deployer wallet private key (for deployment only)
- `BASESCAN_API_KEY`: BaseScan API key for contract verification

## Architecture

### Web3 Stack
The app uses a modern Web3 stack with clear separation of concerns:

1. **Web3ModalProvider** (app/context/Web3Modal.jsx): Wraps entire app, configures Wagmi with Base chain only. Uses three connectors:
   - Injected wallets (MetaMask, etc.)
   - WalletConnect (mobile wallets)
   - Coinbase Wallet

2. **Contract Integration** (app/contracts/GuestBook.js): Exports `GUEST_BOOK_ABI` and `CONTRACT_ADDRESS`. This is the single source of truth for contract interaction.

3. **Main Page** (app/page.js): Client-side only component that:
   - Uses `useAccount` hook for wallet connection status
   - Uses `useReadContract` to fetch messages via `getAllMessages()`
   - Uses `useWriteContract` to post messages via `postMessage(name, message)`
   - Uses `useWaitForTransactionReceipt` to track transaction confirmation
   - Implements hydration safety with `mounted` state

### Smart Contract Architecture
The GuestBook.sol contract (deployed at `0x086f4eC31A85a4E96d30A99bD80018E9d91e4d42`) is intentionally simple:
- **Message struct**: Stores sender address, message text, name, and timestamp
- **Public array**: `messages[]` stores all messages on-chain
- **postMessage()**: Validates non-empty inputs, pushes to array, emits event
- **getAllMessages()**: Returns entire message array (frontend handles display order)
- No moderation, deletion, or admin functions - messages are permanent

### Frontend Patterns

**Hydration Strategy**: Components use `mounted` state to prevent hydration mismatches with Web3 modals and wallet connections. Always check `mounted` before rendering Web3-dependent UI.

**Transaction Flow**:
1. User submits form → `writeContract()` called
2. `isPending` = true (wallet confirmation)
3. `isConfirming` = true (blockchain confirmation)
4. `isSuccess` = true → clear form, refetch messages after 2s delay

**Message Display**: Messages are fetched via `getAllMessages()` and reversed in the frontend (`[...messages].reverse()`) to show newest first. Contract stores chronologically.

## Deployment

**Current Contract**: `0x086f4eC31A85a4E96d30A99bD80018E9d91e4d42` on Base mainnet

If deploying a new contract:
1. Deploy contract using Hardhat to Base
2. Update `CONTRACT_ADDRESS` in app/contracts/GuestBook.js
3. Optionally update `GUEST_BOOK_ABI` if contract interface changes
4. Contract is immediately usable (no initialization required)

**Frontend Deployment** (Vercel recommended):
- Supports Next.js 15 with App Router
- Add `NEXT_PUBLIC_PROJECT_ID` environment variable
- Base URL will be used in production (no localhost-specific logic)

## Key Constraints

- **Base network only**: App is configured for Base mainnet (chainId 8453). Multi-chain support would require updating Web3Modal config.
- **No backend**: All data comes from blockchain. No traditional database or API routes.
- **Character limits**: Name (50 chars), Message (500 chars) enforced in frontend and contract
- **No editing/deletion**: Messages are permanent by design
- **Gas costs**: Users pay gas for `postMessage()` transactions
