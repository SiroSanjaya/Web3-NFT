'use client'

import { useState, useEffect } from 'react'
import { useNetwork, useSwitchNetwork } from 'wagmi'
import { motion } from 'framer-motion'
import { 
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline'

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

export default function NetworkSwitcher() {
  const { chain } = useNetwork()
  const { switchNetwork, isLoading, pendingChainId } = useSwitchNetwork()
  const [showInstructions, setShowInstructions] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const isCorrectNetwork = chain?.id === polygonAmoy.id

  const addPolygonAmoyToMetaMask = async () => {
    if (typeof window !== 'undefined' && (window as any).ethereum) {
      try {
        await (window as any).ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: '0x13882', // 80002 in hex
              chainName: 'Polygon Amoy Testnet',
              nativeCurrency: {
                name: 'MATIC',
                symbol: 'MATIC',
                decimals: 18,
              },
              rpcUrls: ['https://rpc-amoy.polygon.technology'],
              blockExplorerUrls: ['https://amoy.polygonscan.com'],
            },
          ],
        })
      } catch (error) {
        console.error('Error adding network:', error)
      }
    }
  }

  // Don't render anything until client-side
  if (!mounted) {
    return (
      <div className="flex items-center space-x-2 text-gray-600 bg-gray-50 px-4 py-2 rounded-lg">
        <div className="h-5 w-5 bg-gray-300 rounded animate-pulse"></div>
        <span className="text-sm font-medium">Loading network status...</span>
      </div>
    )
  }

  if (isCorrectNetwork) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center space-x-2 text-green-600 bg-green-50 px-4 py-2 rounded-lg"
      >
        <CheckCircleIcon className="h-5 w-5" />
        <span className="text-sm font-medium">Connected to Polygon Amoy Testnet</span>
      </motion.div>
    )
  }

  return (
    <div className="space-y-4">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center space-x-2 text-amber-600 bg-amber-50 px-4 py-2 rounded-lg"
      >
        <ExclamationTriangleIcon className="h-5 w-5" />
        <span className="text-sm font-medium">Please switch to Polygon Amoy Testnet</span>
      </motion.div>

      <div className="flex flex-col sm:flex-row gap-2">
        {switchNetwork && (
          <button
            onClick={() => switchNetwork(polygonAmoy.id)}
            disabled={isLoading}
            className="btn-primary flex items-center justify-center space-x-2"
          >
            {isLoading && pendingChainId === polygonAmoy.id ? (
              <ArrowPathIcon className="h-4 w-4 animate-spin" />
            ) : null}
            <span>Switch to Polygon Amoy</span>
          </button>
        )}

        <button
          onClick={() => setShowInstructions(!showInstructions)}
          className="btn-secondary"
        >
          Manual Instructions
        </button>

        <button
          onClick={addPolygonAmoyToMetaMask}
          className="btn-secondary"
        >
          Add to MetaMask
        </button>
      </div>

      {showInstructions && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="bg-gray-50 p-4 rounded-lg space-y-2"
        >
          <h4 className="font-semibold text-gray-900">Manual Network Addition:</h4>
          <ol className="list-decimal list-inside space-y-1 text-sm text-gray-700">
            <li>Open MetaMask</li>
            <li>Click on the network dropdown (top of the extension)</li>
            <li>Click "Add Network"</li>
            <li>Fill in the following details:</li>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li><strong>Network Name:</strong> Polygon Amoy Testnet</li>
              <li><strong>New RPC URL:</strong> https://rpc-amoy.polygon.technology</li>
              <li><strong>Chain ID:</strong> 80002</li>
              <li><strong>Currency Symbol:</strong> MATIC</li>
              <li><strong>Block Explorer URL:</strong> https://amoy.polygonscan.com</li>
            </ul>
            <li>Click "Save"</li>
          </ol>
        </motion.div>
      )}
    </div>
  )
}
