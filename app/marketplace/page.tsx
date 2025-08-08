'use client'

import { useState, useEffect } from 'react'
import { useAccount, useContractRead, useContractWrite, usePrepareContractWrite } from 'wagmi'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { motion } from 'framer-motion'
import { 
  PlusIcon, 
  MagnifyingGlassIcon,
  FunnelIcon,
  CurrencyDollarIcon,
  ClockIcon,
  UserIcon,
  FireIcon,
  StarIcon,
  HeartIcon,
  EyeIcon,
  ChartBarIcon,
  TagIcon,
  SparklesIcon,
  AdjustmentsHorizontalIcon,
  Squares2X2Icon,
  ListBulletIcon,
  SunIcon,
  MoonIcon,
  BellIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'
import { HeartIcon as HeartIconSolid, StarIcon as StarIconSolid } from '@heroicons/react/24/solid'
import NFTMintModal from '@/components/NFTMintModal'
import NFTCard from '@/components/NFTCard'
import AuctionSystem from '@/components/AuctionSystem'
import { NFTMarketplaceABI } from '@/utils/contracts'
import Logo from '@/components/Logo'
import DarkModeToggle from '@/components/DarkModeToggle'
import NotificationCenter from '@/components/NotificationCenter'
import AdvancedSearchModal from '@/components/AdvancedSearchModal'
import { NFTCardSkeleton, StatsCardSkeleton } from '@/components/SkeletonLoader'

// Enhanced mock data with more features
const mockNFTs = [
  {
    tokenId: '1',
    name: 'Cosmic Explorer #1',
    description: 'A unique digital artwork exploring the cosmos with vibrant colors and deep space themes',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=400&fit=crop&crop=center&q=80',
    price: '0.05',
    seller: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
    owner: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
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
      { trait: 'Background', value: 'Space' },
      { trait: 'Color', value: 'Purple' },
      { trait: 'Rarity', value: 'Rare' }
    ]
  },
  {
    tokenId: '2',
    name: 'Digital Dreams #2',
    description: 'Abstract digital art representing dreams and aspirations with flowing patterns',
    image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=400&fit=crop&crop=center&q=80',
    price: '0.1',
    seller: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
    owner: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
    sold: false,
    isListed: true,
    royaltyPercentage: 2.5,
    category: 'Abstract',
    collection: 'Dream Series',
    likes: 89,
    views: 456,
    trending: false,
    rarity: 'Common',
    attributes: [
      { trait: 'Style', value: 'Abstract' },
      { trait: 'Mood', value: 'Dreamy' },
      { trait: 'Rarity', value: 'Common' }
    ]
  },
  {
    tokenId: '3',
    name: 'Neon City #3',
    description: 'Cyberpunk inspired cityscape with neon lights and futuristic architecture',
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&h=400&fit=crop&crop=center&q=80',
    price: '0.25',
    seller: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
    owner: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
    sold: false,
    isListed: true,
    royaltyPercentage: 2.5,
    category: 'Cyberpunk',
    collection: 'Neon Series',
    likes: 234,
    views: 1203,
    trending: true,
    rarity: 'Epic',
    attributes: [
      { trait: 'Theme', value: 'Cyberpunk' },
      { trait: 'Lighting', value: 'Neon' },
      { trait: 'Rarity', value: 'Epic' }
    ]
  },
  {
    tokenId: '4',
    name: 'Nature Harmony #4',
    description: 'Peaceful nature scene with mountains and flowing water',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop&crop=center&q=80',
    price: '0.08',
    seller: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
    owner: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
    sold: false,
    isListed: true,
    royaltyPercentage: 2.5,
    category: 'Nature',
    collection: 'Harmony Series',
    likes: 156,
    views: 678,
    trending: false,
    rarity: 'Uncommon',
    attributes: [
      { trait: 'Environment', value: 'Mountain' },
      { trait: 'Season', value: 'Spring' },
      { trait: 'Rarity', value: 'Uncommon' }
    ]
  },
  {
    tokenId: '5',
    name: 'Retro Gaming #5',
    description: 'Nostalgic retro gaming artwork with pixel art style',
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=400&fit=crop&crop=center&q=80',
    price: '0.15',
    seller: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
    owner: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
    sold: false,
    isListed: true,
    royaltyPercentage: 2.5,
    category: 'Gaming',
    collection: 'Retro Series',
    likes: 312,
    views: 1456,
    trending: true,
    rarity: 'Legendary',
    attributes: [
      { trait: 'Style', value: 'Pixel Art' },
      { trait: 'Era', value: 'Retro' },
      { trait: 'Rarity', value: 'Legendary' }
    ]
  }
]

const categories = ['All', 'Art', 'Abstract', 'Cyberpunk', 'Nature', 'Gaming', 'Music', 'Sports']
const collections = ['All Collections', 'Cosmic Series', 'Dream Series', 'Neon Series', 'Harmony Series', 'Retro Series']

export default function Marketplace() {
  const { address, isConnected } = useAccount()
  const [showMintModal, setShowMintModal] = useState(false)
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterPrice, setFilterPrice] = useState('all')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedCollection, setSelectedCollection] = useState('All Collections')
  const [sortBy, setSortBy] = useState('newest')
  const [viewMode, setViewMode] = useState('grid') // grid or list
  const [nfts, setNfts] = useState(mockNFTs)
  const [loading, setLoading] = useState(false)
  const [likedNFTs, setLikedNFTs] = useState<string[]>([])
  const [favorites, setFavorites] = useState<string[]>([])
  const [isFiltersVisible, setIsFiltersVisible] = useState(true)
  const [showAuctionSystem, setShowAuctionSystem] = useState(false)
  const [selectedAuctionNFT, setSelectedAuctionNFT] = useState<string | null>(null)

  // Contract addresses (replace with actual deployed addresses)
  const NFT_MARKETPLACE_ADDRESS = (process.env.NEXT_PUBLIC_NFT_MARKETPLACE_ADDRESS || '0x0000000000000000000000000000000000000000') as `0x${string}`

  // Fetch listed NFTs - only if contract address is valid
  const { data: listedNFTs, refetch: refetchNFTs, isError: contractError } = useContractRead({
    address: NFT_MARKETPLACE_ADDRESS,
    abi: NFTMarketplaceABI,
    functionName: 'fetchListedNFTs',
    watch: true,
    enabled: NFT_MARKETPLACE_ADDRESS !== '0x0000000000000000000000000000000000000000',
  })

  useEffect(() => {
    if (listedNFTs && Array.isArray(listedNFTs) && listedNFTs.length > 0) {
      setNfts(listedNFTs as any[])
      setLoading(false)
    } else if (contractError || NFT_MARKETPLACE_ADDRESS === '0x0000000000000000000000000000000000000000') {
      // Use mock data if contract is not deployed or there's an error
      setNfts(mockNFTs)
      setLoading(false)
    }
  }, [listedNFTs, contractError, NFT_MARKETPLACE_ADDRESS])

  const handleLike = (tokenId: string) => {
    setLikedNFTs(prev => 
      prev.includes(tokenId) 
        ? prev.filter(id => id !== tokenId)
        : [...prev, tokenId]
    )
  }

  const handleFavorite = (tokenId: string) => {
    setFavorites(prev => 
      prev.includes(tokenId) 
        ? prev.filter(id => id !== tokenId)
        : [...prev, tokenId]
    )
  }

  const handleAdvancedSearch = (filters: any) => {
    // Apply advanced filters logic here
    console.log('Applied filters:', filters)
    // You can implement more complex filtering logic based on the filters object
  }

  const filteredNFTs = nfts.filter(nft => {
    const matchesSearch = nft.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         nft.description?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesCategory = selectedCategory === 'All' || nft.category === selectedCategory
    const matchesCollection = selectedCollection === 'All Collections' || nft.collection === selectedCollection
    
    let matchesPrice = true
    if (filterPrice === 'low') {
      matchesPrice = parseFloat(nft.price) < 0.1
    } else if (filterPrice === 'medium') {
      matchesPrice = parseFloat(nft.price) >= 0.1 && parseFloat(nft.price) < 1
    } else if (filterPrice === 'high') {
      matchesPrice = parseFloat(nft.price) >= 1
    }
    
    return matchesSearch && matchesPrice && matchesCategory && matchesCollection
  })

  const sortedNFTs = [...filteredNFTs].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return parseInt(b.tokenId) - parseInt(a.tokenId)
      case 'oldest':
        return parseInt(a.tokenId) - parseInt(b.tokenId)
      case 'price-low':
        return parseFloat(a.price) - parseFloat(b.price)
      case 'price-high':
        return parseFloat(b.price) - parseFloat(a.price)
      case 'trending':
        return (b.likes || 0) - (a.likes || 0)
      case 'popular':
        return (b.views || 0) - (a.views || 0)
      default:
        return 0
    }
  })

  const trendingNFTs = nfts.filter(nft => nft.trending).slice(0, 3)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-blue-900">
      {/* Enhanced Header */}
      <div className="sticky top-0 z-50 glass-effect border-b border-white/20 dark:border-gray-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Left side - Logo */}
            <div className="flex items-center">
              <Logo size="md" />
              <div className="hidden sm:block ml-4">
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Discover, create & trade unique digital assets
                </p>
              </div>
            </div>
            
            {/* Center - Quick Search */}
            <div className="hidden lg:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Quick search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white/50 dark:bg-slate-800/50 border border-gray-200 dark:border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 backdrop-blur-sm transition-all duration-200"
                />
              </div>
            </div>

            {/* Right side - Actions */}
            <div className="flex items-center space-x-3">
              <DarkModeToggle />
              <NotificationCenter />
              
              {isConnected && (
                <button
                  onClick={() => setShowMintModal(true)}
                  className="btn-primary hidden sm:flex items-center"
                >
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Create NFT
                </button>
              )}
              
              <ConnectButton />
            </div>
          </div>
        </div>
      </div>

      {/* Hero Trending Section */}
      {trendingNFTs.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full text-sm font-medium mb-4">
              <FireIcon className="h-4 w-4 mr-2" />
              Hot Collections
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gradient mb-4">
              Trending Now
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Discover the most sought-after NFTs that are making waves in the community
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {trendingNFTs.map((nft, index) => (
              <motion.div
                key={nft.tokenId}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                className="relative group"
              >
                <div className="absolute -top-2 -left-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center z-10 shadow-lg">
                  <FireIcon className="h-3 w-3 mr-1" />
                  #{index + 1} Trending
                </div>
                <div className="transform group-hover:scale-105 transition-transform duration-300">
                  <NFTCard nft={nft} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Enhanced Search and Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filter Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Explore NFTs
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              {sortedNFTs.length} NFTs available • {favorites.length} in your wishlist
            </p>
          </div>
          
          <div className="flex items-center space-x-3 mt-4 sm:mt-0">
            <button
              onClick={() => setIsFiltersVisible(!isFiltersVisible)}
              className="btn-ghost flex items-center"
            >
              <FunnelIcon className="h-4 w-4 mr-2" />
              {isFiltersVisible ? 'Hide' : 'Show'} Filters
            </button>
            
            <button
              onClick={() => setShowAdvancedSearch(true)}
              className="btn-outline flex items-center"
            >
              <AdjustmentsHorizontalIcon className="h-4 w-4 mr-2" />
              Advanced Search
            </button>
          </div>
        </div>

        {/* Collapsible Filters */}
        {isFiltersVisible && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="card-glass p-6 mb-8"
          >
            {/* Mobile Search - visible on small screens */}
            <div className="lg:hidden mb-4">
              <div className="relative">
                <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search NFTs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input-field pl-10"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="input-field"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              {/* Collection Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Collection
                </label>
                <select
                  value={selectedCollection}
                  onChange={(e) => setSelectedCollection(e.target.value)}
                  className="input-field"
                >
                  {collections.map(collection => (
                    <option key={collection} value={collection}>{collection}</option>
                  ))}
                </select>
              </div>
              
              {/* Price Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Price Range
                </label>
                <select
                  value={filterPrice}
                  onChange={(e) => setFilterPrice(e.target.value)}
                  className="input-field"
                >
                  <option value="all">All Prices</option>
                  <option value="low">Under 0.1 ETH</option>
                  <option value="medium">0.1 - 1 ETH</option>
                  <option value="high">Over 1 ETH</option>
                </select>
              </div>

              {/* Sort */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Sort By
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="input-field"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="trending">Most Liked</option>
                  <option value="popular">Most Viewed</option>
                </select>
              </div>
            </div>

            {/* View Controls */}
            <div className="flex flex-wrap justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-600">
              {/* View Mode */}
              <div className="flex items-center space-x-3">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">View:</span>
                <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-md transition-all ${
                      viewMode === 'grid' 
                        ? 'bg-white dark:bg-gray-600 text-primary-600 shadow-sm' 
                        : 'text-gray-600 dark:text-gray-300 hover:text-primary-600'
                    }`}
                  >
                    <Squares2X2Icon className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-md transition-all ${
                      viewMode === 'list' 
                        ? 'bg-white dark:bg-gray-600 text-primary-600 shadow-sm' 
                        : 'text-gray-600 dark:text-gray-300 hover:text-primary-600'
                    }`}
                  >
                    <ListBulletIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>

                          {/* Quick Actions */}
            <div className="flex items-center space-x-2 mt-3 sm:mt-0">
              <button className="btn-ghost flex items-center text-sm">
                <SparklesIcon className="h-4 w-4 mr-1" />
                Surprise Me
              </button>
              <button 
                className="btn-ghost flex items-center text-sm"
                onClick={() => {
                  setSearchTerm('')
                  setSelectedCategory('All')
                  setSelectedCollection('All Collections')
                  setFilterPrice('all')
                  setSortBy('newest')
                }}
              >
                Clear All
              </button>
              <button 
                className="btn-outline flex items-center text-sm"
                onClick={() => setShowAuctionSystem(true)}
              >
                <ChartBarIcon className="h-4 w-4 mr-1" />
                View Auctions
              </button>
            </div>
            </div>
          </motion.div>
        )}

        {/* Enhanced Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
          {loading ? (
            [...Array(4)].map((_, i) => <StatsCardSkeleton key={i} />)
          ) : (
            <>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card text-center group hover:shadow-2xl transition-all duration-300"
              >
                <div className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent mb-2">
                  {sortedNFTs.length}
                </div>
                <div className="text-gray-600 dark:text-gray-400 text-sm">Total NFTs</div>
                <div className="text-xs text-green-600 mt-1">
                  +{Math.floor(Math.random() * 10)} this week
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="card text-center group hover:shadow-2xl transition-all duration-300"
              >
                <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent mb-2">
                  {nfts.filter(nft => nft.sold).length}
                </div>
                <div className="text-gray-600 dark:text-gray-400 text-sm">Sold</div>
                <div className="text-xs text-green-600 mt-1">
                  {((nfts.filter(nft => nft.sold).length / nfts.length) * 100).toFixed(1)}% sold rate
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="card text-center group hover:shadow-2xl transition-all duration-300"
              >
                <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent mb-2">
                  {nfts.filter(nft => !nft.sold).length}
                </div>
                <div className="text-gray-600 dark:text-gray-400 text-sm">Available</div>
                <div className="text-xs text-blue-600 mt-1">
                  Ready to buy
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="card text-center group hover:shadow-2xl transition-all duration-300"
              >
                <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent mb-2">
                  {nfts.length > 0 ? 
                    (nfts.reduce((sum, nft) => sum + parseFloat(nft.price || '0'), 0)).toFixed(2) : 
                    '0.00'
                  }
                </div>
                <div className="text-gray-600 dark:text-gray-400 text-sm">Floor Price (ETH)</div>
                <div className="text-xs text-purple-600 mt-1">
                  ≈ ${(parseFloat(nfts.length > 0 ? (nfts.reduce((sum, nft) => sum + parseFloat(nft.price || '0'), 0)).toFixed(2) : '0') * 2340).toLocaleString()}
                </div>
              </motion.div>
            </>
          )}
        </div>

        {/* Enhanced NFT Grid/List */}
        {loading ? (
          <div className="space-y-8">
            <div className="text-center py-8">
              <div className="inline-flex items-center px-4 py-2 bg-primary-100 dark:bg-primary-900/20 text-primary-600 rounded-full text-sm font-medium">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600 mr-2"></div>
                Loading amazing NFTs...
              </div>
            </div>
            <div className={viewMode === 'grid' 
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              : "space-y-4"
            }>
              {[...Array(8)].map((_, i) => (
                <NFTCardSkeleton key={i} />
              ))}
            </div>
          </div>
        ) : sortedNFTs.length > 0 ? (
          <div className="space-y-6">
            {/* Results Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
              <div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {sortedNFTs.length} {sortedNFTs.length === 1 ? 'NFT' : 'NFTs'} found
                </h4>
                {(searchTerm || selectedCategory !== 'All' || selectedCollection !== 'All Collections' || filterPrice !== 'all') && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Filtered results • 
                    <button 
                      onClick={() => {
                        setSearchTerm('')
                        setSelectedCategory('All')
                        setSelectedCollection('All Collections')
                        setFilterPrice('all')
                      }}
                      className="text-primary-600 hover:text-primary-700 ml-1 underline"
                    >
                      Clear filters
                    </button>
                  </p>
                )}
              </div>
              
              <div className="text-sm text-gray-500 dark:text-gray-400 mt-2 sm:mt-0">
                Showing {sortedNFTs.length} of {nfts.length} total
              </div>
            </div>

            {/* NFT Grid */}
            <div className={viewMode === 'grid' 
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              : "space-y-4"
            }>
              {sortedNFTs.map((nft, index) => (
                <motion.div
                  key={nft.tokenId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(index * 0.05, 1) }}
                  className="group"
                >
                  <NFTCard nft={nft} />
                </motion.div>
              ))}
            </div>

            {/* Load More Button (for future pagination) */}
            {sortedNFTs.length >= 8 && (
              <div className="text-center pt-8">
                <button className="btn-outline">
                  Load More NFTs
                </button>
              </div>
            )}
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="relative mx-auto w-32 h-32 mb-8">
              <div className="absolute inset-0 bg-gradient-to-r from-primary-100 to-secondary-100 dark:from-primary-900/20 dark:to-secondary-900/20 rounded-full"></div>
              <div className="relative w-full h-full flex items-center justify-center">
                <MagnifyingGlassIcon className="h-16 w-16 text-gray-400" />
              </div>
            </div>
            
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {searchTerm || filterPrice !== 'all' || selectedCategory !== 'All' 
                ? 'No NFTs match your search' 
                : 'No NFTs available yet'
              }
            </h3>
            
            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
              {searchTerm || filterPrice !== 'all' || selectedCategory !== 'All'
                ? 'Try adjusting your search criteria or browse all collections to discover amazing NFTs.'
                : 'Be the first creator to mint an NFT and start your journey in the NexusVerse!'
              }
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {(searchTerm || filterPrice !== 'all' || selectedCategory !== 'All') && (
                <button
                  onClick={() => {
                    setSearchTerm('')
                    setSelectedCategory('All')
                    setSelectedCollection('All Collections')
                    setFilterPrice('all')
                  }}
                  className="btn-outline"
                >
                  <MagnifyingGlassIcon className="h-4 w-4 mr-2" />
                  Browse All NFTs
                </button>
              )}
              
              {isConnected && (
                <button
                  onClick={() => setShowMintModal(true)}
                  className="btn-primary"
                >
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Create Your First NFT
                </button>
              )}
            </div>
          </motion.div>
        )}
      </div>

      {/* Modals */}
      {showMintModal && (
        <NFTMintModal
          isOpen={showMintModal}
          onClose={() => setShowMintModal(false)}
          onSuccess={() => {
            setShowMintModal(false)
            refetchNFTs()
          }}
        />
      )}

      {showAdvancedSearch && (
        <AdvancedSearchModal
          isOpen={showAdvancedSearch}
          onClose={() => setShowAdvancedSearch(false)}
          onApplyFilters={handleAdvancedSearch}
          categories={categories}
          collections={collections}
        />
      )}

      {/* Auction System Modal */}
      {showAuctionSystem && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Live Auctions</h2>
                <button
                  onClick={() => setShowAuctionSystem(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                >
                  <XMarkIcon className="h-6 w-6 text-gray-500" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <AuctionSystem nftId="1" />
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
