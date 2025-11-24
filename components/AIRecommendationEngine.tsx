'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  SparklesIcon, ArrowTrendingUpIcon, HeartIcon, EyeIcon,
  CurrencyDollarIcon, ClockIcon, StarIcon, FireIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

interface NFTRecommendation {
  id: string
  name: string
  image: string
  currentPrice: string
  predictedPrice: string
  confidence: number
  reason: string
  trend: 'up' | 'down' | 'stable'
  creator: string
  category: string
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  marketCap: string
  volume24h: string
  holders: number
  similarity: number
}

interface UserPreferences {
  categories: string[]
  priceRange: [number, number]
  riskTolerance: 'low' | 'medium' | 'high'
  investmentHorizon: 'short' | 'medium' | 'long'
}

export default function AIRecommendationEngine() {
  const [recommendations, setRecommendations] = useState<NFTRecommendation[]>([])
  const [userPreferences, setUserPreferences] = useState<UserPreferences>({
    categories: ['Art', 'Gaming', 'Music'],
    priceRange: [0.01, 1.0],
    riskTolerance: 'medium',
    investmentHorizon: 'medium'
  })
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [selectedFilters, setSelectedFilters] = useState<string[]>([])
  const [aiRecommendations, setAiRecommendations] = useState<string | null>(null)
  const [aiLoading, setAiLoading] = useState(false)
  const [aiError, setAiError] = useState<string | null>(null)

  // Mock AI recommendations
  const mockRecommendations: NFTRecommendation[] = [
    {
      id: '1',
      name: 'Cosmic Explorer #1',
      image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&h=200&fit=crop&crop=center&q=80',
      currentPrice: '0.05',
      predictedPrice: '0.08',
      confidence: 85,
      reason: 'High demand from similar collections, strong community engagement',
      trend: 'up',
      creator: 'CryptoCreator',
      category: 'Art',
      rarity: 'rare',
      marketCap: '50,000',
      volume24h: '2,500',
      holders: 150,
      similarity: 92
    },
    {
      id: '2',
      name: 'Digital Dreams #2',
      image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=200&h=200&fit=crop&crop=center&q=80',
      currentPrice: '0.25',
      predictedPrice: '0.22',
      confidence: 72,
      reason: 'Market saturation in category, decreasing demand',
      trend: 'down',
      creator: 'DigitalDreamer',
      category: 'Abstract',
      rarity: 'common',
      marketCap: '250,000',
      volume24h: '1,200',
      holders: 89,
      similarity: 78
    },
    {
      id: '3',
      name: 'Neon City #3',
      image: 'https://images.unsplash.com/photo-1507003211169-e695c5b0c85a?w=200&h=200&fit=crop&crop=center&q=80',
      currentPrice: '0.15',
      predictedPrice: '0.18',
      confidence: 91,
      reason: 'Rising trend in neon art, limited supply',
      trend: 'up',
      creator: 'NeonArtist',
      category: 'Cyberpunk',
      rarity: 'epic',
      marketCap: '150,000',
      volume24h: '3,800',
      holders: 234,
      similarity: 95
    },
    {
      id: '4',
      name: 'Pixel Warriors #4',
      image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=200&h=200&fit=crop&crop=center&q=80',
      currentPrice: '0.08',
      predictedPrice: '0.12',
      confidence: 88,
      reason: 'Gaming NFT boom, strong utility potential',
      trend: 'up',
      creator: 'GameDev',
      category: 'Gaming',
      rarity: 'rare',
      marketCap: '80,000',
      volume24h: '4,200',
      holders: 312,
      similarity: 89
    }
  ]

  useEffect(() => {
    setRecommendations(mockRecommendations)
  }, [])

  const handleAnalyzePreferences = async () => {
    setIsAnalyzing(true)
    setAiLoading(true)
    setAiError(null)
    setAiRecommendations(null)
    try {
      const prompt = `Berdasarkan preferensi berikut, rekomendasikan 3 NFT unik dan jelaskan alasannya:\nKategori: ${userPreferences.categories.join(", ")}\nRange harga: ${userPreferences.priceRange[0]} - ${userPreferences.priceRange[1]} ETH\nToleransi risiko: ${userPreferences.riskTolerance}\nHorizon investasi: ${userPreferences.investmentHorizon}`
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: prompt })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Gagal mendapatkan rekomendasi AI')
      setAiRecommendations(data.response)
    } catch (err: any) {
      setAiError(err.message)
    } finally {
      setIsAnalyzing(false)
      setAiLoading(false)
    }
  }

  const handleUpdatePreferences = (key: keyof UserPreferences, value: any) => {
    setUserPreferences(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return 'text-green-600'
      case 'down': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return '↗'
      case 'down': return '↘'
      default: return '→'
    }
  }

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'text-purple-600 bg-purple-100'
      case 'epic': return 'text-blue-600 bg-blue-100'
      case 'rare': return 'text-green-600 bg-green-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-green-600'
    if (confidence >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <div className="space-y-6">
      {/* User Preferences */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card"
      >
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <SparklesIcon className="h-5 w-5 mr-2 text-purple-500" />
          AI Preferences
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Categories */}
          <div>
            <label className="block text-sm font-medium mb-2">Preferred Categories</label>
            <div className="flex flex-wrap gap-2">
              {['Art', 'Gaming', 'Music', 'Sports', 'Abstract', 'Cyberpunk'].map((category) => (
                <button
                  key={category}
                  onClick={() => {
                    const newCategories = userPreferences.categories.includes(category)
                      ? userPreferences.categories.filter(c => c !== category)
                      : [...userPreferences.categories, category]
                    handleUpdatePreferences('categories', newCategories)
                  }}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    userPreferences.categories.includes(category)
                      ? 'bg-purple-100 text-purple-700'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div>
            <label className="block text-sm font-medium mb-2">Price Range (ETH)</label>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                value={userPreferences.priceRange[0]}
                onChange={(e) => handleUpdatePreferences('priceRange', [parseFloat(e.target.value), userPreferences.priceRange[1]])}
                className="input-field w-20"
                step="0.01"
              />
              <span>to</span>
              <input
                type="number"
                value={userPreferences.priceRange[1]}
                onChange={(e) => handleUpdatePreferences('priceRange', [userPreferences.priceRange[0], parseFloat(e.target.value)])}
                className="input-field w-20"
                step="0.01"
              />
            </div>
          </div>

          {/* Risk Tolerance */}
          <div>
            <label className="block text-sm font-medium mb-2">Risk Tolerance</label>
            <select
              value={userPreferences.riskTolerance}
              onChange={(e) => handleUpdatePreferences('riskTolerance', e.target.value)}
              className="input-field"
            >
              <option value="low">Conservative</option>
              <option value="medium">Balanced</option>
              <option value="high">Aggressive</option>
            </select>
          </div>

          {/* Investment Horizon */}
          <div>
            <label className="block text-sm font-medium mb-2">Investment Horizon</label>
            <select
              value={userPreferences.investmentHorizon}
              onChange={(e) => handleUpdatePreferences('investmentHorizon', e.target.value)}
              className="input-field"
            >
              <option value="short">Short-term (1-3 months)</option>
              <option value="medium">Medium-term (3-12 months)</option>
              <option value="long">Long-term (1+ years)</option>
            </select>
          </div>
        </div>

        <button
          onClick={handleAnalyzePreferences}
          disabled={isAnalyzing}
          className="btn-primary mt-4 disabled:opacity-50"
        >
          {isAnalyzing ? (
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Analyzing...</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <SparklesIcon className="h-5 w-5" />
              <span>Get Personalized Recommendations</span>
            </div>
          )}
        </button>
      </motion.div>

      {/* AI Recommendations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold flex items-center">
            <ArrowTrendingUpIcon className="h-5 w-5 mr-2 text-blue-500" />
            AI Recommendations
          </h3>
          <div className="flex space-x-2">
            {['All', 'High Confidence', 'Trending', 'Undervalued'].map((filter) => (
              <button
                key={filter}
                onClick={() => setSelectedFilters(prev => 
                  prev.includes(filter) 
                    ? prev.filter(f => f !== filter)
                    : [...prev, filter]
                )}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  selectedFilters.includes(filter)
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* AI Recommendations Result */}
        {aiLoading && (
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded mb-4 text-blue-700 dark:text-blue-200">Sedang memproses rekomendasi AI...</div>
        )}
        {aiError && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded mb-4 text-red-700 dark:text-red-200">{aiError}</div>
        )}
        {aiRecommendations && (
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded mb-4 text-green-700 dark:text-green-200 whitespace-pre-line">{aiRecommendations}</div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {recommendations.map((nft) => (
            <motion.div
              key={nft.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-4 bg-gray-50 dark:bg-slate-700 rounded-xl hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start space-x-4">
                <img
                  src={nft.image}
                  alt={nft.name}
                  className="w-20 h-20 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900 dark:text-white">{nft.name}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRarityColor(nft.rarity)}`}>
                      {nft.rarity}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-500 mb-2">by {nft.creator}</p>
                  
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <div className="text-xs">
                      <span className="text-gray-500">Current:</span>
                      <span className="font-medium ml-1">{nft.currentPrice} ETH</span>
                    </div>
                    <div className="text-xs">
                      <span className="text-gray-500">Predicted:</span>
                      <span className={`font-medium ml-1 ${getTrendColor(nft.trend)}`}>
                        {nft.predictedPrice} ETH {getTrendIcon(nft.trend)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span className="flex items-center">
                        <EyeIcon className="h-3 w-3 mr-1" />
                        {nft.holders}
                      </span>
                      <span className="flex items-center">
                        <CurrencyDollarIcon className="h-3 w-3 mr-1" />
                        {nft.volume24h}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className={`text-sm font-bold ${getConfidenceColor(nft.confidence)}`}>
                        {nft.confidence}%
                      </span>
                      <p className="text-xs text-gray-500">Confidence</p>
                    </div>
                  </div>

                  <div className="mt-3">
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      <span className="font-medium">Why:</span> {nft.reason}
                    </p>
                  </div>

                  <div className="mt-3 flex space-x-2">
                    <button className="btn-primary text-xs px-3 py-1">
                      View Details
                    </button>
                    <button className="btn-outline text-xs px-3 py-1">
                      <HeartIcon className="h-3 w-3 mr-1" />
                      Watch
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* AI Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card"
      >
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <FireIcon className="h-5 w-5 mr-2 text-orange-500" />
          AI Market Insights
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <ArrowTrendingUpIcon className="h-4 w-4 text-green-600" />
              <span className="font-medium text-green-800 dark:text-green-200">Market Sentiment</span>
            </div>
            <p className="text-sm text-green-700 dark:text-green-300">Bullish - 15% growth expected</p>
          </div>
          
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <StarIcon className="h-4 w-4 text-blue-600" />
              <span className="font-medium text-blue-800 dark:text-blue-200">Top Category</span>
            </div>
            <p className="text-sm text-blue-700 dark:text-blue-300">Gaming NFTs +25% volume</p>
          </div>
          
          <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <ClockIcon className="h-4 w-4 text-purple-600" />
              <span className="font-medium text-purple-800 dark:text-purple-200">Best Time</span>
            </div>
            <p className="text-sm text-purple-700 dark:text-purple-300">Weekend trading peaks</p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
