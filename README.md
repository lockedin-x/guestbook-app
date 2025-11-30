# 📖 Guest Book & Todo dApp

A beautiful, feature-rich blockchain application built on Base. Leave your messages and manage your todos on-chain forever!

## ✨ Features

### 📝 Guest Book Features
- **Post Messages**: Leave your name and message permanently on the blockchain
- **View All Messages**: Browse all messages from other users in chronological order
- **Message History**: Each message includes sender address and blockchain timestamp
- **Immutable Records**: Messages are permanently stored on-chain

### ✅ Todo List Features
- **Create Todos**: Add todos with title and description (with creation fee)
- **Complete Tasks**: Toggle todos between complete/incomplete status
- **Delete Todos**: Remove your own todos from the blockchain
- **Social Engagement**: Like/unlike other users' todos
- **User Filtering**: View todos by specific wallet address
- **Like Tracking**: See who liked which todos with duplicate prevention
- **Fee Management**: Owner-controlled creation fees for spam prevention

### 🔗 Blockchain Features
- **Wallet Connection**: Connect with any Web3 wallet via WalletConnect
- **Multi-Function Contract**: Unified smart contract for both features
- **Gas Optimized**: Efficient storage and retrieval mechanisms
- **Event Logging**: All actions emit events for transparency
- **Owner Controls**: Fee updates and withdrawal functions
- **Balance Tracking**: View contract balance and accumulated fees

### 🎨 Technical Features
- **Modern UI**: Beautiful gradient design with smooth animations
- **Real-time Updates**: Instant feedback on blockchain transactions
- **Responsive Design**: Works perfectly on desktop and mobile
- **Error Handling**: Clear error messages and transaction feedback
- **Decentralized**: Built on Base blockchain for security and permanence

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

#### Guest Book Functions

**Write Functions:**
- `postMessage(string _name, string _message)` - Post a new message to the guestbook

**Read Functions:**
- `getAllMessages()` - Retrieve all messages
- `getMessage(uint256 index)` - Get a specific message by index
- `getTotalMessages()` - Get total count of messages
- `messages(uint256)` - Access message by index

#### Todo List Functions

**Write Functions:**
- `createTodo(string _title, string _description)` - Create a new todo (payable)
- `toggleTodoComplete(uint256 _todoId)` - Toggle completion status
- `deleteTodo(uint256 _todoId)` - Delete your own todo
- `likeTodo(uint256 _todoId)` - Like a todo
- `unlikeTodo(uint256 _todoId)` - Remove your like

**Read Functions:**
- `getAllTodos()` - Get all todos from all users
- `getTodo(uint256 _todoId)` - Get specific todo details
- `getUserTodos(address _user)` - Get todos by wallet address
- `hasLikedTodo(uint256 _todoId, address _user)` - Check if user liked a todo
- `todoCreationFee()` - View current creation fee
- `todoCounter()` - Get total number of todos

**Owner Functions:**
- `updateTodoFee(uint256 _newFee)` - Update creation fee (owner only)
- `withdraw()` - Withdraw accumulated fees (owner only)
- `getBalance()` - View contract balance

#### Events
- `NewMessage` - Emitted when a message is posted
- `TodoCreated` - Emitted when a todo is created
- `TodoCompleted` - Emitted when completion status changes
- `TodoLiked` - Emitted when a todo is liked/unliked
- `TodoDeleted` - Emitted when a todo is deleted
- `FeeUpdated` - Emitted when fee is updated


## 🎯 How to Use

### Guest Book Features

1. **Connect Wallet**: Click "Connect Wallet" and select your preferred wallet
2. **Leave Message**: Fill in your name and message (max 500 characters)
3. **Post to Blockchain**: Click "Post Message to Blockchain" and confirm the transaction
4. **View Messages**: See all messages from other users in real-time

### Todo List Features

1. **Create a Todo**:
   - Navigate to the Todo section
   - Enter a title and description
   - Pay the creation fee (if applicable)
   - Confirm the transaction

2. **Manage Your Todos**:
   - **Complete**: Click the checkbox to mark as complete/incomplete
   - **Delete**: Remove your own todos (only creator can delete)
   - **View**: See all your todos filtered by your wallet address

3. **Engage with Todos**:
   - **Like**: Support other users' todos by clicking the like button
   - **Unlike**: Remove your like if you change your mind
   - **Track Engagement**: See total likes and check if you've liked a todo

4. **View All Todos**:
   - Browse all public todos from all users
   - Filter by user address
   - See completion status, like counts, and timestamps


## 🛡️ Security

### Data Security
- All messages and todos are stored on the Base blockchain
- Your wallet private key never leaves your device
- Messages are permanent and cannot be deleted (todos can be deleted by creator)
- Smart contract handles all on-chain logic securely

### Access Control
- **Guest Book**: Anyone can post messages
- **Todos**: Only creators can delete or toggle their own todos
- **Likes**: One like per wallet address per todo (duplicate prevention)
- **Owner Functions**: Fee updates and withdrawals restricted to contract owner

### Transaction Safety
- All transactions require user confirmation
- Gas fees are estimated before transaction submission
- Clear error messages for failed transactions
- Event logging for transparency and tracking


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

## �️ Tech Stack

### Frontend
- **Next.js** - React framework for production
- **React** - UI component library
- **Tailwind CSS** - Utility-first CSS framework
- **JavaScript/JSX** - Core programming language

### Blockchain
- **Base Network** - L2 blockchain (Ethereum ecosystem)
- **ethers.js** - Ethereum library for wallet interactions
- **WalletConnect** - Multi-wallet connection protocol
- **Solidity** - Smart contract programming language

### Development Tools
- **npm/pnpm** - Package management
- **Git** - Version control
- **Vercel** - Deployment platform

### Smart Contract Features
- **ERC-20 Compatible** - Standard token interactions
- **Event Emission** - Transparent on-chain logging
- **Access Control** - Owner-based permissions
- **Payable Functions** - ETH transaction handling


## �🚀 Deployment

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
- Verify you have sufficient balance for todo creation fees

### Todo-Specific Issues

- **Cannot Create Todo**: Ensure you have enough ETH for both gas fees AND creation fee
- **Cannot Delete Todo**: Only the creator can delete their own todos
- **Cannot Like Twice**: Each wallet can only like a todo once
- **Fee Not Displayed**: Refresh the page or check contract connection

### Build Issues

- Run `npm install` to ensure all dependencies are installed
- Check that all environment variables are set
- Clear `.next` folder and rebuild
- Verify Node.js version compatibility


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

## 🌟 Project Highlights

- ✅ **Dual Functionality**: GuestBook + Todo List in one unified dApp
- 🔗 **Base Network**: Built on Base L2 for fast, low-cost transactions
- 🎨 **Modern Design**: Beautiful UI with Tailwind CSS
- 🔐 **Secure & Decentralized**: All data stored on-chain
- 💰 **Fee Management**: Customizable creation fees with owner controls
- 👥 **Social Features**: Like system with engagement tracking
- 📊 **Event Logging**: Complete transparency through blockchain events

## 📈 Features at a Glance

| Feature | GuestBook | Todo List |
|---------|-----------|-----------|
| Create | ✅ Messages | ✅ Todos (with fee) |
| Read | ✅ All messages | ✅ All todos + Filtering |
| Update | ❌ | ✅ Toggle complete |
| Delete | ❌ Immutable | ✅ Creator only |
| Social | ❌ | ✅ Like/Unlike system |
| Filtering | ❌ | ✅ By user address |
| Fees | ✅ Free | ✅ Configurable |

---

Built with ❤️ on Base • Powered by WalletConnect • Next.js & Tailwind CSS
