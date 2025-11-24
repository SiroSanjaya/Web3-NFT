'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  XMarkIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  TagIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline'

interface SearchFilters {
  name: string
  description: string
  category: string
  collection: string
  minPrice: string
  maxPrice: string
  rarity: string
  attributes: { trait: string; value: string }[]
  sortBy: string
  onSale: boolean
  hasOffers: boolean
}

interface AdvancedSearchModalProps {
  isOpen: boolean
  onClose: () => void
  onApplyFilters: (filters: SearchFilters) => void
  categories: string[]
  collections: string[]
}

export default function AdvancedSearchModal({ 
  isOpen, 
  onClose, 
  onApplyFilters,
  categories,
  collections 
}: AdvancedSearchModalProps) {
  const [filters, setFilters] = useState<SearchFilters>({
    name: '',
    description: '',
    category: '',
    collection: '',
    minPrice: '',
    maxPrice: '',
    rarity: '',
    attributes: [],
    sortBy: 'newest',
    onSale: false,
    hasOffers: false
  })

  const [newAttribute, setNewAttribute] = useState({ trait: '', value: '' })

  const rarities = ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary']
  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'trending', label: 'Most Popular' },
    { value: 'random', label: 'Random' }
  ]

  const handleAddAttribute = () => {
    if (newAttribute.trait && newAttribute.value) {
      setFilters(prev => ({
        ...prev,
        attributes: [...prev.attributes, newAttribute]
      }))
      setNewAttribute({ trait: '', value: '' })
    }
  }

  const handleRemoveAttribute = (index: number) => {
    setFilters(prev => ({
      ...prev,
      attributes: prev.attributes.filter((_, i) => i !== index)
    }))
  }

  const handleApply = () => {
    onApplyFilters(filters)
    onClose()
  }

  const handleReset = () => {
    setFilters({
      name: '',
      description: '',
      category: '',
      collection: '',
      minPrice: '',
      maxPrice: '',
      rarity: '',
      attributes: [],
      sortBy: 'newest',
      onSale: false,
      hasOffers: false
    })
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          {/* Backdrop */}
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
          
          {/* Modal */}
          <div className="flex min-h-full items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-3">
                  <FunnelIcon className="h-6 w-6 text-primary-600" />
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Advanced Search & Filters
                  </h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <XMarkIcon className="h-5 w-5 text-gray-500" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Left Column */}
                  <div className="space-y-6">
                    {/* Basic Search */}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                        Basic Search
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            NFT Name
                          </label>
                          <input
                            type="text"
                            value={filters.name}
                            onChange={(e) => setFilters(prev => ({ ...prev, name: e.target.value }))}
                            placeholder="Search by name..."
                            className="input-field"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Description
                          </label>
                          <input
                            type="text"
                            value={filters.description}
                            onChange={(e) => setFilters(prev => ({ ...prev, description: e.target.value }))}
                            placeholder="Search in description..."
                            className="input-field"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Categories & Collections */}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                        Categories & Collections
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Category
                          </label>
                          <select
                            value={filters.category}
                            onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                            className="input-field"
                          >
                            <option value="">All Categories</option>
                            {categories.filter(c => c !== 'All').map(category => (
                              <option key={category} value={category}>{category}</option>
                            ))}
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Collection
                          </label>
                          <select
                            value={filters.collection}
                            onChange={(e) => setFilters(prev => ({ ...prev, collection: e.target.value }))}
                            className="input-field"
                          >
                            <option value="">All Collections</option>
                            {collections.filter(c => c !== 'All Collections').map(collection => (
                              <option key={collection} value={collection}>{collection}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Attributes */}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                        Attributes
                      </h3>
                      
                      {/* Add new attribute */}
                      <div className="flex space-x-2 mb-4">
                        <input
                          type="text"
                          value={newAttribute.trait}
                          onChange={(e) => setNewAttribute(prev => ({ ...prev, trait: e.target.value }))}
                          placeholder="Trait (e.g., Background)"
                          className="input-field flex-1"
                        />
                        <input
                          type="text"
                          value={newAttribute.value}
                          onChange={(e) => setNewAttribute(prev => ({ ...prev, value: e.target.value }))}
                          placeholder="Value (e.g., Blue)"
                          className="input-field flex-1"
                        />
                        <button
                          onClick={handleAddAttribute}
                          className="btn-primary whitespace-nowrap"
                        >
                          Add
                        </button>
                      </div>

                      {/* Current attributes */}
                      <div className="space-y-2">
                        {filters.attributes.map((attr, index) => (
                          <div key={index} className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                            <span className="text-sm text-gray-700 dark:text-gray-300">
                              <strong>{attr.trait}:</strong> {attr.value}
                            </span>
                            <button
                              onClick={() => handleRemoveAttribute(index)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <XMarkIcon className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-6">
                    {/* Price Range */}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                        Price Range (ETH)
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Min Price
                          </label>
                          <input
                            type="number"
                            step="0.001"
                            value={filters.minPrice}
                            onChange={(e) => setFilters(prev => ({ ...prev, minPrice: e.target.value }))}
                            placeholder="0.001"
                            className="input-field"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Max Price
                          </label>
                          <input
                            type="number"
                            step="0.001"
                            value={filters.maxPrice}
                            onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: e.target.value }))}
                            placeholder="10.0"
                            className="input-field"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Rarity */}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                        Rarity
                      </h3>
                      <select
                        value={filters.rarity}
                        onChange={(e) => setFilters(prev => ({ ...prev, rarity: e.target.value }))}
                        className="input-field"
                      >
                        <option value="">All Rarities</option>
                        {rarities.map(rarity => (
                          <option key={rarity} value={rarity}>{rarity}</option>
                        ))}
                      </select>
                    </div>

                    {/* Sort Options */}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                        Sort By
                      </h3>
                      <select
                        value={filters.sortBy}
                        onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value }))}
                        className="input-field"
                      >
                        {sortOptions.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Status Filters */}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                        Status
                      </h3>
                      <div className="space-y-3">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={filters.onSale}
                            onChange={(e) => setFilters(prev => ({ ...prev, onSale: e.target.checked }))}
                            className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                          />
                          <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                            On Sale Only
                          </span>
                        </label>
                        
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={filters.hasOffers}
                            onChange={(e) => setFilters(prev => ({ ...prev, hasOffers: e.target.checked }))}
                            className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                          />
                          <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                            Has Offers
                          </span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                <button
                  onClick={handleReset}
                  className="btn-outline"
                >
                  Reset All
                </button>
                
                <div className="flex space-x-3">
                  <button
                    onClick={onClose}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleApply}
                    className="btn-primary flex items-center"
                  >
                    <MagnifyingGlassIcon className="h-4 w-4 mr-2" />
                    Apply Filters
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  )
}








