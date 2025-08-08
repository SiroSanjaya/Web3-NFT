'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  SparklesIcon, TrendingUpIcon, ChartBarIcon, LightBulbIcon,
  MagnifyingGlassIcon, FireIcon, StarIcon, CurrencyDollarIcon,
  ClockIcon, UserIcon, TagIcon, EyeIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

// Mock AI data
const mockRecommendations = [
  {
    id: '1',
    name: 'Cosmic Explorer #1',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&h=200&fit=crop&crop=center&q=80',
    currentPrice: '0.05',
    predictedPrice: '0.08',
    confidence: 85,
    reason: 'High demand from similar collections',
    trend: 'up',
    creator: 'CryptoCreator',
    category: 'Art'
  },
  {
    id: '2',
    name: 'Digital Dreams #2',
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=200&h=200&fit=crop&crop=center&q=80',
    currentPrice: '0.25',
    predictedPrice: '0.22',
    confidence: 72,
    reason: 'Market saturation in category',
    trend: 'down',
    creator: 'DigitalDreamer',
    category: 'Abstract'
  },
  {
    id: '3',
    name: 'Neon City #3',
    image: 'https://images.unsplash.com/photo-1507003211169-e695c5b0c85a?w=200&h=200&fit=crop&crop=center&q=80',
    currentPrice: '0.15',
    predictedPrice: '0.18',
    confidence: 91,
    reason: 'Rising trend in neon art',
    trend: 'up',
    creator: 'NeonArtist',
    category: 'Cyberpunk'
  }
]

const mockPricePredictions = [
  {
    nftId: '1',
    name: 'Cosmic Explorer #1',
    currentPrice: '0.05',
    predictions: {
      '1d': '0.06',
      '7d': '0.08',
      '30d': '0.12',
      '90d': '0.15'
    },
    confidence: 85,
    factors: ['High demand', 'Limited supply', 'Creator reputation']
  },
  {
    nftId: '2',
    name: 'Digital Dreams #2',
    currentPrice: '0.25',
    predictions: {
      '1d': '0.24',
      '7d': '0.22',
      '30d': '0.20',
      '90d': '0.18'
    },
    confidence: 72,
    factors: ['Market saturation', 'Decreasing demand', 'Competition']
  }
]

const mockAIAnalytics = {
  marketSentiment: 'Bullish',
  trendingCategories: ['Art', 'Cyberpunk', 'Abstract'],
  priceVolatility: 'Medium',
  recommendedActions: [
    'Consider buying Cosmic Explorer #1',
    'Hold Digital Dreams #2',
    'Watch Neon City #3'
  ],
  marketInsights: [
    'Art category showing 15% growth',
    'Cyberpunk NFTs gaining popularity',
    'Abstract art market stabilizing'
  ]
}

export default function AIFeaturesPage() {
  const [recommendations, setRecommendations] = useState(mockRecommendations)
  const [pricePredictions, setPricePredictions] = useState(mockPricePredictions)
  const [aiAnalytics, setAiAnalytics] = useState(mockAIAnalytics)
  const [selectedNFT, setSelectedNFT] = useState<any>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const handleAnalyzeNFT = (nftId: string) => {
    setIsAnalyzing(true)
    // Simulate AI analysis
    setTimeout(() => {
      setIsAnalyzing(false)
      toast.success('AI analysis completed!')
    }, 2000)
  }

  const getTrendColor = (trend: string) => {
    return trend === 'up' ? 'text-green-600' : 'text-red-600'
  }

  const getTrendIcon = (trend: string) => {
    return trend === 'up' ? '↗' : '↘'
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-green-600'
    if (confidence >= 60) return 'text-yellow-600'
    return 'text-red-600'
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
          <h1 className="text-4xl font-bold text-gradient mb-4">AI-Powered Insights</h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            Leverage artificial intelligence for smarter NFT decisions
          </p>
        </motion.div>

        {/* AI Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <div className="card text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl mx-auto mb-4">
              <SparklesIcon className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">85%</h3>
            <p className="text-gray-600 dark:text-gray-400">Prediction Accuracy</p>
          </div>

          <div className="card text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl mx-auto mb-4">
              <TrendingUpIcon className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">1,234</h3>
            <p className="text-gray-600 dark:text-gray-400">NFTs Analyzed</p>
          </div>

          <div className="card text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl mx-auto mb-4">
              <ChartBarIcon className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">92%</h3>
            <p className="text-gray-600 dark:text-gray-400">Success Rate</p>
          </div>

          <div className="card text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl mx-auto mb-4">
              <LightBulbIcon className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">24/7</h3>
            <p className="text-gray-600 dark:text-gray-400">AI Monitoring</p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* AI Recommendations */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="card"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">AI Recommendations</h2>
              <SparklesIcon className="h-6 w-6 text-purple-500" />
            </div>

            <div className="space-y-4">
              {recommendations.map((nft) => (
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
                    <h3 className="font-semibold text-gray-900 dark:text-white">{nft.name}</h3>
                    <p className="text-sm text-gray-500">by {nft.creator}</p>
                    <div className="flex items-center space-x-4 mt-2">
                      <span className="text-sm text-gray-600">Current: {nft.currentPrice} ETH</span>
                      <span className={`text-sm font-medium ${getTrendColor(nft.trend)}`}>
                        Predicted: {nft.predictedPrice} ETH {getTrendIcon(nft.trend)}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`text-sm font-bold ${getConfidenceColor(nft.confidence)}`}>
                      {nft.confidence}%
                    </span>
                    <p className="text-xs text-gray-500 mt-1">Confidence</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Price Predictions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="card"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Price Predictions</h2>
              <TrendingUpIcon className="h-6 w-6 text-blue-500" />
            </div>

            <div className="space-y-4">
              {pricePredictions.map((prediction) => (
                <motion.div
                  key={prediction.nftId}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-gray-50 dark:bg-slate-700 rounded-xl"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-900 dark:text-white">{prediction.name}</h3>
                    <span className={`text-sm font-bold ${getConfidenceColor(prediction.confidence)}`}>
                      {prediction.confidence}% confidence
                    </span>
                  </div>

                  <div className="grid grid-cols-4 gap-2 mb-3">
                    <div className="text-center">
                      <p className="text-xs text-gray-500">1D</p>
                      <p className="text-sm font-semibold">{prediction.predictions['1d']} ETH</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-500">7D</p>
                      <p className="text-sm font-semibold">{prediction.predictions['7d']} ETH</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-500">30D</p>
                      <p className="text-sm font-semibold">{prediction.predictions['30d']} ETH</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-500">90D</p>
                      <p className="text-sm font-semibold">{prediction.predictions['90d']} ETH</p>
                    </div>
                  </div>

                  <div className="text-xs text-gray-600">
                    <p className="font-medium mb-1">Key Factors:</p>
                    <ul className="list-disc list-inside space-y-1">
                      {prediction.factors.map((factor, index) => (
                        <li key={index}>{factor}</li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* AI Analytics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8"
        >
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">AI Market Analytics</h2>
              <ChartBarIcon className="h-6 w-6 text-green-500" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Market Sentiment */}
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Market Sentiment</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <span className="text-sm font-medium">Overall Sentiment</span>
                    <span className="text-sm font-bold text-green-600">{aiAnalytics.marketSentiment}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <span className="text-sm font-medium">Price Volatility</span>
                    <span className="text-sm font-bold text-blue-600">{aiAnalytics.priceVolatility}</span>
                  </div>
                </div>
              </div>

              {/* Trending Categories */}
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Trending Categories</h3>
                <div className="space-y-2">
                  {aiAnalytics.trendingCategories.map((category, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <FireIcon className="h-4 w-4 text-orange-500" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">{category}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* AI Recommendations */}
            <div className="mt-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">AI Recommendations</h3>
              <div className="space-y-2">
                {aiAnalytics.recommendedActions.map((action, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <LightBulbIcon className="h-5 w-5 text-purple-500 mt-0.5" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{action}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Market Insights */}
            <div className="mt-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Market Insights</h3>
              <div className="space-y-2">
                {aiAnalytics.marketInsights.map((insight, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <EyeIcon className="h-5 w-5 text-blue-500 mt-0.5" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{insight}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* AI Analysis Tool */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8"
        >
          <div className="card">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">AI NFT Analyzer</h2>
            <div className="flex items-center space-x-4">
              <input
                type="text"
                placeholder="Enter NFT address or name..."
                className="flex-1 input-field"
              />
              <button
                onClick={() => handleAnalyzeNFT('test')}
                disabled={isAnalyzing}
                className="btn-primary px-6 py-3 disabled:opacity-50"
              >
                {isAnalyzing ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Analyzing...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <SparklesIcon className="h-5 w-5" />
                    <span>Analyze NFT</span>
                  </div>
                )}
              </button>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-3">
              Get AI-powered insights, price predictions, and recommendations for any NFT
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
