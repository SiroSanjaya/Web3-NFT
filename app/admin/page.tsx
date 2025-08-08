'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  UsersIcon, ShieldCheckIcon, ChartBarIcon, CogIcon, ExclamationTriangleIcon,
  CheckCircleIcon, XCircleIcon, EyeIcon, TrashIcon, BanIcon, StarIcon,
  CurrencyDollarIcon, FireIcon, TrendingUpIcon, UserGroupIcon
} from '@heroicons/react/24/outline'
import { CheckCircleIcon as CheckCircleIconSolid } from '@heroicons/react/24/solid'

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
            <div className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="card text-center"
                >
                  <div className="flex items-center justify-center w-12 h-12 bg-primary-100 dark:bg-primary-900/20 rounded-xl mx-auto mb-4">
                    <UserGroupIcon className="h-6 w-6 text-primary-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {stats.totalUsers.toLocaleString()}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">Total Users</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 }}
                  className="card text-center"
                >
                  <div className="flex items-center justify-center w-12 h-12 bg-secondary-100 dark:bg-secondary-900/20 rounded-xl mx-auto mb-4">
                    <FireIcon className="h-6 w-6 text-secondary-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {stats.totalNFTs.toLocaleString()}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">Total NFTs</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="card text-center"
                >
                  <div className="flex items-center justify-center w-12 h-12 bg-accent-100 dark:bg-accent-900/20 rounded-xl mx-auto mb-4">
                    <CurrencyDollarIcon className="h-6 w-6 text-accent-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {stats.totalVolume.toFixed(2)} ETH
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">Total Volume</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                  className="card text-center"
                >
                  <div className="flex items-center justify-center w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-xl mx-auto mb-4">
                    <TrendingUpIcon className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {stats.weeklyGrowth}%
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">Weekly Growth</p>
                </motion.div>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="card"
                >
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <ExclamationTriangleIcon className="h-5 w-5 mr-2 text-yellow-500" />
                    Pending Actions
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                      <span className="text-sm font-medium">NFT Approvals</span>
                      <span className="text-lg font-bold text-yellow-600">{stats.pendingApprovals}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                      <span className="text-sm font-medium">Reported Items</span>
                      <span className="text-lg font-bold text-red-600">{stats.reportedItems}</span>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="card"
                >
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <ChartBarIcon className="h-5 w-5 mr-2 text-blue-500" />
                    Activity Overview
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <span className="text-sm font-medium">Daily Active Users</span>
                      <span className="text-lg font-bold text-blue-600">{stats.dailyActiveUsers}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <span className="text-sm font-medium">Active Users</span>
                      <span className="text-lg font-bold text-green-600">{stats.activeUsers}</span>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="card">
              <h3 className="text-lg font-semibold mb-6">User Management</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left py-3 px-4 font-medium">User</th>
                      <th className="text-left py-3 px-4 font-medium">Role</th>
                      <th className="text-left py-3 px-4 font-medium">Status</th>
                      <th className="text-left py-3 px-4 font-medium">NFTs</th>
                      <th className="text-left py-3 px-4 font-medium">Sales</th>
                      <th className="text-left py-3 px-4 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id} className="border-b border-gray-100 dark:border-gray-800">
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white font-semibold">
                              {user.name.charAt(0)}
                            </div>
                            <div>
                              <p className="font-medium">{user.name}</p>
                              <p className="text-sm text-gray-500">{user.address.slice(0, 8)}...{user.address.slice(-6)}</p>
                            </div>
                            {user.isVerified && (
                              <StarIcon className="h-4 w-4 text-blue-500" />
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className="capitalize">{user.role}</span>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                            {getStatusIcon(user.status)}
                            <span className="ml-1 capitalize">{user.status}</span>
                          </span>
                        </td>
                        <td className="py-4 px-4">{user.totalNFTs}</td>
                        <td className="py-4 px-4">{user.totalSales} ETH</td>
                        <td className="py-4 px-4">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleUserAction(user.id, user.status === 'active' ? 'suspend' : 'activate')}
                              className={`px-3 py-1 rounded text-xs font-medium ${
                                user.status === 'active'
                                  ? 'bg-red-100 text-red-700 hover:bg-red-200'
                                  : 'bg-green-100 text-green-700 hover:bg-green-200'
                              }`}
                            >
                              {user.status === 'active' ? 'Suspend' : 'Activate'}
                            </button>
                            <button className="px-3 py-1 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded text-xs font-medium">
                              View
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
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
