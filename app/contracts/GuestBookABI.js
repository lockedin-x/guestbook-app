/**
 * GuestBook Smart Contract ABI
 * 
 * This file contains ONLY the guestbook-specific functionality.
 * Message posting, retrieval, and related operations.
 * 
 * Network: Base Mainnet
 * Contract Address: 0x086f4eC31A85a4E96d30A99bD80018E9d91e4d42
 */

export const GUEST_BOOK_ABI = [
    {
        inputs: [],
        stateMutability: "nonpayable",
        type: "constructor"
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "sender",
                type: "address"
            },
            {
                indexed: false,
                internalType: "string",
                name: "name",
                type: "string"
            },
            {
                indexed: false,
                internalType: "string",
                name: "message",
                type: "string"
            }
        ],
        name: "NewMessage",
        type: "event"
    },
    {
        inputs: [],
        name: "getAllMessages",
        outputs: [
            {
                components: [
                    {
                        internalType: "address",
                        name: "sender",
                        type: "address"
                    },
                    {
                        internalType: "string",
                        name: "message",
                        type: "string"
                    },
                    {
                        internalType: "string",
                        name: "name",
                        type: "string"
                    },
                    {
                        internalType: "uint256",
                        name: "timestamp",
                        type: "uint256"
                    }
                ],
                internalType: "struct GuestBook.Message[]",
                name: "",
                type: "tuple[]"
            }
        ],
        stateMutability: "view",
        type: "function"
    },
    {
        inputs: [
            {
                internalType: "uint256",
                name: "index",
                type: "uint256"
            }
        ],
        name: "getMessage",
        outputs: [
            {
                internalType: "address",
                name: "sender",
                type: "address"
            },
            {
                internalType: "string",
                name: "name",
                type: "string"
            },
            {
                internalType: "string",
                name: "message",
                type: "string"
            },
            {
                internalType: "uint256",
                name: "timestamp",
                type: "uint256"
            }
        ],
        stateMutability: "view",
        type: "function"
    },
    {
        inputs: [],
        name: "getTotalMessages",
        outputs: [
            {
                internalType: "uint256",
                name: "",
                type: "uint256"
            }
        ],
        stateMutability: "view",
        type: "function"
    },
    {
        inputs: [
            {
                internalType: "uint256",
                name: "",
                type: "uint256"
            }
        ],
        name: "messages",
        outputs: [
            {
                internalType: "address",
                name: "sender",
                type: "address"
            },
            {
                internalType: "string",
                name: "message",
                type: "string"
            },
            {
                internalType: "string",
                name: "name",
                type: "string"
            },
            {
                internalType: "uint256",
                name: "timestamp",
                type: "uint256"
            }
        ],
        stateMutability: "view",
        type: "function"
    },
    {
        inputs: [],
        name: "owner",
        outputs: [
            {
                internalType: "address",
                name: "",
                type: "address"
            }
        ],
        stateMutability: "view",
        type: "function"
    },
    {
        inputs: [
            {
                internalType: "string",
                name: "_name",
                type: "string"
            },
            {
                internalType: "string",
                name: "_message",
                type: "string"
            }
        ],
        name: "postMessage",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function"
    }
];

export const CONTRACT_ADDRESS = "0x086f4eC31A85a4E96d30A99bD80018E9d91e4d42";

// Network configuration
export const NETWORK_CONFIG = {
    chainId: 8453, // Base Mainnet
    chainName: "Base",
    rpcUrl: "https://mainnet.base.org",
    blockExplorer: "https://basescan.org"
};
