'use client'

import { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { 
  UserIcon,
  PhotoIcon,
  ChartBarIcon,
  ClockIcon,
  HeartIcon,
  ShareIcon,
  PencilIcon,
  CheckBadgeIcon,
  FireIcon,
  EyeIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  MapPinIcon,
  LinkIcon,
  CameraIcon
} from '@heroicons/react/24/outline'
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid'
import NFTCard from '@/components/NFTCard'
import { NFTCardSkeleton } from '@/components/SkeletonLoader'

interface UserProfile {
  address: string
  name?: string
  bio?: string
  avatar?: string
  banner?: string
  website?: string
  twitter?: string
  instagram?: string
  discord?: string
  location?: string
  joinedDate: Date
  verified: boolean
  followers: number
  following: number
  totalVolume: number
  totalSales: number
  floorPrice: number
}

interface Activity {
  id: string
  type: 'mint' | 'buy' | 'sell' | 'transfer' | 'list' | 'offer'
  nft: {
    tokenId: string
    name: string
    image: string
    collection: string
  }
  price?: string
  from?: string
  to?: string
  timestamp: Date
  txHash: string
}

export default function ProfilePage({ params }: { params: { address: string } }) {
  const { address: connectedAddress, isConnected } = useAccount()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [ownedNFTs, setOwnedNFTs] = useState<any[]>([])
  const [createdNFTs, setCreatedNFTs] = useState<any[]>([])
  const [likedNFTs, setLikedNFTs] = useState<any[]>([])
  const [activities, setActivities] = useState<Activity[]>([])
  const [activeTab, setActiveTab] = useState('owned')
  const [loading, setLoading] = useState(true)
  const [isFollowing, setIsFollowing] = useState(false)
  const [isEditing, setIsEditing] = useState(false)

  const isOwnProfile = connectedAddress?.toLowerCase() === params.address.toLowerCase()

  // Mock profile data
  const mockProfile: UserProfile = {
    address: params.address,
    name: isOwnProfile ? 'Your Awesome Profile' : 'NFT Collector Pro',
    bio: isOwnProfile 
      ? 'Welcome to your profile! Start collecting and creating amazing NFTs.' 
      : 'Digital art enthusiast and NFT collector. Passionate about supporting emerging artists in the Web3 space.',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=center&q=80',
    banner: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&h=300&fit=crop&crop=center&q=80',
    website: 'https://nexusverse.art',
    twitter: '@nexusverse',
    location: 'Metaverse',
    joinedDate: new Date('2023-01-15'),
    verified: Math.random() > 0.5,
    followers: Math.floor(Math.random() * 10000) + 100,
    following: Math.floor(Math.random() * 1000) + 50,
    totalVolume: parseFloat((Math.random() * 500 + 50).toFixed(2)),
    totalSales: Math.floor(Math.random() * 100) + 10,
    floorPrice: parseFloat((Math.random() * 2 + 0.1).toFixed(3))
  }

  // Mock NFTs
  const mockNFTs = [
    {
      tokenId: '1',
      name: 'Cosmic Explorer #1',
      description: 'A unique digital artwork exploring the cosmos',
      image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=400&fit=crop&crop=center&q=80',
      price: '0.05',
      seller: params.address,
      owner: params.address,
      sold: false,
      isListed: true,
      category: 'Art',
      collection: 'Cosmic Series',
      likes: 127,
      views: 892,
      trending: true,
      rarity: 'Rare'
    },
    {
      tokenId: '2',
      name: 'Digital Dreams #2',
      description: 'Abstract digital art representing dreams',
      image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=400&fit=crop&crop=center&q=80',
      price: '0.1',
      seller: params.address,
      owner: params.address,
      sold: false,
      isListed: true,
      category: 'Abstract',
      collection: 'Dream Series',
      likes: 89,
      views: 456,
      trending: false,
      rarity: 'Common'
    }
  ]

  // Mock activities
  const mockActivities: Activity[] = [
    {
      id: '1',
      type: 'buy',
      nft: {
        tokenId: '1',
        name: 'Cosmic Explorer #1',
        image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&h=100&fit=crop&crop=center&q=80',
        collection: 'Cosmic Series'
      },
      price: '0.05',
      from: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
      to: params.address,
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      txHash: '0x1234567890abcdef1234567890abcdef12345678'
    },
    {
      id: '2',
      type: 'mint',
      nft: {
        tokenId: '2',
        name: 'Digital Dreams #2',
        image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=100&h=100&fit=crop&crop=center&q=80',
        collection: 'Dream Series'
      },
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      txHash: '0xabcdef1234567890abcdef1234567890abcdef12'
    }
  ]

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setProfile(mockProfile)
      setOwnedNFTs(mockNFTs)
      setCreatedNFTs(mockNFTs.slice(0, 1))
      setLikedNFTs(mockNFTs.slice(1, 2))
      setActivities(mockActivities)
      setLoading(false)
    }, 1500)
  }, [params.address])

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    })
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'buy': return <CurrencyDollarIcon className="h-4 w-4 text-green-500" />
      case 'sell': return <CurrencyDollarIcon className="h-4 w-4 text-blue-500" />
      case 'mint': return <PhotoIcon className="h-4 w-4 text-purple-500" />
      case 'transfer': return <ShareIcon className="h-4 w-4 text-gray-500" />
      case 'list': return <ChartBarIcon className="h-4 w-4 text-orange-500" />
      default: return <ClockIcon className="h-4 w-4 text-gray-500" />
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-blue-900">
        <div className="h-64 bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-1/3 space-y-6">
              <div className="card animate-pulse">
                <div className="w-32 h-32 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-4"></div>
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mx-auto"></div>
              </div>
            </div>
            <div className="lg:w-2/3">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <NFTCardSkeleton key={i} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Profile Not Found</h1>
          <p className="text-gray-600 dark:text-gray-400">The requested profile could not be found.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-blue-900">
      {/* Banner */}
      <div className="relative h-64 lg:h-80">
        <Image
          src={profile.banner || '/default-banner.jpg'}
          alt="Profile Banner"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
        
        {/* Edit Banner Button */}
        {isOwnProfile && (
          <button className="absolute top-4 right-4 p-2 bg-black/50 backdrop-blur-sm rounded-full text-white hover:bg-black/70 transition-colors">
            <CameraIcon className="h-5 w-5" />
          </button>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="relative -mt-20 lg:-mt-24">
          <div className="flex flex-col lg:flex-row items-start lg:items-end gap-6">
            {/* Avatar */}
            <div className="relative">
              <div className="w-32 h-32 lg:w-40 lg:h-40 rounded-full border-4 border-white dark:border-gray-800 overflow-hidden bg-white dark:bg-gray-800">
                <Image
                  src={profile.avatar || '/default-avatar.jpg'}
                  alt="Profile Avatar"
                  fill
                  className="object-cover"
                />
              </div>
              {profile.verified && (
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <CheckBadgeIcon className="h-5 w-5 text-white" />
                </div>
              )}
              {isOwnProfile && (
                <button className="absolute bottom-2 right-2 p-2 bg-black/50 backdrop-blur-sm rounded-full text-white hover:bg-black/70 transition-colors">
                  <CameraIcon className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-gray-700/50">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
                        {profile.name || formatAddress(profile.address)}
                      </h1>
                      {profile.verified && (
                        <CheckBadgeIcon className="h-6 w-6 text-blue-500" />
                      )}
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 mb-3">
                      {profile.bio || 'No bio available'}
                    </p>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <CalendarIcon className="h-4 w-4" />
                        Joined {formatDate(profile.joinedDate)}
                      </div>
                      {profile.location && (
                        <div className="flex items-center gap-1">
                          <MapPinIcon className="h-4 w-4" />
                          {profile.location}
                        </div>
                      )}
                      {profile.website && (
                        <a href={profile.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-primary-600">
                          <LinkIcon className="h-4 w-4" />
                          Website
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-3">
                    {isOwnProfile ? (
                      <button 
                        onClick={() => setIsEditing(true)}
                        className="btn-outline flex items-center"
                      >
                        <PencilIcon className="h-4 w-4 mr-2" />
                        Edit Profile
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={() => setIsFollowing(!isFollowing)}
                          className={`px-6 py-2 rounded-xl font-semibold transition-all ${
                            isFollowing 
                              ? 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300' 
                              : 'btn-primary'
                          }`}
                        >
                          {isFollowing ? 'Following' : 'Follow'}
                        </button>
                        <button className="btn-outline">
                          <ShareIcon className="h-4 w-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 my-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card text-center"
          >
            <div className="text-2xl font-bold text-primary-600 mb-1">{profile.followers.toLocaleString()}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Followers</div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card text-center"
          >
            <div className="text-2xl font-bold text-secondary-600 mb-1">{profile.following.toLocaleString()}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Following</div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card text-center"
          >
            <div className="text-2xl font-bold text-green-600 mb-1">{profile.totalVolume.toFixed(2)}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Volume (ETH)</div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="card text-center"
          >
            <div className="text-2xl font-bold text-purple-600 mb-1">{profile.totalSales}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Sales</div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="card text-center"
          >
            <div className="text-2xl font-bold text-orange-600 mb-1">{profile.floorPrice}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Floor Price</div>
          </motion.div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700 mb-8">
          <nav className="flex space-x-8">
            {[
              { id: 'owned', label: 'Owned', count: ownedNFTs.length },
              { id: 'created', label: 'Created', count: createdNFTs.length },
              { id: 'liked', label: 'Liked', count: likedNFTs.length },
              { id: 'activity', label: 'Activity', count: activities.length }
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
                {tab.label} ({tab.count})
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="pb-12">
          {activeTab === 'owned' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {ownedNFTs.map((nft, index) => (
                <motion.div
                  key={nft.tokenId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <NFTCard nft={nft} />
                </motion.div>
              ))}
            </div>
          )}

          {activeTab === 'created' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {createdNFTs.map((nft, index) => (
                <motion.div
                  key={nft.tokenId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <NFTCard nft={nft} />
                </motion.div>
              ))}
            </div>
          )}

          {activeTab === 'liked' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {likedNFTs.map((nft, index) => (
                <motion.div
                  key={nft.tokenId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <NFTCard nft={nft} />
                </motion.div>
              ))}
            </div>
          )}

          {activeTab === 'activity' && (
            <div className="space-y-4">
              {activities.map((activity, index) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="card flex items-center space-x-4 hover:shadow-lg transition-shadow"
                >
                  <div className="flex-shrink-0">
                    <Image
                      src={activity.nft.image}
                      alt={activity.nft.name}
                      width={60}
                      height={60}
                      className="rounded-lg object-cover"
                    />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      {getActivityIcon(activity.type)}
                      <span className="font-semibold text-gray-900 dark:text-white capitalize">
                        {activity.type}
                      </span>
                      <span className="text-gray-600 dark:text-gray-400">
                        {activity.nft.name}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {activity.price && (
                          <span className="font-medium text-green-600">
                            {activity.price} ETH
                          </span>
                        )}
                        {activity.from && activity.to && (
                          <span className="ml-2">
                            from {formatAddress(activity.from)} to {formatAddress(activity.to)}
                          </span>
                        )}
                      </div>
                      
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(activity.timestamp)}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
