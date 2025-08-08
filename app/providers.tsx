'use client'

import { WagmiConfig, createConfig, configureChains } from 'wagmi'
import { polygon } from 'wagmi/chains'
import { publicProvider } from 'wagmi/providers/public'
import { RainbowKitProvider, getDefaultWallets } from '@rainbow-me/rainbowkit'
import '@rainbow-me/rainbowkit/styles.css'

// Custom Polygon Amoy Testnet configuration
const polygonAmoy = {
  id: 80002,
  name: 'Polygon Amoy Testnet',
  network: 'polygon-amoy',
  nativeCurrency: {
    decimals: 18,
    name: 'MATIC',
    symbol: 'MATIC',
  },
  rpcUrls: {
    public: { http: ['https://rpc-amoy.polygon.technology'] },
    default: { http: ['https://rpc-amoy.polygon.technology'] },
  },
  blockExplorers: {
    etherscan: { name: 'PolygonScan', url: 'https://amoy.polygonscan.com' },
    default: { name: 'PolygonScan', url: 'https://amoy.polygonscan.com' },
  },
  testnet: true,
}

// Configure chains with Polygon Amoy Testnet
const { chains, publicClient, webSocketPublicClient } = configureChains(
  [polygonAmoy, polygon],
  [publicProvider()]
)

const { connectors } = getDefaultWallets({
  appName: 'NFT Marketplace',
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || 'c4f79cc821944d9680842e34466bfbd9', // Fallback project ID
  chains,
})

const config = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
})

export function Providers({ children }: { children: any }) {
  return (
    <WagmiConfig config={config}>
      <RainbowKitProvider chains={chains} children={children} />
    </WagmiConfig>
  )
}
