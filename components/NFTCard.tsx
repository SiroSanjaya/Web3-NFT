'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAccount, useContractWrite, usePrepareContractWrite, useChainId } from 'wagmi'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { 
  CurrencyDollarIcon, 
  UserIcon, 
  ClockIcon,
  EyeIcon,
  HeartIcon,
  FireIcon,
  StarIcon,
  TagIcon,
  ShareIcon,
  BookmarkIcon,
  ShoppingCartIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline'
import { HeartIcon as HeartIconSolid, StarIcon as StarIconSolid } from '@heroicons/react/24/solid'
import { NFTMarketplaceABI } from '@/utils/contracts'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore - JSON import is allowed via tsconfig resolveJsonModule
import deploymentLocal from '../deployment-localhost.json'
import { useEffect } from 'react'
import { fetchPrices, toUsd } from '@/utils/coingecko'
import { parseEther } from 'viem'

interface NFT {
  tokenId: string
  name?: string
  description?: string
  image?: string
  price: string
  seller: string
  owner: string
  sold: boolean
  isListed: boolean
  royaltyPercentage?: number
  category?: string
  collection?: string
  likes?: number
  views?: number
  trending?: boolean
  rarity?: string
  attributes?: Array<{ trait: string; value: string }>
}

interface NFTCardProps {
  nft: NFT
}

export default function NFTCard({ nft }: NFTCardProps) {
  const { address, isConnected } = useAccount()
  const chainId = useChainId()
  const router = useRouter()
  const [isLiked, setIsLiked] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [showDetails, setShowDetails] = useState(false)

  const ENV_ADDR = process.env.NEXT_PUBLIC_NFT_MARKETPLACE_ADDRESS as string | undefined
  const LOCAL_ADDR = (deploymentLocal as any)?.contracts?.nftMarketplace as string | undefined
  const NFT_MARKETPLACE_ADDRESS = (
    chainId === 1337 ? (ENV_ADDR || LOCAL_ADDR || '0x0000000000000000000000000000000000000000') : (ENV_ADDR || '0x0000000000000000000000000000000000000000')
  )

  // Prepare buy transaction - only if contract address is valid
  const { config: buyConfig } = usePrepareContractWrite({
    address: NFT_MARKETPLACE_ADDRESS as `0x${string}`,
    abi: NFTMarketplaceABI,
    functionName: 'buyNFT',
    args: [BigInt(nft.tokenId)],
    value: parseEther(nft.price || '0'),
    enabled: isConnected && !nft.sold && nft.isListed && nft.seller !== address && NFT_MARKETPLACE_ADDRESS !== '0x0000000000000000000000000000000000000000',
  })

  const { write: buyNFT, isLoading: isBuying } = useContractWrite(buyConfig)

  const switchToLocalhost = async () => {
    try {
      // 0x539 = 1337 (common Hardhat)
      await (window as any)?.ethereum?.request?.({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x539' }],
      })
    } catch (err: any) {
      // If the chain hasn't been added to MetaMask
      if (err?.code === 4902) {
        try {
          await (window as any)?.ethereum?.request?.({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: '0x539',
              chainName: 'Localhost 8545',
              nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
              rpcUrls: ['http://127.0.0.1:8545'],
              blockExplorerUrls: [],
            }],
          })
        } catch {}
      }
    }
  }

  const handleBuy = async () => {
    if (!isConnected) {
      alert('Connect your wallet first.')
      return
    }
    if (chainId !== 1337) {
      await switchToLocalhost()
      return
    }
    if (buyNFT) {
      buyNFT()
      return
    }
    alert('Unable to prepare transaction. Check contract address and network.')
  }

  const handleViewDetails = () => {
    router.push(`/nft/${nft.tokenId}`)
  }

  const handleLike = () => {
    setIsLiked(!isLiked)
  }

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked)
  }

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: nft.name || `NFT #${nft.tokenId}`,
        text: nft.description || 'Check out this amazing NFT!',
        url: window.location.href
      })
    } else {
      // Fallback - copy to clipboard
      navigator.clipboard.writeText(window.location.href)
      // You could show a toast notification here
    }
  }

  const formatAddress = (address?: string) => {
    if (!address || typeof address !== 'string') return 'Unknown'
    if (address.length <= 10) return address
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const formatPrice = (price: string) => {
    return parseFloat(price).toFixed(4)
  }

  const getRarityColor = (rarity: string) => {
    switch (rarity?.toLowerCase()) {
      case 'common': return 'bg-gray-500'
      case 'uncommon': return 'bg-green-500'
      case 'rare': return 'bg-blue-500'
      case 'epic': return 'bg-purple-500'
      case 'legendary': return 'bg-orange-500'
      default: return 'bg-gray-500'
    }
  }

  const [usd, setUsd] = useState<string>('')

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const prices = await fetchPrices(['eth'])
        const usdValue = await toUsd(parseFloat(nft.price || '0'), 'eth', prices)
        if (mounted) setUsd(usdValue.toLocaleString())
      } catch {}
    })()
    return () => { mounted = false }
  }, [nft.price])

  return (
    <motion.div
      className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden group hover:shadow-2xl transition-all duration-300 relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ y: -8, scale: 1.02 }}
    >
      {/* Trending Badge */}
      {nft.trending && (
        <div className="absolute top-2 left-2 bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center z-10">
          <FireIcon className="h-3 w-3 mr-1" />
          Trending
        </div>
      )}

      {/* Rarity Badge */}
      {nft.rarity && (
        <div className={`absolute top-2 right-2 ${getRarityColor(nft.rarity)} text-white px-2 py-1 rounded-full text-xs font-medium z-10`}>
          {nft.rarity}
        </div>
      )}

      {/* Image */}
      <div className="relative aspect-square overflow-hidden rounded-t-lg">
        <Image
          src={nft.image || '/placeholder-nft.png'}
          alt={nft.name || 'NFT'}
          fill
          className="object-cover transition-transform duration-300 hover:scale-110"
        />
        
        {/* Enhanced Overlay */}
        <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent transition-opacity duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}>
          {/* Quick Actions - Top */}
          <div className="absolute top-3 right-3 flex flex-col space-y-2">
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleShare}
              className="p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-all"
            >
              <ShareIcon className="h-4 w-4 text-white" />
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleBookmark}
              className="p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-all"
            >
              {isBookmarked ? (
                <BookmarkIcon className="h-4 w-4 text-yellow-400 fill-current" />
              ) : (
                <BookmarkIcon className="h-4 w-4 text-white" />
              )}
            </motion.button>
          </div>

          {/* Center Actions */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex space-x-3">
              <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowDetails(!showDetails)}
                className="p-3 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-all"
              >
                <InformationCircleIcon className="h-5 w-5 text-white" />
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleLike}
                className="p-3 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-all"
              >
                {isLiked ? (
                  <HeartIconSolid className="h-5 w-5 text-red-500" />
                ) : (
                  <HeartIcon className="h-5 w-5 text-white" />
                )}
              </motion.button>
            </div>
          </div>

          {/* Quick Buy - Bottom */}
          <div className="absolute bottom-3 left-3 right-3">
            {!nft.sold && nft.isListed && nft.seller !== address && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleBuy}
                disabled={isBuying || !isConnected}
                className="w-full bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 flex items-center justify-center backdrop-blur-sm"
              >
                {isBuying ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <>
                    <ShoppingCartIcon className="h-4 w-4 mr-2" />
                    Quick Buy
                  </>
                )}
              </motion.button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Enhanced Header */}
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white truncate group-hover:text-primary-600 transition-colors">
              {nft.name || `NFT #${nft.tokenId}`}
            </h3>
            {nft.collection && (
              <div className="flex items-center mt-1">
                <TagIcon className="h-3 w-3 mr-1 text-gray-400" />
                <span className="text-sm text-gray-500 dark:text-gray-400">{nft.collection}</span>
              </div>
            )}
          </div>
          <div className="flex flex-col items-end">
          <div className="flex items-center space-x-1 text-primary-600 dark:text-primary-400" title={usd ? `≈ $${usd}` : ''}>
              <CurrencyDollarIcon className="h-4 w-4" />
              <span className="font-bold text-lg">{formatPrice(nft.price)}</span>
              <span className="text-sm font-medium">ETH</span>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{usd && `≈ $${usd}`}</div>
          </div>
        </div>

        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
          {nft.description || 'No description available'}
        </p>

        {/* Enhanced Stats */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400">
              <HeartIcon className="h-3 w-3" />
              <span className="font-medium">{nft.likes || 0}</span>
            </div>
            <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400">
              <EyeIcon className="h-3 w-3" />
              <span className="font-medium">{nft.views || 0}</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {nft.category && (
              <div className="bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 px-2 py-1 rounded-full text-xs font-medium">
                {nft.category}
              </div>
            )}
          </div>
        </div>

        {/* Enhanced Seller Info */}
        <div className="flex justify-between items-center mb-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
              <UserIcon className="h-3 w-3 text-white" />
            </div>
            <div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Owner</div>
              <span className="text-sm text-gray-900 dark:text-white font-medium">
                {formatAddress(nft.seller)}
              </span>
            </div>
          </div>
          {nft.royaltyPercentage && (
            <div className="text-right">
              <div className="text-xs text-gray-500 dark:text-gray-400">Royalty</div>
              <div className="text-sm font-medium text-secondary-600 dark:text-secondary-400">
                {nft.royaltyPercentage}%
              </div>
            </div>
          )}
        </div>

        {/* Enhanced Attributes */}
        {nft.attributes && nft.attributes.length > 0 && (
          <div className="mb-4">
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-2 font-medium">Traits</div>
            <div className="flex flex-wrap gap-2">
              {nft.attributes.slice(0, 3).map((attr, index) => (
                <div key={index} className="bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 border border-primary-200 dark:border-primary-700 px-2 py-1 rounded-lg">
                  <div className="text-xs">
                    <span className="text-gray-500 dark:text-gray-400">{attr.trait}:</span>
                    <span className="text-gray-900 dark:text-white font-medium ml-1">{attr.value}</span>
                  </div>
                </div>
              ))}
              {nft.attributes.length > 3 && (
                <div className="text-xs text-gray-500 dark:text-gray-400 px-2 py-1">
                  +{nft.attributes.length - 3} more
                </div>
              )}
            </div>
          </div>
        )}

        {/* Enhanced Action Buttons */}
        <div className="space-y-3">
          {!nft.sold && nft.isListed && nft.seller !== address ? (
            <div className="space-y-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleBuy}
                disabled={isBuying || !isConnected}
                className="w-full bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3 px-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center"
              >
                {isBuying ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <>
                    <ShoppingCartIcon className="h-4 w-4 mr-2" />
                    Buy Now • {formatPrice(nft.price)} ETH
                  </>
                )}
              </motion.button>
              
              <div className="flex space-x-2">
                <button className="flex-1 btn-outline text-sm py-2">
                  Make Offer
                </button>
                <button className="flex-1 btn-outline text-sm py-2" onClick={handleViewDetails}>
                  View Details
                </button>
              </div>
            </div>
          ) : nft.sold ? (
            <div className="space-y-2">
              <div className="w-full text-center py-3 px-4 bg-gradient-to-r from-green-100 to-green-200 dark:from-green-900/30 dark:to-green-800/30 text-green-800 dark:text-green-400 rounded-xl font-medium border border-green-200 dark:border-green-700">
                ✅ Sold
              </div>
              <button className="w-full btn-outline text-sm py-2">
                View Details
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="w-full text-center py-3 px-4 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 text-gray-600 dark:text-gray-400 rounded-xl font-medium">
                Not Listed
              </div>
              <button className="w-full btn-outline text-sm py-2">
                View Details
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
