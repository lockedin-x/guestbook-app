# Guest Book dApp

A decentralized application for leaving permanent messages and managing shared todo items on the Base blockchain. Users can connect their Web3 wallets or authenticate via Farcaster to interact with on chain features including posting messages, creating todos with social engagement, and sharing content to Warpcast.

## Table of Contents

1. [Overview](#overview)
2. [Features](#features)
3. [Architecture](#architecture)
4. [Prerequisites](#prerequisites)
5. [Installation](#installation)
6. [Configuration](#configuration)
7. [Running the Application](#running-the-application)
8. [Smart Contract](#smart-contract)
9. [API Reference](#api-reference)
10. [Deployment](#deployment)
11. [Troubleshooting](#troubleshooting)
12. [Contributing](#contributing)
13. [License](#license)

## Overview

This application combines two core functionalities into a unified blockchain experience:

**Guest Book Module**: Users can leave permanent messages stored on chain. Each message includes the author name, content, sender address, and timestamp. Messages are immutable once posted.

**Todo List Module**: A community driven task management system where users create todos with an optional creation fee. Features include completion toggling, deletion by creator, and a like/unlike system for social engagement.

Both modules are powered by a single smart contract deployed on Base mainnet, ensuring low transaction costs and fast confirmations while maintaining Ethereum level security.

## Features

### Guest Book

| Capability | Description |
|------------|-------------|
| Post Messages | Submit name and message pairs permanently to the blockchain |
| View History | Browse all messages in chronological order with timestamps |
| Immutable Storage | Messages cannot be edited or deleted after submission |
| Share to Warpcast | One click sharing of messages to Farcaster social network |

### Todo List

| Capability | Description |
|------------|-------------|
| Create Todos | Add titled tasks with optional descriptions (requires creation fee) |
| Toggle Completion | Mark your own todos as complete or incomplete |
| Delete Todos | Remove todos you created from the active list |
| Like System | Support other users todos with likes (one per wallet) |
| Filter by User | View todos from specific wallet addresses |
| Fee Management | Contract owner can adjust creation fees as needed |

### Platform Integration

| Feature | Description |
|---------|-------------|
| Multi Wallet Support | Connect via MetaMask, WalletConnect, Coinbase Wallet, Rainbow, Trust Wallet |
| Farcaster Authentication | Sign in with Farcaster for social identity verification |
| Warpcast Sharing | Direct integration for sharing content to the Farcaster network |
| Mobile Responsive | Full functionality across desktop and mobile devices |

## Architecture

```
guestbook-app/
├── app/
│   ├── api/                    # API routes (Farcaster, Frames, OG images)
│   ├── context/
│   │   ├── FarcasterProvider   # Farcaster authentication context
│   │   └── Web3Modal           # Web3 wallet connection provider
│   ├── contracts/              # ABI definitions and contract addresses
│   ├── utils/                  # Helper functions (Warpcast sharing)
│   ├── layout.js               # Root layout with providers
│   └── page.js                 # Main application component
├── contract/
│   ├── contracts/
│   │   └── GuestBook.sol       # Solidity smart contract
│   └── scripts/                # Deployment and interaction scripts
└── public/                     # Static assets
```

### Technology Stack

| Layer | Technologies |
|-------|--------------|
| Frontend | Next.js 15, React 19, TailwindCSS 3 |
| Blockchain | Base Network, Wagmi 2, Viem 2 |
| Authentication | WalletConnect, Farcaster Auth Kit |
| Data | On chain storage via smart contract |

## Prerequisites

Before installation, ensure you have the following:

| Requirement | Version | Purpose |
|-------------|---------|---------|
| Node.js | 18.0 or higher | JavaScript runtime |
| pnpm | 8.0 or higher | Package manager |
| WalletConnect Project ID | N/A | Required for wallet connections |
| Web3 Wallet | Any | MetaMask, Coinbase Wallet, etc. |
| Base ETH | Small amount | For transaction gas fees |

## Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/your-username/guestbook-app.git
cd guestbook-app
pnpm install
```

For smart contract development (optional):

```bash
cd contract
npm install
```

## Configuration

Create a `.env.local` file in the project root with the following variables:

```
NEXT_PUBLIC_PROJECT_ID=your_walletconnect_project_id
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

### Obtaining a WalletConnect Project ID

1. Navigate to [WalletConnect Cloud](https://cloud.walletconnect.com/)
2. Create an account or sign in
3. Create a new project
4. Copy the Project ID from the project dashboard

### Contract Configuration (for development)

If deploying your own contract, create a `.env` file in the `contract/` directory:

```
PRIVATE_KEY=your_wallet_private_key
BASESCAN_API_KEY=your_basescan_api_key
```

## Running the Application

Start the development server:

```bash
pnpm dev
```

The application will be available at `http://localhost:3000`.

For production builds:

```bash
pnpm build
pnpm start
```

## Smart Contract

The application uses a unified smart contract handling both guest book and todo functionality.

### Deployed Contract

| Property | Value |
|----------|-------|
| Network | Base Mainnet |
| Chain ID | 8453 |
| Contract Address | 0x086f4eC31A85a4E96d30A99bD80018E9d91e4d42 |
| Solidity Version | 0.8.27 |

View on [BaseScan](https://basescan.org/address/0x086f4eC31A85a4E96d30A99bD80018E9d91e4d42)

### Guest Book Functions

**Write Operations**

| Function | Parameters | Description |
|----------|------------|-------------|
| postMessage | string name, string message | Post a new message to the guest book |

**Read Operations**

| Function | Returns | Description |
|----------|---------|-------------|
| getAllMessages | Message[] | Retrieve all posted messages |
| getMessage | Message | Get a specific message by index |
| getTotalMessages | uint256 | Get the total count of messages |

### Todo Functions

**Write Operations**

| Function | Parameters | Description |
|----------|------------|-------------|
| createTodo | string title, string description | Create a new todo (payable) |
| toggleTodoComplete | uint256 todoId | Toggle completion status (creator only) |
| deleteTodo | uint256 todoId | Delete a todo (creator only) |
| likeTodo | uint256 todoId | Like a todo |
| unlikeTodo | uint256 todoId | Remove your like |

**Read Operations**

| Function | Returns | Description |
|----------|---------|-------------|
| getAllTodos | TodoItem[] | Get all active todos |
| getTodo | TodoItem | Get specific todo by ID |
| getUserTodos | TodoItem[] | Get todos by wallet address |
| hasLikedTodo | bool | Check if user has liked a todo |
| todoCreationFee | uint256 | Current fee for creating todos |

**Owner Functions**

| Function | Description |
|----------|-------------|
| updateTodoFee | Set a new creation fee amount |
| withdraw | Withdraw accumulated fees to owner |
| getBalance | View contract ETH balance |

### Contract Events

| Event | Emitted When |
|-------|--------------|
| NewMessage | A message is posted |
| TodoCreated | A new todo is created |
| TodoCompleted | Completion status changes |
| TodoDeleted | A todo is deleted |
| TodoLiked | A todo is liked or unliked |
| FeeUpdated | Creation fee is updated |

## API Reference

### Farcaster Frame Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| /api/frame | GET/POST | Farcaster frame handler |
| /api/og | GET | OpenGraph image generation |
| /api/farcaster | GET/POST | Farcaster webhook and data endpoints |

### Frame Metadata

The application includes Farcaster frame metadata for rich embedding in Warpcast and other Farcaster clients:

```html
fc:frame: vNext
fc:frame:image: Dynamic OG image
fc:frame:button:1: View Stats (link)
fc:frame:button:2: Open App (link)
```

## Deployment

### Vercel (Recommended)

1. Push code to a GitHub repository
2. Import the repository in [Vercel](https://vercel.com)
3. Add environment variables in project settings:
   - `NEXT_PUBLIC_PROJECT_ID`
   - `NEXT_PUBLIC_APP_URL`
4. Deploy

### Alternative Platforms

The application is compatible with any platform supporting Next.js:

| Platform | Deployment Guide |
|----------|-----------------|
| Netlify | Use Next.js runtime plugin |
| Railway | Direct Next.js support |
| AWS Amplify | Next.js SSR hosting |
| Render | Web service with build command |

### Smart Contract Deployment

To deploy your own instance of the contract:

```bash
cd contract
npx hardhat compile
npx hardhat run scripts/deploy.js --network base
```

Verify on BaseScan:

```bash
npx hardhat verify --network base DEPLOYED_CONTRACT_ADDRESS
```

## Troubleshooting

### Wallet Connection Issues

| Problem | Solution |
|---------|----------|
| Modal does not appear | Verify `NEXT_PUBLIC_PROJECT_ID` is set correctly |
| Connection rejected | Ensure wallet is unlocked and on Base network |
| Wrong network | Switch wallet to Base (Chain ID 8453) |

### Transaction Failures

| Problem | Solution |
|---------|----------|
| Insufficient funds | Ensure wallet has ETH for gas and creation fees |
| Transaction reverts | Verify you meet function requirements (e.g., creator only) |
| Nonce issues | Reset wallet transaction history or wait for pending txs |

### Build Errors

| Problem | Solution |
|---------|----------|
| Module not found | Run `pnpm install` to ensure all dependencies are installed |
| Type errors | Delete `.next` folder and rebuild |
| Environment missing | Verify `.env.local` exists with required variables |

## Contributing

Contributions are welcome. Please follow these guidelines:

1. Fork the repository
2. Create a feature branch from `main`
3. Write clear commit messages describing changes
4. Ensure code follows existing style conventions
5. Test changes locally before submitting
6. Open a pull request with a detailed description

For significant changes, please open an issue first to discuss the proposed modifications.

## License

This project is released under the MIT License. See the LICENSE file for details.

## Acknowledgments

Built on Base Network for fast, low cost transactions. Powered by WalletConnect for universal wallet support. Integrated with Farcaster for decentralized social features.
