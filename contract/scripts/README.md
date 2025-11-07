# GuestBook Interaction Scripts

These scripts allow you to interact with the GuestBook smart contract from the command line.

## Available Scripts

### 1. `interact.js` - Basic Configuration Script

Simple script with hardcoded configuration at the top of the file.

**Configuration options** (edit at top of file):
```javascript
const OPERATION = 'messages';  // 'messages', 'todos', or 'both'
const NUM_MESSAGES = 5;        // Number of messages to post
const NUM_TODOS = 3;           // Number of todos to create
```

**Usage:**
```bash
cd contract
npx hardhat run scripts/interact.js --network base
```

### 2. `interact-cli.js` - CLI Arguments Script

Advanced script that accepts command-line arguments for maximum flexibility.

**Basic Usage:**
```bash
cd contract

# Post 10 messages
npx hardhat run scripts/interact-cli.js --network base -o messages -m 10

# Create 5 todos
npx hardhat run scripts/interact-cli.js --network base -o todos -t 5

# Do both: post 3 messages and create 2 todos
npx hardhat run scripts/interact-cli.js --network base -o both -m 3 -t 2
```

**Custom Single Operations:**
```bash
# Post a single custom message
npx hardhat run scripts/interact-cli.js --network base \
  --name "Alice" \
  --message "Hello from the blockchain!"

# Create a single custom todo
npx hardhat run scripts/interact-cli.js --network base \
  --title "Learn Solidity" \
  --description "Master smart contract development"
```

**All CLI Options:**
- `-o, --operation <type>` - Operation type: 'messages', 'todos', or 'both' (default: 'messages')
- `-m, --messages <number>` - Number of messages to post (default: 5)
- `-t, --todos <number>` - Number of todos to create (default: 3)
- `-d, --delay <ms>` - Delay between transactions in milliseconds (default: 100)
- `--name <name>` - Post a single custom message with this name
- `--message <text>` - Post a single custom message with this text
- `--title <title>` - Create a single custom todo with this title
- `--description <text>` - Create a single custom todo with this description
- `-h, --help` - Show help message

**Advanced Examples:**
```bash
# Slow down transactions (1 second delay between each)
npx hardhat run scripts/interact-cli.js --network base -o messages -m 5 -d 1000

# Post 20 messages with 500ms delay
npx hardhat run scripts/interact-cli.js --network base -o messages -m 20 -d 500

# Create 10 todos
npx hardhat run scripts/interact-cli.js --network base -o todos -t 10

# Mixed: 15 messages and 5 todos
npx hardhat run scripts/interact-cli.js --network base -o both -m 15 -t 5
```

## Important Notes

### Network Configuration

Both scripts default to Base mainnet. You can change the network:

```bash
# Base mainnet (default)
npx hardhat run scripts/interact-cli.js --network base

# Local hardhat network
npx hardhat run scripts/interact-cli.js --network localhost

# Base Sepolia testnet
npx hardhat run scripts/interact-cli.js --network baseSepolia
```

### Gas Costs

- **Messages**: Only gas costs (no additional fee)
- **Todos**: Gas costs + 0.00001 ETH fee per todo

Make sure your wallet has enough ETH to cover:
1. Gas fees for all transactions
2. Todo creation fees (0.00001 ETH × number of todos)

### Transaction Delays

The scripts include small delays between transactions to avoid nonce issues and rate limiting. Adjust using the `--delay` flag if needed.

### Error Handling

Both scripts include:
- Automatic retry logic (3 attempts per transaction)
- Detailed error logging
- Summary statistics at the end

## Output

Both scripts provide:
- Real-time progress updates
- Transaction hashes and block numbers
- Gas usage statistics
- Before/after contract statistics
- Success/failure summary

Example output:
```
==================== GUESTBOOK INTERACTION ====================
Wallet: 0x1234...5678
Network: base
Contract: 0x086f4eC31A85a4E96d30A99bD80018E9d91e4d42
Balance: 0.5 ETH

Current contract stats:
  Total messages: 42
  Total todos created: 15
  Todo creation fee: 0.00001 ETH

==================== POSTING MESSAGES ====================
Posting 5 messages...

[1/5] Posting message from "Alice #1"
  Message: "Hello from the blockchain! (Message #1)"
  ✓ TX Hash: 0xabc...def
  ✓ Block: 12345678
  ✓ Gas used: 85432

...

==================== SUMMARY ====================
Total operations: 5
  ✓ Successful: 5
  ✗ Failed: 0

Breakdown:
  Messages posted: 5
  Todos created: 0

Total gas used: 427160

Final contract stats:
  Total messages: 47 (+5)
  Total todos: 15 (+0)
```

## Quick Start Examples

**Beginner - Post a few messages:**
```bash
cd contract
npx hardhat run scripts/interact.js --network base
```

**Intermediate - Create custom content:**
```bash
cd contract
npx hardhat run scripts/interact-cli.js --network base \
  --name "Your Name" \
  --message "Your custom message here"
```

**Advanced - Bulk operations:**
```bash
cd contract
npx hardhat run scripts/interact-cli.js --network base \
  -o both -m 50 -t 20 -d 200
```

## Troubleshooting

**"Insufficient funds" error:**
- Make sure your wallet has enough ETH for gas + todo fees
- For 10 todos: ~0.001 ETH gas + 0.0001 ETH fees = ~0.0011 ETH minimum

**Nonce errors:**
- Increase the delay: `--delay 500` or `--delay 1000`
- Wait a few blocks before retrying

**Contract not found:**
- Verify you're on the correct network (Base mainnet)
- Check that CONTRACT_ADDRESS in the script matches the deployment

## Environment Setup

Make sure your `contract/.env` file has:
```
PRIVATE_KEY=your_private_key_here
```

This private key will be used to sign all transactions.
