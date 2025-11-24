'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  ChartBarIcon, ArrowTrendingUpIcon, UsersIcon, CurrencyDollarIcon,
  FireIcon, ExclamationTriangleIcon, CheckCircleIcon, XCircleIcon,
  EyeIcon, ClockIcon, StarIcon, CogIcon
} from '@heroicons/react/24/outline'

interface AnalyticsData {
  totalUsers: number
  activeUsers: number
  totalNFTs: number
  totalVolume: number
  pendingApprovals: number
  reportedItems: number
  dailyActiveUsers: number
  weeklyGrowth: number
  monthlyRevenue: number
  averageTransactionValue: number
  topCategories: Array<{ name: string; volume: number; growth: number }>
  recentTransactions: Array<{
    id: string
    type: 'sale' | 'mint' | 'transfer'
    amount: number
    user: string
    timestamp: string
    status: 'completed' | 'pending' | 'failed'
  }>
  userGrowth: Array<{ date: string; users: number }>
  volumeData: Array<{ date: string; volume: number }>
}

export default function AdminAnalytics() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    totalUsers: 12543,
    activeUsers: 8921,
    totalNFTs: 45678,
    totalVolume: 2345.67,
    pendingApprovals: 23,
    reportedItems: 12,
    dailyActiveUsers: 1234,
    weeklyGrowth: 15.5,
    monthlyRevenue: 156.78,
    averageTransactionValue: 0.045,
    topCategories: [
      { name: 'Art', volume: 450.2, growth: 12.5 },
      { name: 'Gaming', volume: 380.8, growth: 25.3 },
      { name: 'Music', volume: 220.1, growth: 8.7 },
      { name: 'Sports', volume: 180.5, growth: -2.1 }
    ],
    recentTransactions: [
      {
        id: '1',
        type: 'sale',
        amount: 0.25,
        user: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
        timestamp: '2024-01-15T10:30:00Z',
        status: 'completed'
      },
      {
        id: '2',
        type: 'mint',
        amount: 0.05,
        user: '0xBuyerAddressHere',
        timestamp: '2024-01-15T09:15:00Z',
        status: 'completed'
      },
      {
        id: '3',
        type: 'transfer',
        amount: 0.15,
        user: '0xCreatorAddressHere',
        timestamp: '2024-01-15T08:45:00Z',
        status: 'pending'
      }
    ],
    userGrowth: [
      { date: '2024-01-01', users: 12000 },
      { date: '2024-01-08', users: 12200 },
      { date: '2024-01-15', users: 12543 }
    ],
    volumeData: [
      { date: '2024-01-01', volume: 2000 },
      { date: '2024-01-08', volume: 2200 },
      { date: '2024-01-15', volume: 2345 }
    ]
  })

  const [selectedTimeframe, setSelectedTimeframe] = useState('7d')
  const [isLoading, setIsLoading] = useState(false)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-100'
      case 'pending':
        return 'text-yellow-600 bg-yellow-100'
      case 'failed':
        return 'text-red-600 bg-red-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon className="h-4 w-4" />
      case 'pending':
        return <ClockIcon className="h-4 w-4" />
      case 'failed':
        return <XCircleIcon className="h-4 w-4" />
      default:
        return <EyeIcon className="h-4 w-4" />
    }
  }

  const getTransactionTypeColor = (type: string) => {
    switch (type) {
      case 'sale':
        return 'text-blue-600 bg-blue-100'
      case 'mint':
        return 'text-green-600 bg-green-100'
      case 'transfer':
        return 'text-purple-600 bg-purple-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <div className="card text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-primary-100 dark:bg-primary-900/20 rounded-xl mx-auto mb-4">
            <UsersIcon className="h-6 w-6 text-primary-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {analyticsData.totalUsers.toLocaleString()}
          </h3>
          <p className="text-gray-600 dark:text-gray-400">Total Users</p>
          <p className="text-sm text-green-600 mt-1">+{analyticsData.weeklyGrowth}% this week</p>
        </div>

        <div className="card text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-secondary-100 dark:bg-secondary-900/20 rounded-xl mx-auto mb-4">
            <FireIcon className="h-6 w-6 text-secondary-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {analyticsData.totalNFTs.toLocaleString()}
          </h3>
          <p className="text-gray-600 dark:text-gray-400">Total NFTs</p>
          <p className="text-sm text-blue-600 mt-1">{analyticsData.dailyActiveUsers} active today</p>
        </div>

        <div className="card text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-accent-100 dark:bg-accent-900/20 rounded-xl mx-auto mb-4">
            <CurrencyDollarIcon className="h-6 w-6 text-accent-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {analyticsData.totalVolume.toFixed(2)} ETH
          </h3>
          <p className="text-gray-600 dark:text-gray-400">Total Volume</p>
          <p className="text-sm text-purple-600 mt-1">Avg: {analyticsData.averageTransactionValue} ETH</p>
        </div>

        <div className="card text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-xl mx-auto mb-4">
            <ArrowTrendingUpIcon className="h-6 w-6 text-green-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {analyticsData.monthlyRevenue.toFixed(2)} ETH
          </h3>
          <p className="text-gray-600 dark:text-gray-400">Monthly Revenue</p>
          <p className="text-sm text-green-600 mt-1">+8.5% vs last month</p>
        </div>
      </motion.div>

      {/* Timeframe Selector */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center"
      >
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Analytics Overview</h2>
        <div className="flex bg-white dark:bg-slate-800 rounded-lg p-1">
          {['1d', '7d', '30d', '90d'].map((timeframe) => (
            <button
              key={timeframe}
              onClick={() => setSelectedTimeframe(timeframe)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                selectedTimeframe === timeframe
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-600 dark:text-gray-300 hover:text-primary-600'
              }`}
            >
              {timeframe}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Charts and Data */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Growth Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="card"
        >
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <ChartBarIcon className="h-5 w-5 mr-2 text-blue-500" />
            User Growth
          </h3>
          <div className="h-64 flex items-end justify-between space-x-2">
            {analyticsData.userGrowth.map((data, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div
                  className="w-full bg-gradient-to-t from-blue-500 to-blue-300 rounded-t"
                  style={{
                    height: `${(data.users / Math.max(...analyticsData.userGrowth.map(d => d.users))) * 200}px`
                  }}
                />
                <p className="text-xs text-gray-500 mt-2">{data.date}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Volume Chart */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="card"
        >
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <ArrowTrendingUpIcon className="h-5 w-5 mr-2 text-green-500" />
            Trading Volume
          </h3>
          <div className="h-64 flex items-end justify-between space-x-2">
            {analyticsData.volumeData.map((data, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div
                  className="w-full bg-gradient-to-t from-green-500 to-green-300 rounded-t"
                  style={{
                    height: `${(data.volume / Math.max(...analyticsData.volumeData.map(d => d.volume))) * 200}px`
                  }}
                />
                <p className="text-xs text-gray-500 mt-2">{data.date}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Top Categories */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card"
      >
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <StarIcon className="h-5 w-5 mr-2 text-yellow-500" />
          Top Categories by Volume
        </h3>
        <div className="space-y-4">
          {analyticsData.topCategories.map((category, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center text-white font-bold">
                  {index + 1}
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">{category.name}</h4>
                  <p className="text-sm text-gray-500">{category.volume.toFixed(1)} ETH volume</p>
                </div>
              </div>
              <div className="text-right">
                <span className={`text-sm font-bold ${category.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {category.growth >= 0 ? '+' : ''}{category.growth}%
                </span>
                <p className="text-xs text-gray-500">Growth</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Recent Transactions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card"
      >
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <ClockIcon className="h-5 w-5 mr-2 text-purple-500" />
          Recent Transactions
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 font-medium">Type</th>
                <th className="text-left py-3 px-4 font-medium">Amount</th>
                <th className="text-left py-3 px-4 font-medium">User</th>
                <th className="text-left py-3 px-4 font-medium">Time</th>
                <th className="text-left py-3 px-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {analyticsData.recentTransactions.map((transaction) => (
                <tr key={transaction.id} className="border-b border-gray-100 dark:border-gray-800">
                  <td className="py-4 px-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getTransactionTypeColor(transaction.type)}`}>
                      {transaction.type}
                    </span>
                  </td>
                  <td className="py-4 px-4 font-medium">{transaction.amount} ETH</td>
                  <td className="py-4 px-4 text-sm text-gray-500">{formatAddress(transaction.user)}</td>
                  <td className="py-4 px-4 text-sm text-gray-500">{formatDate(transaction.timestamp)}</td>
                  <td className="py-4 px-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
                      {getStatusIcon(transaction.status)}
                      <span className="ml-1 capitalize">{transaction.status}</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <div className="card">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <ExclamationTriangleIcon className="h-5 w-5 mr-2 text-yellow-500" />
            Pending Actions
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <span className="text-sm font-medium">NFT Approvals</span>
              <span className="text-lg font-bold text-yellow-600">{analyticsData.pendingApprovals}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <span className="text-sm font-medium">Reported Items</span>
              <span className="text-lg font-bold text-red-600">{analyticsData.reportedItems}</span>
            </div>
          </div>
          <button className="btn-primary w-full mt-4">Review All</button>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <CogIcon className="h-5 w-5 mr-2 text-gray-500" />
            Quick Actions
          </h3>
          <div className="space-y-3">
            <button className="w-full p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-left hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
              <div className="font-medium text-blue-800 dark:text-blue-200">Update Platform Fee</div>
              <div className="text-sm text-blue-600 dark:text-blue-300">Modify marketplace settings</div>
            </button>
            <button className="w-full p-3 bg-green-50 dark:bg-green-900/20 rounded-lg text-left hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors">
              <div className="font-medium text-green-800 dark:text-green-200">Generate Report</div>
              <div className="text-sm text-green-600 dark:text-green-300">Export analytics data</div>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
