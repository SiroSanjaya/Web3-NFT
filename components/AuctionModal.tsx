'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAccount } from 'wagmi'
import { 
  XMarkIcon,
  ClockIcon,
  CurrencyDollarIcon,
  GavelIcon,
  TrophyIcon,
  UserIcon,
  FireIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'
import Image from 'next/image'

interface Bid {
  id: string
  bidder: string
  bidderName: string
  amount: string
  timestamp: Date
  txHash: string
}

interface AuctionData {
  tokenId: string
  name: string
  image: string
  description: string
  startingPrice: string
  currentBid: string
  reservePrice?: string
  startTime: Date
  endTime: Date
  seller: string
  sellerName: string
  bids: Bid[]
  isActive: boolean
  winner?: string
}

interface AuctionModalProps {
  isOpen: boolean
  onClose: () => void
  auction: AuctionData | null
}

export default function AuctionModal({ isOpen, onClose, auction }: AuctionModalProps) {
  const { address, isConnected } = useAccount()
  const [bidAmount, setBidAmount] = useState('')
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  })
  const [isSubmittingBid, setIsSubmittingBid] = useState(false)
  const [showBidHistory, setShowBidHistory] = useState(false)

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
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
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

    setIsSubmittingBid(true)
    try {
      // Simulate bid submission
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Add new bid to auction (in real app, this would come from the blockchain)
      const newBid: Bid = {
        id: Date.now().toString(),
        bidder: address!,
        bidderName: 'You',
        amount: bidAmount,
        timestamp: new Date(),
        txHash: '0x' + Math.random().toString(16).substr(2, 64)
      }

      // Update auction data (in real app, this would be fetched from the contract)
      auction.bids.unshift(newBid)
      auction.currentBid = bidAmount

      setBidAmount('')
      alert('Bid submitted successfully!')
    } catch (error) {
      console.error('Error submitting bid:', error)
      alert('Error submitting bid. Please try again.')
    } finally {
      setIsSubmittingBid(false)
    }
  }

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const formatTime = (date: Date) => {
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getMinimumBid = () => {
    const currentBid = parseFloat(auction?.currentBid || '0')
    const increment = currentBid * 0.05 // 5% increment
    return Math.max(increment, 0.001) // Minimum 0.001 ETH increment
  }

  if (!auction) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          {/* Backdrop */}
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
          
          {/* Modal */}
          <div className="flex min-h-full items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-3">
                  <GavelIcon className="h-6 w-6 text-orange-500" />
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Live Auction
                  </h2>
                  {auction.isActive && (
                    <div className="flex items-center space-x-1 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-2 py-1 rounded-full text-xs">
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                      <span>Live</span>
                    </div>
                  )}
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <XMarkIcon className="h-5 w-5 text-gray-500" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Left Column - NFT Info */}
                  <div className="space-y-6">
                    {/* NFT Image */}
                    <div className="relative aspect-square rounded-2xl overflow-hidden">
                      <Image
                        src={auction.image}
                        alt={auction.name}
                        fill
                        className="object-cover"
                      />
                      {auction.isActive && (
                        <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center">
                          <FireIcon className="h-4 w-4 mr-1" />
                          Live Auction
                        </div>
                      )}
                    </div>

                    {/* NFT Details */}
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        {auction.name}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-4">
                        {auction.description}
                      </p>
                      
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
                          <UserIcon className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">Seller</div>
                          <div className="font-medium text-gray-900 dark:text-white">
                            {auction.sellerName}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Auction Stats */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="card text-center">
                        <div className="text-lg font-bold text-primary-600 mb-1">
                          {auction.startingPrice} ETH
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Starting Price</div>
                      </div>
                      
                      <div className="card text-center">
                        <div className="text-lg font-bold text-secondary-600 mb-1">
                          {auction.bids.length}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Total Bids</div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column - Bidding */}
                  <div className="space-y-6">
                    {/* Countdown Timer */}
                    {auction.isActive ? (
                      <div className="card bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 border-orange-200 dark:border-orange-700">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-semibold text-gray-900 dark:text-white flex items-center">
                            <ClockIcon className="h-5 w-5 mr-2 text-orange-500" />
                            Time Remaining
                          </h4>
                        </div>
                        
                        <div className="grid grid-cols-4 gap-4 text-center">
                          <div>
                            <div className="text-2xl font-bold text-orange-600">{timeLeft.days}</div>
                            <div className="text-xs text-gray-600 dark:text-gray-400">Days</div>
                          </div>
                          <div>
                            <div className="text-2xl font-bold text-orange-600">{timeLeft.hours}</div>
                            <div className="text-xs text-gray-600 dark:text-gray-400">Hours</div>
                          </div>
                          <div>
                            <div className="text-2xl font-bold text-orange-600">{timeLeft.minutes}</div>
                            <div className="text-xs text-gray-600 dark:text-gray-400">Minutes</div>
                          </div>
                          <div>
                            <div className="text-2xl font-bold text-orange-600">{timeLeft.seconds}</div>
                            <div className="text-xs text-gray-600 dark:text-gray-400">Seconds</div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="card bg-gray-50 dark:bg-gray-700 text-center">
                        <TrophyIcon className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                          Auction Ended
                        </h4>
                        {auction.winner ? (
                          <p className="text-gray-600 dark:text-gray-400">
                            Won by {formatAddress(auction.winner)}
                          </p>
                        ) : (
                          <p className="text-gray-600 dark:text-gray-400">
                            No winning bid
                          </p>
                        )}
                      </div>
                    )}

                    {/* Current Bid */}
                    <div className="card">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
                        Current Bid
                      </h4>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-3xl font-bold text-green-600">
                            {auction.currentBid} ETH
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            ≈ ${(parseFloat(auction.currentBid) * 2340).toLocaleString()}
                          </div>
                        </div>
                        {auction.bids.length > 0 && (
                          <div className="text-right">
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              by {auction.bids[0].bidderName === 'You' ? 'You' : formatAddress(auction.bids[0].bidder)}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {formatTime(auction.bids[0].timestamp)}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Place Bid */}
                    {auction.isActive && auction.seller !== address && (
                      <div className="card">
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
                          Place a Bid
                        </h4>
                        
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Your Bid (ETH)
                            </label>
                            <div className="relative">
                              <input
                                type="number"
                                step="0.001"
                                min={parseFloat(auction.currentBid) + getMinimumBid()}
                                value={bidAmount}
                                onChange={(e) => setBidAmount(e.target.value)}
                                placeholder={`Minimum: ${(parseFloat(auction.currentBid) + getMinimumBid()).toFixed(3)} ETH`}
                                className="input-field pr-16"
                              />
                              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400">
                                ETH
                              </div>
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              Minimum bid increment: {getMinimumBid().toFixed(3)} ETH
                            </div>
                          </div>

                          {auction.reservePrice && parseFloat(bidAmount) < parseFloat(auction.reservePrice) && (
                            <div className="flex items-center space-x-2 text-amber-600 dark:text-amber-400 text-sm">
                              <ExclamationTriangleIcon className="h-4 w-4" />
                              <span>Reserve price: {auction.reservePrice} ETH</span>
                            </div>
                          )}

                          <button
                            onClick={handleSubmitBid}
                            disabled={!bidAmount || parseFloat(bidAmount) <= parseFloat(auction.currentBid) || isSubmittingBid || !isConnected}
                            className="w-full btn-primary flex items-center justify-center"
                          >
                            {isSubmittingBid ? (
                              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                            ) : (
                              <GavelIcon className="h-5 w-5 mr-2" />
                            )}
                            {isSubmittingBid ? 'Placing Bid...' : 'Place Bid'}
                          </button>

                          {!isConnected && (
                            <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                              Connect your wallet to place a bid
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Bid History */}
                    <div className="card">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          Bid History ({auction.bids.length})
                        </h4>
                        <button
                          onClick={() => setShowBidHistory(!showBidHistory)}
                          className="text-sm text-primary-600 hover:text-primary-700"
                        >
                          {showBidHistory ? 'Hide' : 'Show All'}
                        </button>
                      </div>

                      <div className="space-y-3 max-h-64 overflow-y-auto">
                        {(showBidHistory ? auction.bids : auction.bids.slice(0, 3)).map((bid, index) => (
                          <motion.div
                            key={bid.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                          >
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                                {index + 1}
                              </div>
                              <div>
                                <div className="font-medium text-gray-900 dark:text-white">
                                  {bid.bidderName === 'You' ? 'You' : formatAddress(bid.bidder)}
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                  {formatTime(bid.timestamp)}
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-semibold text-gray-900 dark:text-white">
                                {bid.amount} ETH
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                ≈ ${(parseFloat(bid.amount) * 2340).toLocaleString()}
                              </div>
                            </div>
                          </motion.div>
                        ))}
                        
                        {auction.bids.length === 0 && (
                          <div className="text-center py-6 text-gray-500 dark:text-gray-400">
                            No bids yet. Be the first to bid!
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  )
}
