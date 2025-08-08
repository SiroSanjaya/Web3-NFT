'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  ShoppingCartIcon,
  FireIcon,
  EyeIcon,
  ClockIcon,
  CalendarIcon,
  FunnelIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  SparklesIcon,
  BoltIcon,
  GlobeAltIcon,
  CpuChipIcon
} from '@heroicons/react/24/outline'

interface AnalyticsData {
  totalVolume: number
  totalSales: number
  totalUsers: number
  avgPrice: number
  topCollections: Array<{
    name: string
    volume: number
    sales: number
    floorPrice: number
    change: number
  }>
  priceChart: Array<{
    date: string
    volume: number
    avgPrice: number
  }>
  categoryDistribution: Array<{
    category: string
    percentage: number
    count: number
  }>
  recentActivity: Array<{
    type: string
    nft: string
    price: string
    time: string
  }>
}

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [timeRange, setTimeRange] = useState('7d')
  const [loading, setLoading] = useState(true)
  const [realTimeData, setRealTimeData] = useState({
    activeUsers: 0,
    currentVolume: 0,
    recentTransactions: 0
  })
  const [predictiveData, setPredictiveData] = useState({
    nextWeekVolume: 0,
    growthPrediction: 0,
    trendingCollections: []
  })
  const [showAdvancedMetrics, setShowAdvancedMetrics] = useState(false)

  // Mock analytics data
  const mockAnalytics: AnalyticsData = {
    totalVolume: 1234.56,
    totalSales: 5678,
    totalUsers: 12345,
    avgPrice: 0.45,
    topCollections: [
      { name: 'Cosmic Series', volume: 456.78, sales: 234, floorPrice: 0.05, change: 12.5 },
      { name: 'Dream Series', volume: 234.56, sales: 156, floorPrice: 0.08, change: -5.2 },
      { name: 'Neon Series', volume: 123.45, sales: 89, floorPrice: 0.12, change: 8.7 },
      { name: 'Harmony Series', volume: 89.12, sales: 67, floorPrice: 0.09, change: 15.3 },
      { name: 'Retro Series', volume: 67.89, sales: 45, floorPrice: 0.15, change: -2.1 }
    ],
    priceChart: [
      { date: '2024-01-01', volume: 100, avgPrice: 0.35 },
      { date: '2024-01-02', volume: 120, avgPrice: 0.38 },
      { date: '2024-01-03', volume: 95, avgPrice: 0.42 },
      { date: '2024-01-04', volume: 150, avgPrice: 0.45 },
      { date: '2024-01-05', volume: 180, avgPrice: 0.48 },
      { date: '2024-01-06', volume: 200, avgPrice: 0.44 },
      { date: '2024-01-07', volume: 175, avgPrice: 0.45 }
    ],
    categoryDistribution: [
      { category: 'Art', percentage: 35, count: 1750 },
      { category: 'Gaming', percentage: 25, count: 1250 },
      { category: 'Music', percentage: 15, count: 750 },
      { category: 'Sports', percentage: 12, count: 600 },
      { category: 'Photography', percentage: 8, count: 400 },
      { category: 'Other', percentage: 5, count: 250 }
    ],
    recentActivity: [
      { type: 'Sale', nft: 'Cosmic Explorer #1', price: '0.05 ETH', time: '2 min ago' },
      { type: 'Mint', nft: 'Dream Walker #45', price: '0.08 ETH', time: '5 min ago' },
      { type: 'Sale', nft: 'Neon City #12', price: '0.12 ETH', time: '8 min ago' },
      { type: 'List', nft: 'Harmony #78', price: '0.09 ETH', time: '12 min ago' },
      { type: 'Sale', nft: 'Retro Game #34', price: '0.15 ETH', time: '15 min ago' }
    ]
  }

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setAnalytics(mockAnalytics)
      setLoading(false)
    }, 1500)
  }, [timeRange])

  const StatCard = ({ icon: Icon, title, value, change, prefix = '', suffix = '' }: any) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card hover:shadow-2xl transition-all duration-300"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {prefix}{typeof value === 'number' ? value.toLocaleString() : value}{suffix}
          </p>
          {change && (
            <div className={`flex items-center mt-2 text-sm ${
              change > 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {change > 0 ? (
                <ArrowUpIcon className="h-4 w-4 mr-1" />
              ) : (
                <ArrowDownIcon className="h-4 w-4 mr-1" />
              )}
              {Math.abs(change)}% vs last {timeRange}
            </div>
          )}
        </div>
        <div className="p-3 bg-gradient-to-r from-primary-100 to-secondary-100 dark:from-primary-900/30 dark:to-secondary-900/30 rounded-full">
          <Icon className="h-6 w-6 text-primary-600 dark:text-primary-400" />
        </div>
      </div>
    </motion.div>
  )

  const SimpleChart = ({ data, title }: { data: any[], title: string }) => (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{title}</h3>
      <div className="space-y-3">
        {data.map((item, index) => (
          <div key={index} className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">{item.date}</span>
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {item.volume} ETH
              </span>
              <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-primary-500 to-secondary-500 h-2 rounded-full"
                  style={{ width: `${(item.volume / Math.max(...data.map(d => d.volume))) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-blue-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="card animate-pulse">
                <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="card animate-pulse">
                <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!analytics) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-blue-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Analytics Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Track marketplace performance and insights
            </p>
          </div>
          
          <div className="flex items-center space-x-4 mt-4 lg:mt-0">
            <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
              {['24h', '7d', '30d', '1y'].map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                    timeRange === range
                      ? 'bg-white dark:bg-gray-600 text-primary-600 shadow-sm'
                      : 'text-gray-600 dark:text-gray-300 hover:text-primary-600'
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={CurrencyDollarIcon}
            title="Total Volume"
            value={analytics.totalVolume}
            change={12.5}
            suffix=" ETH"
          />
          <StatCard
            icon={ShoppingCartIcon}
            title="Total Sales"
            value={analytics.totalSales}
            change={8.3}
          />
          <StatCard
            icon={UserGroupIcon}
            title="Total Users"
            value={analytics.totalUsers}
            change={15.7}
          />
          <StatCard
            icon={ArrowTrendingUpIcon}
            title="Average Price"
            value={analytics.avgPrice}
            change={-2.1}
            suffix=" ETH"
          />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Volume Chart */}
          <SimpleChart data={analytics.priceChart} title="Volume Trend" />

          {/* Category Distribution */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Category Distribution
            </h3>
            <div className="space-y-4">
              {analytics.categoryDistribution.map((category, index) => (
                <div key={category.category} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ 
                        backgroundColor: `hsl(${index * 60}, 70%, 50%)` 
                      }}
                    ></div>
                    <span className="text-gray-900 dark:text-white font-medium">
                      {category.category}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-gray-900 dark:text-white font-medium">
                      {category.percentage}%
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {category.count} items
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Collections & Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top Collections */}
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Top Collections
              </h3>
              <FireIcon className="h-5 w-5 text-orange-500" />
            </div>
            <div className="space-y-4">
              {analytics.topCollections.map((collection, index) => (
                <motion.div
                  key={collection.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full text-white font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {collection.name}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {collection.sales} sales
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {collection.volume} ETH
                    </div>
                    <div className={`text-sm flex items-center ${
                      collection.change > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {collection.change > 0 ? (
                        <ArrowTrendingUpIcon className="h-3 w-3 mr-1" />
                      ) : (
                        <ArrowTrendingDownIcon className="h-3 w-3 mr-1" />
                      )}
                      {Math.abs(collection.change)}%
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Recent Activity
              </h3>
              <EyeIcon className="h-5 w-5 text-blue-500" />
            </div>
            <div className="space-y-4">
              {analytics.recentActivity.map((activity, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                      activity.type === 'Sale' ? 'bg-green-100 text-green-600 dark:bg-green-900/30' :
                      activity.type === 'Mint' ? 'bg-purple-100 text-purple-600 dark:bg-purple-900/30' :
                      'bg-blue-100 text-blue-600 dark:bg-blue-900/30'
                    }`}>
                      {activity.type[0]}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white text-sm">
                        {activity.type}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {activity.nft}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-gray-900 dark:text-white text-sm">
                      {activity.price}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {activity.time}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Advanced Analytics Toggle */}
        <div className="mt-8 text-center">
          <button
            onClick={() => setShowAdvancedMetrics(!showAdvancedMetrics)}
            className="btn-outline flex items-center mx-auto"
          >
            <CpuChipIcon className="h-4 w-4 mr-2" />
            {showAdvancedMetrics ? 'Hide' : 'Show'} Advanced Analytics
          </button>
        </div>

        {/* Advanced Analytics */}
        {showAdvancedMetrics && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 space-y-8"
          >
            {/* Real-time Data */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="card text-center"
              >
                <BoltIcon className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Real-time Users
                </h4>
                <p className="text-3xl font-bold text-yellow-600 mb-2">847</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Currently online
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="card text-center"
              >
                <SparklesIcon className="h-12 w-12 text-purple-500 mx-auto mb-4" />
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Live Volume
                </h4>
                <p className="text-3xl font-bold text-purple-600 mb-2">45.2 ETH</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Last 24 hours
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="card text-center"
              >
                <GlobeAltIcon className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Global Reach
                </h4>
                <p className="text-3xl font-bold text-green-600 mb-2">127</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Countries active
                </p>
              </motion.div>
            </div>

            {/* Predictive Analytics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card"
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <SparklesIcon className="h-5 w-5 mr-2 text-purple-500" />
                  Predictive Analytics
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg">
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">Next Week Volume</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">AI Prediction</div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-purple-600">1,456 ETH</div>
                      <div className="text-sm text-green-600">+18.2%</div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg">
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">Growth Prediction</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">30-day forecast</div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-600">+32.5%</div>
                      <div className="text-sm text-gray-600">Confidence: 87%</div>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="card"
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <FireIcon className="h-5 w-5 mr-2 text-orange-500" />
                  Trending Collections
                </h3>
                <div className="space-y-3">
                  {['Cosmic Series', 'Dream Series', 'Neon Series'].map((collection, index) => (
                    <div key={collection} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                          {index + 1}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">{collection}</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">Trending</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-green-600">+{Math.floor(Math.random() * 50) + 20}%</div>
                        <div className="text-xs text-gray-500">Volume growth</div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* Additional Insights */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card text-center"
          >
            <ArrowTrendingUpIcon className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Market Growth
            </h4>
            <p className="text-3xl font-bold text-green-600 mb-2">+24.5%</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Volume increase this month
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card text-center"
          >
            <UserGroupIcon className="h-12 w-12 text-blue-500 mx-auto mb-4" />
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Active Traders
            </h4>
            <p className="text-3xl font-bold text-blue-600 mb-2">2,847</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Active in the last 7 days
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card text-center"
          >
            <FireIcon className="h-12 w-12 text-orange-500 mx-auto mb-4" />
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Trending Score
            </h4>
            <p className="text-3xl font-bold text-orange-600 mb-2">8.9/10</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Platform popularity index
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
