import hre from "hardhat";

// ==================== CLI ARGUMENT PARSING ====================
const args = process.argv.slice(2);

// Parse arguments
const parseArgs = () => {
    const config = {
        operation: 'messages', // 'messages', 'todos', or 'both'
        numMessages: 5,
        numTodos: 3,
        delay: 100,
        customName: null,
        customMessage: null,
        customTitle: null,
        customDescription: null,
    };

    for (let i = 0; i < args.length; i++) {
        const arg = args[i];

        switch (arg) {
            case '--operation':
            case '-o':
                config.operation = args[++i];
                break;
            case '--messages':
            case '-m':
                config.numMessages = parseInt(args[++i]);
                break;
            case '--todos':
            case '-t':
                config.numTodos = parseInt(args[++i]);
                break;
            case '--delay':
            case '-d':
                config.delay = parseInt(args[++i]);
                break;
            case '--name':
                config.customName = args[++i];
                break;
            case '--message':
                config.customMessage = args[++i];
                break;
            case '--title':
                config.customTitle = args[++i];
                break;
            case '--description':
                config.customDescription = args[++i];
                break;
            case '--help':
            case '-h':
                printHelp();
                process.exit(0);
        }
    }

    return config;
};

const printHelp = () => {
    console.log(`
GuestBook Interaction Script
=============================

Usage: npx hardhat run scripts/interact-cli.js --network base [options]

Options:
  -o, --operation <type>       Operation type: 'messages', 'todos', or 'both' (default: 'messages')
  -m, --messages <number>      Number of messages to post (default: 5)
  -t, --todos <number>         Number of todos to create (default: 3)
  -d, --delay <ms>             Delay between transactions in milliseconds (default: 100)

  Custom single operations:
  --name <name>                Post a single custom message with this name
  --message <text>             Post a single custom message with this text
  --title <title>              Create a single custom todo with this title
  --description <text>         Create a single custom todo with this description

Examples:
  # Post 10 messages
  npx hardhat run scripts/interact-cli.js --network base -o messages -m 10

  # Create 5 todos
  npx hardhat run scripts/interact-cli.js --network base -o todos -t 5

  # Do both: post 3 messages and create 2 todos
  npx hardhat run scripts/interact-cli.js --network base -o both -m 3 -t 2

  # Post a single custom message
  npx hardhat run scripts/interact-cli.js --network base --name "Alice" --message "Hello World!"

  # Create a single custom todo
  npx hardhat run scripts/interact-cli.js --network base --title "My Todo" --description "Do something important"

  # Slow down transactions (1 second delay)
  npx hardhat run scripts/interact-cli.js --network base -o messages -m 5 -d 1000
`);
};

// ==================== CONFIGURATION ====================
const CONTRACT_ADDRESS = '0x086f4eC31A85a4E96d30A99bD80018E9d91e4d42';
const TODO_FEE = '0.00001';

// ==================== MESSAGE GENERATORS ====================
function generateMessages(num) {
    const greetings = [
        "Hello from the blockchain!",
        "Web3 is amazing!",
        "Decentralization rocks!",
        "Building the future, one block at a time.",
        "Love this guestbook dApp!",
        "Greetings from the Base network!",
        "Smart contracts are revolutionary.",
        "Happy to be part of this community!",
        "Blockchain technology is the future.",
        "Thanks for building this awesome dApp!",
        "Exploring the decentralized web.",
        "On-chain forever!",
        "The future is trustless and permissionless.",
        "Excited about Web3 development!",
        "Learning and building every day."
    ];

    const messages = [];
    const names = [
        "Alice", "Bob", "Charlie", "Diana", "Eve",
        "Frank", "Grace", "Henry", "Ivy", "Jack",
        "Kate", "Leo", "Mia", "Noah", "Olivia",
        "Peter", "Quinn", "Ruby", "Sam", "Tara"
    ];

    for (let i = 0; i < num; i++) {
        const name = names[i % names.length];
        const greeting = greetings[i % greetings.length];
        messages.push({
            name: `${name} #${i + 1}`,
            message: `${greeting} (Message #${i + 1})`
        });
    }

    return messages;
}

function generateTodos(num) {
    const titles = [
        "Learn Solidity basics",
        "Build a DeFi protocol",
        "Deploy to mainnet",
        "Write comprehensive tests",
        "Optimize gas usage",
        "Implement ERC-721 NFT",
        "Create DAO governance",
        "Audit smart contracts",
        "Integrate with frontend",
        "Study Layer 2 solutions",
        "Master Web3.js and Ethers.js",
        "Build a decentralized exchange",
        "Create tokenomics model",
        "Implement multisig wallet",
        "Learn about MEV protection"
    ];

    const descriptions = [
        "Master the fundamentals of smart contract development with Solidity.",
        "Explore decentralized finance by building lending and staking protocols.",
        "Successfully deploy the project to Ethereum mainnet with proper testing.",
        "Achieve 100% code coverage with unit and integration tests.",
        "Reduce transaction costs by implementing gas optimization techniques.",
        "Create a unique NFT collection with metadata and royalties.",
        "Build a decentralized autonomous organization with token voting.",
        "Conduct thorough security audits to prevent vulnerabilities.",
        "Connect smart contracts to React frontend using Wagmi and Web3Modal.",
        "Research and implement solutions like Optimism or Arbitrum for scalability.",
        "Become proficient in Web3 libraries for blockchain interactions.",
        "Design and implement an automated market maker with liquidity pools.",
        "Develop sustainable token economics with proper distribution and incentives.",
        "Create a secure multi-signature wallet for team fund management.",
        "Understand and protect against miner extractable value attacks."
    ];

    const todos = [];
    for (let i = 0; i < num; i++) {
        todos.push({
            title: `${titles[i % titles.length]} #${i + 1}`,
            description: descriptions[i % descriptions.length]
        });
    }

    return todos;
}

// ==================== HELPER FUNCTIONS ====================
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function sendTxWithRetry(txFunc, retries = 3) {
    for (let i = 0; i < retries; i++) {
        try {
            const tx = await txFunc();
            const receipt = await tx.wait();
            return receipt;
        } catch (err) {
            console.warn(`  Attempt ${i + 1} failed: ${err.message}`);
            if (i === retries - 1) throw err;
            await delay(1000);
        }
    }
}

// ==================== TRANSACTION FUNCTIONS ====================
async function postMessages(contract, messages, txDelay) {
    console.log('\n==================== POSTING MESSAGES ====================');
    console.log(`Posting ${messages.length} message(s)...\n`);

    const results = [];

    for (let i = 0; i < messages.length; i++) {
        try {
            const { name, message } = messages[i];
            console.log(`[${i + 1}/${messages.length}] Posting message from "${name}"`);
            console.log(`  Message: "${message}"`);

            const receipt = await sendTxWithRetry(async () => {
                return await contract.postMessage(name, message, { gasLimit: 200000 });
            });

            console.log(`  ✓ TX Hash: ${receipt.transactionHash}`);
            console.log(`  ✓ Block: ${receipt.blockNumber}`);
            console.log(`  ✓ Gas used: ${receipt.gasUsed.toString()}\n`);

            results.push({
                index: i + 1,
                type: 'message',
                name,
                message,
                hash: receipt.transactionHash,
                blockNumber: receipt.blockNumber,
                gasUsed: receipt.gasUsed.toString(),
                success: true
            });

            if (i < messages.length - 1) {
                await delay(txDelay);
            }

        } catch (error) {
            console.error(`  ✗ Failed:`, error.message, '\n');
            results.push({
                index: i + 1,
                type: 'message',
                success: false,
                error: error.message
            });
        }
    }

    return results;
}

async function createTodos(contract, todos, todoFee, txDelay) {
    console.log('\n==================== CREATING TODOS ====================');
    console.log(`Creating ${todos.length} todo(s) (${TODO_FEE} ETH fee each)...\n`);

    const results = [];

    for (let i = 0; i < todos.length; i++) {
        try {
            const { title, description } = todos[i];
            console.log(`[${i + 1}/${todos.length}] Creating todo: "${title}"`);
            console.log(`  Description: "${description.substring(0, 60)}..."`);

            const receipt = await sendTxWithRetry(async () => {
                return await contract.createTodo(title, description, {
                    value: todoFee,
                    gasLimit: 300000
                });
            });

            console.log(`  ✓ TX Hash: ${receipt.transactionHash}`);
            console.log(`  ✓ Block: ${receipt.blockNumber}`);
            console.log(`  ✓ Gas used: ${receipt.gasUsed.toString()}\n`);

            results.push({
                index: i + 1,
                type: 'todo',
                title,
                description,
                hash: receipt.transactionHash,
                blockNumber: receipt.blockNumber,
                gasUsed: receipt.gasUsed.toString(),
                success: true
            });

            if (i < todos.length - 1) {
                await delay(txDelay);
            }

        } catch (error) {
            console.error(`  ✗ Failed:`, error.message, '\n');
            results.push({
                index: i + 1,
                type: 'todo',
                success: false,
                error: error.message
            });
        }
    }

    return results;
}

// ==================== MAIN FUNCTION ====================
async function main() {
    try {
        const config = parseArgs();

        const [signer] = await hre.ethers.getSigners();

        console.log('\n==================== GUESTBOOK INTERACTION ====================');
        console.log(`Wallet: ${signer.address}`);
        console.log(`Network: ${hre.network.name}`);
        console.log(`Contract: ${CONTRACT_ADDRESS}`);

        // Check balance
        const balance = await hre.ethers.provider.getBalance(signer.address);
        console.log(`Balance: ${hre.ethers.formatEther(balance)} ETH`);

        // Get contract instance
        const contract = await hre.ethers.getContractAt("GuestBook", CONTRACT_ADDRESS);

        // Get current stats
        const totalMessages = await contract.getTotalMessages();
        const todoCounter = await contract.todoCounter();
        const todoFeeWei = await contract.todoCreationFee();

        console.log(`\nCurrent contract stats:`);
        console.log(`  Total messages: ${totalMessages.toString()}`);
        console.log(`  Total todos created: ${todoCounter.toString()}`);
        console.log(`  Todo creation fee: ${hre.ethers.formatEther(todoFeeWei)} ETH`);

        const allResults = [];

        // Parse todo fee
        const todoFee = hre.ethers.parseEther(TODO_FEE);

        // Handle custom single operations
        if (config.customName && config.customMessage) {
            const messages = [{ name: config.customName, message: config.customMessage }];
            const messageResults = await postMessages(contract, messages, config.delay);
            allResults.push(...messageResults);
        } else if (config.customTitle && config.customDescription) {
            const todos = [{ title: config.customTitle, description: config.customDescription }];
            const todoResults = await createTodos(contract, todos, todoFee, config.delay);
            allResults.push(...todoResults);
        } else {
            // Execute bulk operations based on OPERATION config
            if (config.operation === 'messages' || config.operation === 'both') {
                const messages = generateMessages(config.numMessages);
                const messageResults = await postMessages(contract, messages, config.delay);
                allResults.push(...messageResults);
            }

            if (config.operation === 'todos' || config.operation === 'both') {
                const todos = generateTodos(config.numTodos);
                const todoResults = await createTodos(contract, todos, todoFee, config.delay);
                allResults.push(...todoResults);
            }
        }

        // ==================== SUMMARY ====================
        console.log('\n==================== SUMMARY ====================');

        const successful = allResults.filter(r => r.success).length;
        const failed = allResults.filter(r => !r.success).length;
        const messageCount = allResults.filter(r => r.type === 'message' && r.success).length;
        const todoCount = allResults.filter(r => r.type === 'todo' && r.success).length;

        console.log(`Total operations: ${allResults.length}`);
        console.log(`  ✓ Successful: ${successful}`);
        console.log(`  ✗ Failed: ${failed}`);
        console.log(`\nBreakdown:`);
        console.log(`  Messages posted: ${messageCount}`);
        console.log(`  Todos created: ${todoCount}`);

        if (successful > 0) {
            const totalGasUsed = allResults
                .filter(r => r.success)
                .reduce((sum, r) => sum + BigInt(r.gasUsed || 0), BigInt(0));
            console.log(`\nTotal gas used: ${totalGasUsed.toString()}`);
        }

        if (todoCount > 0) {
            const totalTodoFees = BigInt(todoFee) * BigInt(todoCount);
            console.log(`Total todo fees paid: ${hre.ethers.formatEther(totalTodoFees)} ETH`);
        }

        console.log('=================================================\n');

        // Final contract stats
        const finalTotalMessages = await contract.getTotalMessages();
        const finalTodoCounter = await contract.todoCounter();

        console.log('Final contract stats:');
        console.log(`  Total messages: ${finalTotalMessages.toString()} (+${finalTotalMessages - totalMessages})`);
        console.log(`  Total todos: ${finalTodoCounter.toString()} (+${finalTodoCounter - todoCounter})`);

    } catch (error) {
        console.error('\n✗ Error:', error);
        process.exit(1);
    }
}

// ==================== EXECUTION ====================
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
