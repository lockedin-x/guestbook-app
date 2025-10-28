# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a decentralized guest book and community todo list application built on the Base blockchain. Users can connect their Web3 wallets and:
- Post messages that are permanently stored on-chain
- Create community todos (with a small fee)
- Like, complete, and manage todos
- View all todos or just their own

The project consists of:
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
   - **Guestbook Features:**
     - Uses `useReadContract` to fetch messages via `getAllMessages()`
     - Uses `useWriteContract` to post messages via `postMessage(name, message)`
   - **Todo Features:**
     - Fetches todos via `getAllTodos()` and `getUserTodos(address)`
     - Creates todos via `createTodo(title, description)` with fee payment
     - Toggles completion via `toggleTodoComplete(todoId)` (owner only)
     - Deletes todos via `deleteTodo(todoId)` (owner only)
     - Likes/unlikes todos via `likeTodo(todoId)` / `unlikeTodo(todoId)`
     - Tab system to switch between "All Todos" and "My Todos" views
   - Uses `useWaitForTransactionReceipt` to track transaction confirmation
   - Implements hydration safety with `mounted` state

### Smart Contract Architecture
The GuestBook.sol contract (deployed at `0x086f4eC31A85a4E96d30A99bD80018E9d91e4d42`) includes two main features:

**Guestbook Features:**
- **Message struct**: Stores sender address, message text, name, and timestamp
- **Public array**: `messages[]` stores all messages on-chain
- **postMessage()**: Validates non-empty inputs, pushes to array, emits event
- **getAllMessages()**: Returns entire message array (frontend handles display order)
- No moderation or deletion - messages are permanent

**Todo List Features:**
- **TodoItem struct**: Stores id, creator, title, description, completed status, likes, timestamp, exists flag
- **Mappings**: Tracks todos by ID, user todos, and individual likes per todo
- **createTodo()**: Requires `todoCreationFee` payment (0.00001 ETH), validates length limits (title ≤100, description ≤500)
- **toggleTodoComplete()**: Only creator can toggle their todo's completion status
- **deleteTodo()**: Only creator can soft-delete (sets exists=false, preserves data)
- **likeTodo()/unlikeTodo()**: Anyone can like/unlike, prevents duplicate likes
- **getAllTodos()**: Returns all active todos (filters out deleted)
- **getUserTodos()**: Returns active todos for specific address
- **Owner functions**: `updateTodoFee()`, `withdraw()` for collecting fees

### Frontend Patterns

**Hydration Strategy**: Components use `mounted` state to prevent hydration mismatches with Web3 modals and wallet connections. Always check `mounted` before rendering Web3-dependent UI.

**Transaction Flow**:
1. User submits form → `writeContract()` called
2. `isPending` = true (wallet confirmation)
3. `isConfirming` = true (blockchain confirmation)
4. `isSuccess` = true → clear form, refetch all data after 2s delay

**Message Display**: Messages are fetched via `getAllMessages()` and reversed in the frontend (`[...messages].reverse()`) to show newest first. Contract stores chronologically.

**Todo Display**:
- Todos fetched via `getAllTodos()` or `getUserTodos(address)` depending on active tab
- Reversed to show newest first
- Completed todos shown with green gradient and opacity
- Owner sees interactive checkbox and delete button
- Everyone can like todos
- "You" badge shown on user's own todos

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
- **Character limits**:
  - Guestbook: Name (50 chars), Message (500 chars)
  - Todos: Title (100 chars), Description (500 chars)
- **No editing**: Messages are permanent, todos can only be completed/deleted by owner
- **Gas costs**:
  - Users pay gas for all transactions
  - Todo creation requires additional fee (0.00001 ETH) sent to contract
- **Ownership**: Only todo creators can toggle completion or delete their todos
- **Like system**: Users can like/unlike any todo, contract prevents duplicate likes
