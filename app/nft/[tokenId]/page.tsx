'use client'

import { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { 
  HeartIcon,
  ShareIcon,
  EyeIcon,
  ClockIcon,
  UserIcon,
  TagIcon,
  ChartBarIcon,
  FireIcon,
  ShoppingCartIcon,
  CurrencyDollarIcon,
  ArrowLeftIcon,
  DocumentDuplicateIcon,
  InformationCircleIcon,
  CalendarIcon,
  GlobeAltIcon,
  ChatBubbleLeftRightIcon,
  ArrowTopRightOnSquareIcon
} from '@heroicons/react/24/outline'
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid'
import NFTCard from '@/components/NFTCard'
import AuctionModal from '@/components/AuctionModal'
import ChatIntegration from '@/components/ChatIntegration'

interface NFTDetail {
  tokenId: string
  name: string
  description: string
  image: string
  price: string
  seller: string
  owner: string
  creator: string
  sold: boolean
  isListed: boolean
  royaltyPercentage: number
  category: string
  collection: string
  likes: number
  views: number
  trending: boolean
  rarity: string
  attributes: Array<{ trait: string; value: string; rarity?: number }>
  contractAddress: string
  tokenStandard: string
  blockchain: string
  createdAt: Date
  lastSale?: {
    price: string
    date: Date
    buyer: string
    seller: string
  }
}

interface PriceHistory {
  date: Date
  price: number
  type: 'sale' | 'list' | 'offer'
}

interface Activity {
  id: string
  type: 'mint' | 'buy' | 'sell' | 'transfer' | 'list' | 'offer'
  price?: string
  from: string
  to: string
  timestamp: Date
  txHash: string
}

export default function NFTDetailPage({ params }: { params: { tokenId: string } }) {
  const { address, isConnected } = useAccount()
  const [nft, setNft] = useState<NFTDetail | null>(null)
  const [priceHistory, setPriceHistory] = useState<PriceHistory[]>([])
  const [activities, setActivities] = useState<Activity[]>([])
  const [similarNFTs, setSimilarNFTs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isLiked, setIsLiked] = useState(false)
  const [activeTab, setActiveTab] = useState('details')
  const [showFullDescription, setShowFullDescription] = useState(false)
  const [isZoomed, setIsZoomed] = useState(false)
  const [showAuctionModal, setShowAuctionModal] = useState(false)
  const [showChatSystem, setShowChatSystem] = useState(false)
  const [auctionData, setAuctionData] = useState<any>(null)

  // Mock data
  const mockNFT: NFTDetail = {
    tokenId: params.tokenId,
    name: 'Cosmic Explorer #1',
    description: 'A unique digital artwork exploring the cosmos with vibrant colors and deep space themes. This piece represents the infinite possibilities of the universe and the human desire to explore beyond our known boundaries. Created using advanced digital art techniques and inspired by real astronomical phenomena.',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&h=800&fit=crop&crop=center&q=80',
    price: '0.05',
    seller: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
    owner: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
    creator: '0x123d35Cc6634C0532925a3b8D4C9db96C4b4d123',
    sold: false,
    isListed: true,
    royaltyPercentage: 2.5,
    category: 'Art',
    collection: 'Cosmic Series',
    likes: 127,
    views: 892,
    trending: true,
    rarity: 'Rare',
    attributes: [
      { trait: 'Background', value: 'Space', rarity: 15 },
      { trait: 'Color', value: 'Purple', rarity: 25 },
      { trait: 'Style', value: 'Abstract', rarity: 40 },
      { trait: 'Rarity', value: 'Rare', rarity: 10 }
    ],
    contractAddress: '0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D',
    tokenStandard: 'ERC-721',
    blockchain: 'Polygon',
    createdAt: new Date('2024-01-15'),
    lastSale: {
      price: '0.03',
      date: new Date('2024-01-10'),
      buyer: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
      seller: '0x456d35Cc6634C0532925a3b8D4C9db96C4b4d456'
    }
  }

  const mockPriceHistory: PriceHistory[] = [
    { date: new Date('2024-01-01'), price: 0.02, type: 'sale' },
    { date: new Date('2024-01-05'), price: 0.025, type: 'list' },
    { date: new Date('2024-01-10'), price: 0.03, type: 'sale' },
    { date: new Date('2024-01-15'), price: 0.05, type: 'list' }
  ]

  const mockActivities: Activity[] = [
    {
      id: '1',
      type: 'list',
      price: '0.05',
      from: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
      to: '0x0000000000000000000000000000000000000000',
      timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
      txHash: '0x1234567890abcdef1234567890abcdef12345678'
    },
    {
      id: '2',
      type: 'buy',
      price: '0.03',
      from: '0x456d35Cc6634C0532925a3b8D4C9db96C4b4d456',
      to: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
      timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      txHash: '0xabcdef1234567890abcdef1234567890abcdef12'
    }
  ]

  const mockSimilarNFTs = [
    {
      tokenId: '2',
      name: 'Cosmic Explorer #2',
      image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=400&fit=crop&crop=center&q=80',
      price: '0.08',
      collection: 'Cosmic Series'
    },
    {
      tokenId: '3',
      name: 'Cosmic Explorer #3',
      image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&h=400&fit=crop&crop=center&q=80',
      price: '0.12',
      collection: 'Cosmic Series'
    }
  ]

  // Mock auction data
  const mockAuctionData = {
    tokenId: params.tokenId,
    name: 'Cosmic Explorer #1',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&h=800&fit=crop&crop=center&q=80',
    description: 'A unique digital artwork exploring the cosmos with vibrant colors and deep space themes.',
    startingPrice: '0.03',
    currentBid: '0.05',
    reservePrice: '0.04',
    startTime: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    endTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
    seller: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
    sellerName: 'NFT Creator',
    bids: [
      {
        id: '1',
        bidder: '0x123d35Cc6634C0532925a3b8D4C9db96C4b4d123',
        bidderName: 'Bidder 1',
        amount: '0.05',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        txHash: '0x1234567890abcdef1234567890abcdef12345678'
      },
      {
        id: '2',
        bidder: '0x456d35Cc6634C0532925a3b8D4C9db96C4b4d456',
        bidderName: 'Bidder 2',
        amount: '0.04',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
        txHash: '0xabcdef1234567890abcdef1234567890abcdef12'
      }
    ],
    isActive: true
  }

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setNft(mockNFT)
      setPriceHistory(mockPriceHistory)
      setActivities(mockActivities)
      setSimilarNFTs(mockSimilarNFTs)
      setAuctionData(mockAuctionData)
      setLoading(false)
    }, 1500)
  }, [params.tokenId])

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    // You could show a toast notification here
  }

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: nft?.name || 'Amazing NFT',
        text: nft?.description || 'Check out this amazing NFT!',
        url: window.location.href
      })
    } else {
      copyToClipboard(window.location.href)
    }
  }

  const getRarityColor = (rarity: string) => {
    switch (rarity?.toLowerCase()) {
      case 'common': return 'text-gray-500 bg-gray-100 dark:bg-gray-800'
      case 'uncommon': return 'text-green-500 bg-green-100 dark:bg-green-900/30'
      case 'rare': return 'text-blue-500 bg-blue-100 dark:bg-blue-900/30'
      case 'epic': return 'text-purple-500 bg-purple-100 dark:bg-purple-900/30'
      case 'legendary': return 'text-orange-500 bg-orange-100 dark:bg-orange-900/30'
      default: return 'text-gray-500 bg-gray-100 dark:bg-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-blue-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Image Skeleton */}
            <div className="aspect-square bg-gray-200 dark:bg-gray-700 rounded-2xl animate-pulse"></div>
            
            {/* Details Skeleton */}
            <div className="space-y-6">
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/4"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/2"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-4/5"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/5"></div>
              </div>
            </div>
                  </div>
      </div>

      {/* Modals */}
      {showAuctionModal && auctionData && (
        <AuctionModal
          isOpen={showAuctionModal}
          onClose={() => setShowAuctionModal(false)}
          auction={auctionData}
        />
      )}

      {showChatSystem && (
        <ChatIntegration
          nftId={nft?.tokenId}
          sellerId={nft?.seller}
          isOpen={showChatSystem}
          onClose={() => setShowChatSystem(false)}
        />
      )}
    </div>
  )
}

  if (!nft) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">NFT Not Found</h1>
          <p className="text-gray-600 dark:text-gray-400">The requested NFT could not be found.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-blue-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link href="/marketplace" className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-primary-600 mb-8 transition-colors">
          <ArrowLeftIcon className="h-4 w-4 mr-2" />
          Back to Marketplace
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* NFT Image */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative aspect-square rounded-2xl overflow-hidden bg-white dark:bg-gray-800 shadow-2xl"
            >
              <Image
                src={nft.image}
                alt={nft.name}
                fill
                className={`object-cover transition-transform duration-300 cursor-pointer ${
                  isZoomed ? 'scale-150' : 'hover:scale-105'
                }`}
                onClick={() => setIsZoomed(!isZoomed)}
              />
              
              {/* Overlay Actions */}
              <div className="absolute top-4 right-4 flex space-x-2">
                <button
                  onClick={() => setIsLiked(!isLiked)}
                  className="p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors"
                >
                  {isLiked ? (
                    <HeartIconSolid className="h-5 w-5 text-red-500" />
                  ) : (
                    <HeartIcon className="h-5 w-5 text-white" />
                  )}
                </button>
                <button
                  onClick={handleShare}
                  className="p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors"
                >
                  <ShareIcon className="h-5 w-5 text-white" />
                </button>
              </div>

              {/* Rarity Badge */}
              <div className="absolute top-4 left-4">
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${getRarityColor(nft.rarity)}`}>
                  {nft.rarity}
                </div>
              </div>

              {/* Trending Badge */}
              {nft.trending && (
                <div className="absolute bottom-4 left-4 bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center">
                  <FireIcon className="h-3 w-3 mr-1" />
                  Trending
                </div>
              )}
            </motion.div>

            {/* Image Info */}
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="card py-4">
                <div className="text-2xl font-bold text-primary-600 mb-1">{nft.likes}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Likes</div>
              </div>
              <div className="card py-4">
                <div className="text-2xl font-bold text-secondary-600 mb-1">{nft.views}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Views</div>
              </div>
              <div className="card py-4">
                <div className="text-2xl font-bold text-green-600 mb-1">{nft.royaltyPercentage}%</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Royalty</div>
              </div>
            </div>
          </div>

          {/* NFT Details */}
          <div className="space-y-8">
            {/* Header */}
            <div>
              <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
                <Link href={`/collection/${nft.collection}`} className="hover:text-primary-600 transition-colors">
                  {nft.collection}
                </Link>
                <span>•</span>
                <span>{nft.category}</span>
              </div>
              
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                {nft.name}
              </h1>
              
              <div className="flex items-center space-x-6 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center space-x-2">
                  <EyeIcon className="h-4 w-4" />
                  <span>{nft.views} views</span>
                </div>
                <div className="flex items-center space-x-2">
                  <HeartIcon className="h-4 w-4" />
                  <span>{nft.likes} likes</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CalendarIcon className="h-4 w-4" />
                  <span>Created {formatDate(nft.createdAt)}</span>
                </div>
              </div>
            </div>

            {/* Price & Action */}
            <div className="card">
              {nft.isListed && !nft.sold ? (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Current Price</div>
                      <div className="flex items-center space-x-2">
                        <span className="text-3xl font-bold text-gray-900 dark:text-white">{nft.price} ETH</span>
                        <span className="text-lg text-gray-500 dark:text-gray-400">
                          ≈ ${(parseFloat(nft.price) * 2340).toLocaleString()}
                        </span>
                      </div>
                    </div>
                    {nft.lastSale && (
                      <div className="text-right">
                        <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Last Sale</div>
                        <div className="text-lg font-semibold text-gray-900 dark:text-white">
                          {nft.lastSale.price} ETH
                        </div>
                      </div>
                    )}
                  </div>

                  {nft.seller !== address ? (
                    <div className="space-y-3">
                      <div className="flex space-x-3">
                        <button className="flex-1 btn-primary flex items-center justify-center">
                          <ShoppingCartIcon className="h-5 w-5 mr-2" />
                          Buy Now
                        </button>
                        <button className="flex-1 btn-outline">
                          Make Offer
                        </button>
                      </div>
                      
                      {/* Auction and Chat Actions */}
                      <div className="flex space-x-3">
                        <button 
                          onClick={() => setShowAuctionModal(true)}
                          className="flex-1 btn-secondary flex items-center justify-center"
                        >
                          <ChartBarIcon className="h-5 w-5 mr-2" />
                          View Auction
                        </button>
                        <button 
                          onClick={() => setShowChatSystem(true)}
                          className="flex-1 btn-outline flex items-center justify-center"
                        >
                          <ChatBubbleLeftRightIcon className="h-5 w-5 mr-2" />
                          Chat
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <span className="text-blue-600 dark:text-blue-400 font-medium">You own this NFT</span>
                    </div>
                  )}
                </div>
              ) : nft.sold ? (
                <div className="text-center py-6">
                  <div className="text-lg font-semibold text-gray-500 dark:text-gray-400 mb-2">This NFT has been sold</div>
                  <div className="text-2xl font-bold text-green-600">
                    Sold for {nft.lastSale?.price} ETH
                  </div>
                </div>
              ) : (
                <div className="text-center py-6">
                  <div className="text-lg font-semibold text-gray-500 dark:text-gray-400">
                    This NFT is not currently listed for sale
                  </div>
                </div>
              )}
            </div>

            {/* Tabs */}
            <div>
              <div className="border-b border-gray-200 dark:border-gray-700">
                <nav className="flex space-x-8">
                  {[
                    { id: 'details', label: 'Details' },
                    { id: 'history', label: 'Price History' },
                    { id: 'activity', label: 'Activity' }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                        activeTab === tab.id
                          ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                          : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Tab Content */}
              <div className="mt-6">
                {activeTab === 'details' && (
                  <div className="space-y-6">
                    {/* Description */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Description</h3>
                      <div className="text-gray-600 dark:text-gray-400">
                        <p className={showFullDescription ? '' : 'line-clamp-3'}>
                          {nft.description}
                        </p>
                        {nft.description.length > 200 && (
                          <button
                            onClick={() => setShowFullDescription(!showFullDescription)}
                            className="text-primary-600 hover:text-primary-700 mt-2 text-sm font-medium"
                          >
                            {showFullDescription ? 'Show less' : 'Show more'}
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Attributes */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Attributes</h3>
                      <div className="grid grid-cols-2 gap-3">
                        {nft.attributes.map((attr, index) => (
                          <div key={index} className="card-hover">
                            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">{attr.trait}</div>
                            <div className="font-semibold text-gray-900 dark:text-white">{attr.value}</div>
                            {attr.rarity && (
                              <div className="text-xs text-gray-500 mt-1">{attr.rarity}% have this trait</div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Owner & Creator Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="card">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
                            <UserIcon className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">Owner</div>
                            <Link href={`/profile/${nft.owner}`} className="font-medium text-gray-900 dark:text-white hover:text-primary-600 transition-colors">
                              {formatAddress(nft.owner)}
                            </Link>
                          </div>
                        </div>
                      </div>

                      <div className="card">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-secondary-500 to-accent-500 rounded-full flex items-center justify-center">
                            <UserIcon className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">Creator</div>
                            <Link href={`/profile/${nft.creator}`} className="font-medium text-gray-900 dark:text-white hover:text-primary-600 transition-colors">
                              {formatAddress(nft.creator)}
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Contract Details */}
                    <div className="card">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Contract Details</h4>
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600 dark:text-gray-400">Contract Address</span>
                          <div className="flex items-center space-x-2">
                            <span className="font-mono text-gray-900 dark:text-white">{formatAddress(nft.contractAddress)}</span>
                            <button onClick={() => copyToClipboard(nft.contractAddress)} className="text-gray-400 hover:text-gray-600">
                              <DocumentDuplicateIcon className="h-4 w-4" />
                            </button>
                            <a href={`https://polygonscan.com/address/${nft.contractAddress}`} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-600">
                              <ArrowTopRightOnSquareIcon className="h-4 w-4" />
                            </a>
                          </div>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Token Standard</span>
                          <span className="text-gray-900 dark:text-white">{nft.tokenStandard}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Blockchain</span>
                          <span className="text-gray-900 dark:text-white">{nft.blockchain}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Token ID</span>
                          <span className="text-gray-900 dark:text-white">#{nft.tokenId}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'history' && (
                  <div className="space-y-4">
                    <div className="card">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Price History</h3>
                      <div className="space-y-3">
                        {priceHistory.map((entry, index) => (
                          <div key={index} className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700 last:border-0">
                            <div className="flex items-center space-x-3">
                              <div className={`w-2 h-2 rounded-full ${
                                entry.type === 'sale' ? 'bg-green-500' : 'bg-blue-500'
                              }`}></div>
                              <span className="text-gray-900 dark:text-white capitalize">{entry.type}</span>
                            </div>
                            <div className="text-right">
                              <div className="font-semibold text-gray-900 dark:text-white">{entry.price} ETH</div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">{formatDate(entry.date)}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'activity' && (
                  <div className="space-y-4">
                    {activities.map((activity, index) => (
                      <div key={activity.id} className="card flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                            {activity.type === 'buy' && <ShoppingCartIcon className="h-5 w-5 text-green-500" />}
                            {activity.type === 'sell' && <CurrencyDollarIcon className="h-5 w-5 text-blue-500" />}
                            {activity.type === 'list' && <TagIcon className="h-5 w-5 text-orange-500" />}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white capitalize">
                              {activity.type} {activity.price && `for ${activity.price} ETH`}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              from {formatAddress(activity.from)} to {formatAddress(activity.to)}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-500 dark:text-gray-400">{formatDate(activity.timestamp)}</div>
                          <a href={`https://polygonscan.com/tx/${activity.txHash}`} target="_blank" rel="noopener noreferrer" className="text-xs text-primary-600 hover:text-primary-700">
                            View Transaction
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Similar NFTs */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">More from this collection</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {similarNFTs.map((similarNft, index) => (
              <motion.div
                key={similarNft.tokenId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <NFTCard nft={similarNft} />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
