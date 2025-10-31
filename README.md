# 📖 Guest Book dApp

A beautiful, modern guest book application built on the Base blockchain. Leave your message on the blockchain forever!

## Features

- 🔗 **Wallet Connection**: Connect with any Web3 wallet via WalletConnect
- 📝 **Post Messages**: Leave your name and message on the blockchain
- 💬 **View Messages**: See all messages from other users
- ⏰ **Timestamps**: Each message includes a blockchain timestamp
- 🎨 **Modern UI**: Beautiful gradient design with smooth animations
- 🔒 **Decentralized**: Built on Base blockchain for security and permanence

##  Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure WalletConnect

1. Go to [WalletConnect Cloud](https://cloud.walletconnect.com/)
2. Create a new project or use an existing one
3. Copy your Project ID
4. Update the `.env.local` file:

```bash
NEXT_PUBLIC_PROJECT_ID=your_actual_project_id_here
```

### 3. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🛠️ Setup Instructions

### WalletConnect Configuration

1. **Get Project ID**:

   - Visit [WalletConnect Cloud](https://cloud.walletconnect.com/)
   - Sign up or log in
   - Create a new project
   - Copy the Project ID

2. **Update Environment**:

   - Open `.env.local` file
   - Replace `your_project_id_here` with your actual Project ID
   - Save the file

3. **Restart Server**:
   - Stop the development server (Ctrl+C)
   - Run `npm run dev` again

### Smart Contract

The dApp uses a deployed smart contract on Base network:

- **Contract Address**: `0xE61BdDBc4322f80120BD912D8E95092bBa4759Fd`
- **Network**: Base Mainnet
- **View on BaseScan**: [Contract Link](https://basescan.org/address/0xE61BdDBc4322f80120BD912D8E95092bBa4759Fd)

## 🎯 How to Use

1. **Connect Wallet**: Click "Connect Wallet" and select your preferred wallet
2. **Leave Message**: Fill in your name and message (max 500 characters)
3. **Post to Blockchain**: Click "Post Message to Blockchain" and confirm the transaction
4. **View Messages**: See all messages from other users in real-time

## 🛡️ Security

- All messages are stored on the Base blockchain
- Your wallet private key never leaves your device
- Messages are permanent and cannot be deleted
- Smart contract is audited and secure

## 🎨 Customization

The app uses Tailwind CSS for styling. You can customize:

- Colors in the gradient backgrounds
- Font sizes and weights
- Component spacing and layout
- Animation effects

## 📱 Supported Wallets

- MetaMask
- WalletConnect
- Coinbase Wallet
- Rainbow
- Trust Wallet
- And many more!

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add your `NEXT_PUBLIC_PROJECT_ID` environment variable
4. Deploy!

### Other Platforms

The app can be deployed to any platform that supports Next.js:

- Netlify
- AWS Amplify
- Railway
- Render

## 🔧 Troubleshooting

### Wallet Connection Issues

- Make sure you have a valid Project ID in `.env.local`
- Check that your wallet is unlocked
- Try refreshing the page
- Clear browser cache if needed

### Transaction Failures

- Ensure you have enough ETH for gas fees
- Check that you're connected to Base network
- Try increasing gas limit if transaction fails

### Build Issues

- Run `npm install` to ensure all dependencies are installed
- Check that all environment variables are set
- Clear `.next` folder and rebuild

## 📄 License

MIT License - feel free to use this project for your own dApps!

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

If you encounter any issues:

1. Check the troubleshooting section above
2. Open an issue on GitHub
3. Join our community discussions

---

Built with ❤️ on Base • Powered by WalletConnect
