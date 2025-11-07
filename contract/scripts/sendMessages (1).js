const hre = require("hardhat");

// Configuration
const CONTRACT_ADDRESS = '0x086f4eC31A85a4E96d30A99bD80018E9d91e4d42';
const AMOUNT_PER_TX = '0.000000001696137472'; // ETH amount per transaction (18 decimals)
const NUM_CALLS = 10;

// Recipients array
const recipients = [
    "0x51F19F71e9d073AAB39f6fd003F424984390E5A0",
    "0xC9b1E7DBE24E29D1F9a917Ea24697C704ABBFeE0",
    "0x7273dE585311a5139Ef83f0F6Dbb29F3e57b3389",
    "0xEfd50EC809f87393b87513f207DaddEb80C0491F"

];

// Function to generate unique, human-readable messages
function generateMessages(num) {
    const beginnings = [
        "Hey dev! Your smart contract skills are improving every day.",
        "Great work on mastering Solidity fundamentals!",
        "I appreciate how you help others debug their code.",
        "Your understanding of gas optimization is really solid.",
        "Keep pushing forward - blockchain development takes patience.",
        "The way you explained ERC-20 tokens was incredibly clear.",
        "Your test coverage on that last project was impressive.",
        "Remember: every error message is a learning opportunity.",
        "You're building the decentralized future, one line at a time.",
        "Your contributions to our class discussions are valuable."
    ];

    const middles = [
        "Never stop experimenting with new protocols and patterns.",
        "Security-first thinking will make you an exceptional developer.",
        "Your willingness to ask questions shows real growth mindset.",
        "The blockchain community needs more developers like you.",
        "Every transaction you write teaches you something new.",
        "Your persistence through complex bugs is truly admirable.",
        "Keep exploring DeFi, NFTs, and DAOs - you're doing great.",
        "Testing on testnets before mainnet shows you're thinking smart.",
        "Your code reviews help everyone write better contracts.",
        "Documentation matters - thanks for writing clear comments."
    ];

    const endings = [
        "Excited to see what you build next!",
        "Keep coding, keep learning, keep shipping.",
        "You're going to do amazing things in Web3.",
        "This message is permanently on-chain for you.",
        "Proud to be learning alongside you.",
        "Your future in blockchain is bright!",
        "Can't wait to see your next deployment.",
        "You're leveling up with every commit.",
        "The best developers never stop learning.",
        "Onwards and upwards, fellow builder!"
    ];

    const messages = [];
    for (let i = 0; i < num; i++) {
        const beg = beginnings[i % beginnings.length];
        const mid = middles[i % middles.length];
        const end = endings[i % endings.length];
        messages.push(`${beg} ${mid} ${end} (Message #${i + 1})`);
    }
    return messages;
}

const messages = generateMessages(NUM_CALLS);

// Optional: small delay between transactions
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Retry helper
async function sendTxWithRetry(contract, to, message, amountPerTx, retries = 3) {
    for (let i = 0; i < retries; i++) {
        try {
            const tx = await contract.sendMessage(to, message, { value: amountPerTx, gasLimit: 100000 });
            const receipt = await tx.wait();
            return receipt;
        } catch (err) {
            console.warn(`Attempt ${i + 1} failed for ${to}: ${err.message}`);
            if (i === retries - 1) throw err;
        }
    }
}

async function main() {
    try {
        const [signer] = await hre.ethers.getSigners();

        console.log(`Using wallet: ${signer.address}`);
        console.log(`Network: ${hre.network.name}`);

        // Check balance
        const balance = await hre.ethers.provider.getBalance(signer.address);
        console.log(`Wallet balance: ${hre.ethers.formatEther(balance)} ETH\n`);

        // Get contract
        const contract = await hre.ethers.getContractAt("FluidPay", CONTRACT_ADDRESS);

        // Parse amount per transaction
        const amountPerTx = hre.ethers.parseEther(AMOUNT_PER_TX);

        console.log(`Sending ${NUM_CALLS} separate transactions...`);
        console.log(`Amount per tx: ${AMOUNT_PER_TX} ETH\n`);

        const results = [];

        for (let i = 0; i < NUM_CALLS; i++) {
            try {
                const recipient = recipients[i % recipients.length]; // cycle through 3 addresses
                const dynamicMessage = messages[i];

                console.log(`[${i + 1}/${NUM_CALLS}] Sending to ${recipient}: "${dynamicMessage}"`);

                const receipt = await sendTxWithRetry(contract, recipient, dynamicMessage, amountPerTx, 3);

                console.log(`  TX Hash: ${receipt.transactionHash}`);
                console.log(`  ✓ Confirmed in block ${receipt.blockNumber}`);
                console.log(`  Gas used: ${receipt.gasUsed.toString()}\n`);

                results.push({
                    index: i + 1,
                    hash: receipt.transactionHash,
                    blockNumber: receipt.blockNumber,
                    gasUsed: receipt.gasUsed.toString(),
                    recipient,
                    message: dynamicMessage,
                    success: true
                });

                await delay(100); // optional delay between txs

            } catch (error) {
                console.error(`  ✗ Transaction ${i + 1} failed:`, error.message);
                results.push({
                    index: i + 1,
                    success: false,
                    error: error.message
                });
            }
        }

        // Summary
        console.log('\n==================== SUMMARY ====================');
        const successful = results.filter(r => r.success).length;
        const failed = results.filter(r => !r.success).length;

        console.log(`Total transactions: ${NUM_CALLS}`);
        console.log(`Successful: ${successful}`);
        console.log(`Failed: ${failed}`);

        if (successful > 0) {
            const totalGasUsed = results
                .filter(r => r.success)
                .reduce((sum, r) => sum + BigInt(r.gasUsed || 0), BigInt(0));
            console.log(`Total gas used: ${totalGasUsed.toString()}`);
        }

        console.log('=================================================\n');

    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });