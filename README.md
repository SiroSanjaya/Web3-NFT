# 🚀 NFT Marketplace + Staking Platform

Modern Web3 NFT Marketplace dengan fitur staking yang keren untuk portfolio!

## ✨ Fitur Utama

- **NFT Minting** - Buat NFT custom dengan metadata IPFS
- **Marketplace** - Jual/beli NFT dengan harga real-time
- **Staking System** - Stake NFT untuk dapat reward token
- **Modern UI** - Interface yang beautiful dan responsive
- **Wallet Integration** - Support MetaMask, WalletConnect, dll
- **Real-time Data** - Harga crypto dan NFT live update

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - React framework dengan App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling modern
- **Framer Motion** - Animasi smooth
- **Wagmi + RainbowKit** - Wallet connection

### Smart Contracts
- **Solidity** - Smart contract development
- **Hardhat** - Development framework
- **OpenZeppelin** - Secure contract libraries
- **IPFS** - Decentralized storage

### Backend & APIs
- **Node.js** - API server (opsional)
- **Pinata/Web3.Storage** - IPFS pinning service
- **CoinGecko API** - Crypto price data

## 🌐 Polygon Amoy Testnet Setup

This project is configured to work with **Polygon Amoy Testnet** (the new replacement for Mumbai). Here's how to set it up:

### Automatic Setup
1. Connect your wallet (MetaMask, WalletConnect, etc.)
2. Click "Switch to Polygon Amoy" button on the homepage
3. If the network isn't available, click "Add to MetaMask" to add it automatically

### Manual Setup (MetaMask)
1. Open MetaMask
2. Click on the network dropdown (top of the extension)
3. Click "Add Network"
4. Fill in the following details:
   - **Network Name:** Polygon Amoy Testnet
   - **New RPC URL:** https://rpc-amoy.polygon.technology
   - **Chain ID:** 80002
   - **Currency Symbol:** MATIC
   - **Block Explorer URL:** https://amoy.polygonscan.com
5. Click "Save"

### Getting Test MATIC
- Visit [Polygon Faucet](https://faucet.polygon.technology/)
- Select "Amoy" network
- Enter your wallet address
- Request test MATIC tokens

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Environment
```bash
cp .env.example .env.local
# Edit .env.local dengan private key dan API keys
```

### 3. Compile Smart Contracts
```bash
npm run compile
```

### 4. Deploy Contracts (Polygon Amoy)
```bash
npm run deploy
```

### 5. Run Development Server
```bash
npm run dev
```

## 📁 Project Structure

```
├── contracts/          # Smart contracts (Solidity)
├── scripts/           # Deployment scripts
├── frontend/          # Next.js app
│   ├── components/    # React components
│   ├── pages/         # Next.js pages
│   ├── hooks/         # Custom hooks
│   └── utils/         # Utility functions
├── hardhat.config.js  # Hardhat configuration
└── package.json       # Dependencies
```

## 🔧 Configuration

### Environment Variables
```env
# Blockchain
PRIVATE_KEY=your_private_key
POLYGON_AMOY_RPC=https://rpc-amoy.polygon.technology
POLYGON_MAINNET_RPC=https://polygon-rpc.com

# IPFS
PINATA_API_KEY=your_pinata_key
PINATA_SECRET_KEY=your_pinata_secret

# APIs
COINGECKO_API_KEY=your_coingecko_key
```

## 🎯 Smart Contracts

### NFTMarketplace.sol
- NFT minting dengan metadata IPFS
- Marketplace untuk jual/beli NFT
- Royalty system untuk creator

### NFTStaking.sol
- Staking NFT untuk reward token
- Flexible staking periods
- Reward calculation system

## 🌐 Deployment

### Testnet (Polygon Amoy)
```bash
npm run deploy
```

### Mainnet (Polygon)
```bash
npm run deploy:mainnet
```

### Frontend (Vercel)
```bash
vercel --prod
```

## 📊 Features Breakdown

### NFT Minting
- Upload image ke IPFS
- Generate metadata JSON
- Mint NFT dengan metadata
- Set royalty percentage

### Marketplace
- List NFT untuk dijual
- Buy NFT dengan ETH/MATIC
- Search dan filter NFT
- Real-time price updates

### Staking System
- Stake NFT untuk reward
- Multiple staking pools
- Unstake anytime
- Claim rewards

## 🔗 Links

- **Frontend**: https://your-app.vercel.app
- **Contract**: https://amoy.polygonscan.com/address/YOUR_CONTRACT
- **IPFS Gateway**: https://ipfs.io/ipfs/

## 🤝 Contributing

1. Fork repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## 📄 License

MIT License - see LICENSE file for details

---

**Built with ❤️ for Web3 Portfolio**
