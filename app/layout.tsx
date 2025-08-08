import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'NexusVerse - Next-Gen NFT Marketplace & Staking Platform',
  description: 'Discover, create, and stake NFTs on the most advanced Web3 platform. NexusVerse combines cutting-edge blockchain technology with beautiful design for the ultimate NFT experience.',
  keywords: 'NFT, marketplace, staking, Web3, blockchain, digital art, crypto',
  authors: [{ name: 'NexusVerse Team' }],
  openGraph: {
    title: 'NexusVerse - Next-Gen NFT Marketplace',
    description: 'The ultimate Web3 platform for NFT trading and staking',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NexusVerse - Next-Gen NFT Marketplace',
    description: 'The ultimate Web3 platform for NFT trading and staking',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          {children}
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
            }}
          />
        </Providers>
      </body>
    </html>
  )
}
