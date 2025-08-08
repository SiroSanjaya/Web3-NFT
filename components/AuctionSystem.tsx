'use client'

import { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'
import { motion } from 'framer-motion'
import { 
  ChartBarIcon,
  ClockIcon,
  CurrencyDollarIcon,
  UserIcon,
  FireIcon,
  ExclamationTriangleIcon,
  TrophyIcon,
  ArrowUpIcon
} from '@heroicons/react/24/outline'
import Image from 'next/image'

interface Auction {
  id: string
  tokenId: string
  name: string
  image: string
  currentBid: string
  endTime: Date
  seller: string
  bids: Array<{
    bidder: string
    amount: string
    timestamp: Date
  }>
  isActive: boolean
}

interface AuctionSystemProps {
  nftId: string
}

export default function AuctionSystem({ nftId }: AuctionSystemProps) {
  const { address, isConnected } = useAccount()
  const [auction, setAuction] = useState<Auction | null>(null)
  const [bidAmount, setBidAmount] = useState('')
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  // Mock auction data
  const mockAuction: Auction = {
    id: '1',
    tokenId: nftId,
    name: 'Cosmic Explorer #1',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=400&fit=crop&crop=center&q=80',
    currentBid: '0.05',
    endTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    seller: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
    bids: [
      { bidder: '0x123d35Cc6634C0532925a3b8D4C9db96C4b4d123', amount: '0.05', timestamp: new Date() },
      { bidder: '0x456d35Cc6634C0532925a3b8D4C9db96C4b4d456', amount: '0.04', timestamp: new Date() }
    ],
    isActive: true
  }

  useEffect(() => {
    setAuction(mockAuction)
  }, [nftId])

  useEffect(() => {
    if (!auction || !auction.isActive) return

    const timer = setInterval(() => {
      const now = new Date().getTime()
      const endTime = auction.endTime.getTime()
      const difference = endTime - now

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24))
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((difference % (1000 * 60)) / 1000)

        setTimeLeft({ days, hours, minutes, seconds })
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [auction])

  const handleSubmitBid = async () => {
    if (!bidAmount || !auction || !isConnected) return

    const bidValue = parseFloat(bidAmount)
    const currentBidValue = parseFloat(auction.currentBid)

    if (bidValue <= currentBidValue) {
      alert('Bid must be higher than current bid')
      return
    }

    // Simulate bid submission
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const newBid = {
      bidder: address!,
      amount: bidAmount,
      timestamp: new Date()
    }

    setAuction(prev => prev ? {
      ...prev,
      currentBid: bidAmount,
      bids: [newBid, ...prev.bids]
    } : null)

    setBidAmount('')
  }

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  if (!auction) {
    return (
      <div className="card text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading auction data...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Auction Header */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <ChartBarIcon className="h-6 w-6 text-orange-500" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Live Auction
            </h3>
            {auction.isActive && (
              <div className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-600 text-xs font-medium rounded-full">
                Active
              </div>
            )}
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-600 dark:text-gray-400">Current Bid</div>
            <div className="text-2xl font-bold text-primary-600">{auction.currentBid} ETH</div>
          </div>
        </div>

        {/* Countdown Timer */}
        {auction.isActive && (
          <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 p-4 rounded-lg mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <ClockIcon className="h-5 w-5 text-orange-500" />
                <span className="font-medium text-gray-900 dark:text-white">Time Remaining</span>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-orange-600">
                  {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Bid Form */}
        {auction.isActive && isConnected && auction.seller !== address && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Your Bid (ETH)
              </label>
              <div className="flex space-x-3">
                <input
                  type="number"
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  placeholder={(parseFloat(auction.currentBid) + 0.01).toFixed(2)}
                  min={(parseFloat(auction.currentBid) + 0.01).toFixed(2)}
                  step="0.01"
                  className="flex-1 input-field"
                />
                <button
                  onClick={handleSubmitBid}
                  disabled={!bidAmount}
                  className="btn-primary px-6"
                >
                  <ArrowUpIcon className="h-4 w-4 mr-2" />
                  Place Bid
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Bid History */}
        <div className="space-y-3">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Bids</h4>
          {auction.bids.slice(0, 3).map((bid, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div>
                <div className="font-medium text-gray-900 dark:text-white">
                  {formatAddress(bid.bidder)}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {bid.timestamp.toLocaleTimeString()}
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-gray-900 dark:text-white">
                  {bid.amount} ETH
                </div>
                {index === 0 && (
                  <div className="text-xs text-green-600 font-medium">Highest</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
