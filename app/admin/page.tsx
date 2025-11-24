'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  UsersIcon, ShieldCheckIcon, ChartBarIcon, CogIcon, ExclamationTriangleIcon,
  CheckCircleIcon, XCircleIcon, EyeIcon, TrashIcon, NoSymbolIcon, StarIcon,
  CurrencyDollarIcon, FireIcon, ArrowTrendingUpIcon, UserGroupIcon
} from '@heroicons/react/24/outline'
import { CheckCircleIcon as CheckCircleIconSolid } from '@heroicons/react/24/solid'
import toast from 'react-hot-toast'
import AdminAnalytics from '@/components/AdminAnalytics'
import AdminUserManagement from '@/components/AdminUserManagement'

// Mock data for admin dashboard
const mockUsers = [
  {
    id: '1',
    address: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
    name: 'CryptoCreator',
    email: 'creator@nexusverse.io',
    status: 'active',
    role: 'creator',
    joinedDate: '2024-01-15',
    totalNFTs: 45,
    totalSales: 12.5,
    isVerified: true
  },
  {
    id: '2',
    address: '0xBuyerAddressHere',
    name: 'NFTCollector',
    email: 'collector@nexusverse.io',
    status: 'active',
    role: 'buyer',
    joinedDate: '2024-02-20',
    totalNFTs: 23,
    totalSales: 0,
    isVerified: false
  },
  {
    id: '3',
    address: '0xSuspendedUser',
    name: 'SuspiciousUser',
    email: 'suspicious@nexusverse.io',
    status: 'suspended',
    role: 'buyer',
    joinedDate: '2024-03-10',
    totalNFTs: 5,
    totalSales: 0,
    isVerified: false
  }
]

const mockNFTs = [
  {
    id: '1',
    name: 'Cosmic Explorer #1',
    creator: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
    price: '0.05',
    status: 'approved',
    reportedCount: 0,
    createdAt: '2024-05-20',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&h=100&fit=crop&crop=center&q=80'
  },
  {
    id: '2',
    name: 'Digital Dreams #2',
    creator: '0xCreatorAddressHere',
    price: '0.25',
    status: 'pending',
    reportedCount: 2,
    createdAt: '2024-05-21',
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=100&h=100&fit=crop&crop=center&q=80'
  },
  {
    id: '3',
    name: 'Neon City #3',
    creator: '0xArtistAddressHere',
    price: '0.15',
    status: 'rejected',
    reportedCount: 5,
    createdAt: '2024-05-22',
    image: 'https://images.unsplash.com/photo-1507003211169-e695c5b0c85a?w=100&h=100&fit=crop&crop=center&q=80'
  }
]

const mockStats = {
  totalUsers: 12543,
  activeUsers: 8921,
  totalNFTs: 45678,
  totalVolume: 2345.67,
  pendingApprovals: 23,
  reportedItems: 12,
  dailyActiveUsers: 1234,
  weeklyGrowth: 15.5
}

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('overview')
  const [users, setUsers] = useState(mockUsers)
  const [nfts, setNfts] = useState(mockNFTs)
  const [stats, setStats] = useState(mockStats)
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [selectedNFT, setSelectedNFT] = useState<any>(null)

  const handleUserAction = (userId: string, action: string) => {
    setUsers(prevUsers => 
      prevUsers.map(user => 
        user.id === userId 
          ? { ...user, status: action === 'suspend' ? 'suspended' : 'active' }
          : user
      )
    )
    toast.success(`User ${action === 'suspend' ? 'suspended' : 'activated'} successfully`)
  }

  const handleNFTApproval = (nftId: string, action: 'approve' | 'reject') => {
    setNfts(prevNFTs => 
      prevNFTs.map(nft => 
        nft.id === nftId 
          ? { ...nft, status: action === 'approve' ? 'approved' : 'rejected' }
          : nft
      )
    )
    toast.success(`NFT ${action === 'approve' ? 'approved' : 'rejected'} successfully`)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
      case 'approved':
        return 'text-green-600 bg-green-100 dark:bg-green-900/20'
      case 'pending':
        return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20'
      case 'suspended':
      case 'rejected':
        return 'text-red-600 bg-red-100 dark:bg-red-900/20'
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
      case 'approved':
        return <CheckCircleIcon className="h-4 w-4" />
      case 'pending':
        return <ExclamationTriangleIcon className="h-4 w-4" />
      case 'suspended':
      case 'rejected':
        return <XCircleIcon className="h-4 w-4" />
      default:
        return <EyeIcon className="h-4 w-4" />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-blue-900 py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gradient mb-4">Admin Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            Manage your marketplace, users, and content
          </p>
        </motion.div>

        {/* Navigation Tabs */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center mb-8"
        >
          <div className="flex bg-white dark:bg-slate-800 rounded-xl p-1 shadow-lg">
            {[
              { id: 'overview', name: 'Overview', icon: ChartBarIcon },
              { id: 'users', name: 'Users', icon: UsersIcon },
              { id: 'nfts', name: 'NFTs', icon: ShieldCheckIcon },
              { id: 'settings', name: 'Settings', icon: CogIcon }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-primary-600 to-secondary-600 text-white shadow-lg'
                    : 'text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400'
                }`}
              >
                <tab.icon className="h-5 w-5" />
                <span>{tab.name}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {activeTab === 'overview' && (
            <AdminAnalytics />
          )}

          {activeTab === 'users' && (
            <AdminUserManagement />
          )}

          {activeTab === 'nfts' && (
            <div className="card">
              <h3 className="text-lg font-semibold mb-6">NFT Moderation</h3>
              <div className="space-y-4">
                {nfts.map((nft) => (
                  <motion.div
                    key={nft.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-slate-700 rounded-xl"
                  >
                    <img
                      src={nft.image}
                      alt={nft.name}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium">{nft.name}</h4>
                      <p className="text-sm text-gray-500">Creator: {nft.creator.slice(0, 8)}...{nft.creator.slice(-6)}</p>
                      <p className="text-sm text-gray-500">Price: {nft.price} ETH</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(nft.status)}`}>
                        {getStatusIcon(nft.status)}
                        <span className="ml-1 capitalize">{nft.status}</span>
                      </span>
                      {nft.reportedCount > 0 && (
                        <span className="text-xs text-red-600 bg-red-100 px-2 py-1 rounded">
                          {nft.reportedCount} reports
                        </span>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      {nft.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleNFTApproval(nft.id, 'approve')}
                            className="px-3 py-1 bg-green-100 text-green-700 hover:bg-green-200 rounded text-xs font-medium"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleNFTApproval(nft.id, 'reject')}
                            className="px-3 py-1 bg-red-100 text-red-700 hover:bg-red-200 rounded text-xs font-medium"
                          >
                            Reject
                          </button>
                        </>
                      )}
                      <button className="px-3 py-1 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded text-xs font-medium">
                        View
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card"
              >
                <h3 className="text-lg font-semibold mb-4">Marketplace Settings</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Platform Fee (%)</label>
                    <input
                      type="number"
                      defaultValue="2.5"
                      className="input-field w-full max-w-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Minimum NFT Price (ETH)</label>
                    <input
                      type="number"
                      defaultValue="0.01"
                      step="0.001"
                      className="input-field w-full max-w-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Auto-approve NFTs</label>
                    <input
                      type="checkbox"
                      defaultChecked
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-600">Enable automatic NFT approval</span>
                  </div>
                </div>
                <button className="btn-primary mt-4">Save Settings</button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="card"
              >
                <h3 className="text-lg font-semibold mb-4">Security Settings</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Two-Factor Authentication</label>
                    <button className="btn-outline">Enable 2FA</button>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Session Timeout (minutes)</label>
                    <input
                      type="number"
                      defaultValue="30"
                      className="input-field w-full max-w-xs"
                    />
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

