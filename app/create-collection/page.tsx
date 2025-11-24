'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useAccount } from 'wagmi'
import { 
  PhotoIcon,
  DocumentTextIcon,
  GlobeAltIcon,
  TagIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  SparklesIcon,
  CheckCircleIcon,
  XMarkIcon,
  PlusIcon,
  TrashIcon,
  ArrowLeftIcon,
  CloudArrowUpIcon
} from '@heroicons/react/24/outline'
import Image from 'next/image'
import Link from 'next/link'

interface CollectionMetadata {
  name: string
  description: string
  symbol: string
  website: string
  discord: string
  twitter: string
  instagram: string
  category: string
  royaltyPercentage: number
  maxSupply: number
  mintPrice: string
  revealDate?: Date
  isPublic: boolean
  allowlist: string[]
}

interface Trait {
  name: string
  values: Array<{
    value: string
    rarity: number
  }>
}

export default function CreateCollectionPage() {
  const { address, isConnected } = useAccount()
  const [currentStep, setCurrentStep] = useState(1)
  const [isCreating, setIsCreating] = useState(false)
  const [bannerPreview, setBannerPreview] = useState('')
  const [logoPreview, setLogoPreview] = useState('')
  
  const [collectionData, setCollectionData] = useState<CollectionMetadata>({
    name: '',
    description: '',
    symbol: '',
    website: '',
    discord: '',
    twitter: '',
    instagram: '',
    category: 'Art',
    royaltyPercentage: 2.5,
    maxSupply: 10000,
    mintPrice: '0.01',
    isPublic: true,
    allowlist: []
  })

  const [traits, setTraits] = useState<Trait[]>([
    {
      name: 'Background',
      values: [
        { value: 'Blue', rarity: 30 },
        { value: 'Red', rarity: 25 },
        { value: 'Green', rarity: 20 },
        { value: 'Purple', rarity: 15 },
        { value: 'Gold', rarity: 10 }
      ]
    }
  ])

  const categories = [
    'Art', 'Gaming', 'Music', 'Sports', 'Photography', 'Collectibles', 
    'Utility', 'PFP', 'Metaverse', 'Fashion', 'Education', 'Other'
  ]

  const steps = [
    { id: 1, name: 'Basic Info', icon: DocumentTextIcon },
    { id: 2, name: 'Media & Branding', icon: PhotoIcon },
    { id: 3, name: 'Traits & Metadata', icon: TagIcon },
    { id: 4, name: 'Mint Settings', icon: CurrencyDollarIcon },
    { id: 5, name: 'Review & Deploy', icon: CheckCircleIcon }
  ]

  const handleImageUpload = (type: 'banner' | 'logo', event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        if (type === 'banner') {
          setBannerPreview(result)
        } else {
          setLogoPreview(result)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const addTrait = () => {
    setTraits(prev => [...prev, {
      name: '',
      values: [{ value: '', rarity: 0 }]
    }])
  }

  const removeTrait = (index: number) => {
    setTraits(prev => prev.filter((_, i) => i !== index))
  }

  const updateTrait = (index: number, field: string, value: any) => {
    setTraits(prev => prev.map((trait, i) => 
      i === index ? { ...trait, [field]: value } : trait
    ))
  }

  const addTraitValue = (traitIndex: number) => {
    setTraits(prev => prev.map((trait, i) => 
      i === traitIndex 
        ? { ...trait, values: [...trait.values, { value: '', rarity: 0 }] }
        : trait
    ))
  }

  const removeTraitValue = (traitIndex: number, valueIndex: number) => {
    setTraits(prev => prev.map((trait, i) => 
      i === traitIndex 
        ? { ...trait, values: trait.values.filter((_, vi) => vi !== valueIndex) }
        : trait
    ))
  }

  const updateTraitValue = (traitIndex: number, valueIndex: number, field: string, value: any) => {
    setTraits(prev => prev.map((trait, i) => 
      i === traitIndex 
        ? { 
            ...trait, 
            values: trait.values.map((val, vi) => 
              vi === valueIndex ? { ...val, [field]: value } : val
            )
          }
        : trait
    ))
  }

  const handleCreateCollection = async () => {
    setIsCreating(true)
    try {
      // Simulate collection creation
      await new Promise(resolve => setTimeout(resolve, 3000))
      alert('Collection created successfully!')
      // Redirect to collection page
    } catch (error) {
      console.error('Error creating collection:', error)
      alert('Error creating collection. Please try again.')
    } finally {
      setIsCreating(false)
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Basic Collection Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Collection Name *
                  </label>
                  <input
                    type="text"
                    value={collectionData.name}
                    onChange={(e) => setCollectionData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="My Awesome Collection"
                    className="input-field"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Symbol *
                  </label>
                  <input
                    type="text"
                    value={collectionData.symbol}
                    onChange={(e) => setCollectionData(prev => ({ ...prev, symbol: e.target.value.toUpperCase() }))}
                    placeholder="MAC"
                    className="input-field"
                    maxLength={10}
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description *
                  </label>
                  <textarea
                    value={collectionData.description}
                    onChange={(e) => setCollectionData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe your collection, its story, and what makes it unique..."
                    rows={4}
                    className="input-field resize-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Category *
                  </label>
                  <select
                    value={collectionData.category}
                    onChange={(e) => setCollectionData(prev => ({ ...prev, category: e.target.value }))}
                    className="input-field"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Royalty Percentage
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="10"
                      value={collectionData.royaltyPercentage}
                      onChange={(e) => setCollectionData(prev => ({ ...prev, royaltyPercentage: parseFloat(e.target.value) }))}
                      className="input-field pr-8"
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">%</div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Recommended: 2.5% - 5%
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Media & Branding
              </h3>
              
              {/* Banner Upload */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Collection Banner (1400x400px recommended)
                </label>
                <div className="relative h-40 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden group cursor-pointer border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-primary-500 transition-colors">
                  {bannerPreview ? (
                    <Image
                      src={bannerPreview}
                      alt="Banner preview"
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full">
                      <CloudArrowUpIcon className="h-12 w-12 text-gray-400 mb-2" />
                      <span className="text-gray-500">Click to upload banner</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <PhotoIcon className="h-8 w-8 text-white" />
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload('banner', e)}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </div>
              </div>

              {/* Logo Upload */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Collection Logo (400x400px recommended)
                </label>
                <div className="flex items-center space-x-6">
                  <div className="relative w-32 h-32">
                    <div className="w-32 h-32 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden group cursor-pointer border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-primary-500 transition-colors">
                      {logoPreview ? (
                        <Image
                          src={logoPreview}
                          alt="Logo preview"
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full">
                          <PhotoIcon className="h-8 w-8 text-gray-400 mb-1" />
                          <span className="text-xs text-gray-500 text-center">Upload Logo</span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-full">
                        <PhotoIcon className="h-6 w-6 text-white" />
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload('logo', e)}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      Upload a square image for your collection logo. This will appear in marketplace listings and collection pages.
                    </p>
                    <p className="text-xs text-gray-500">
                      Accepted formats: JPG, PNG, GIF. Max size: 10MB.
                    </p>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-4">Social Links</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Website
                    </label>
                    <input
                      type="url"
                      value={collectionData.website}
                      onChange={(e) => setCollectionData(prev => ({ ...prev, website: e.target.value }))}
                      placeholder="https://yourwebsite.com"
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Discord
                    </label>
                    <input
                      type="url"
                      value={collectionData.discord}
                      onChange={(e) => setCollectionData(prev => ({ ...prev, discord: e.target.value }))}
                      placeholder="https://discord.gg/yourserver"
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Twitter
                    </label>
                    <input
                      type="text"
                      value={collectionData.twitter}
                      onChange={(e) => setCollectionData(prev => ({ ...prev, twitter: e.target.value }))}
                      placeholder="@youraccount"
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Instagram
                    </label>
                    <input
                      type="text"
                      value={collectionData.instagram}
                      onChange={(e) => setCollectionData(prev => ({ ...prev, instagram: e.target.value }))}
                      placeholder="@youraccount"
                      className="input-field"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Traits & Metadata
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Define the traits and attributes that will make each NFT in your collection unique.
              </p>

              <div className="space-y-6">
                {traits.map((trait, traitIndex) => (
                  <motion.div
                    key={traitIndex}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="card border-2 border-gray-200 dark:border-gray-700"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex-1">
                        <input
                          type="text"
                          value={trait.name}
                          onChange={(e) => updateTrait(traitIndex, 'name', e.target.value)}
                          placeholder="Trait name (e.g., Background, Eyes, Hat)"
                          className="input-field"
                        />
                      </div>
                      <button
                        onClick={() => removeTrait(traitIndex)}
                        className="ml-4 p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>

                    <div className="space-y-3">
                      <h5 className="font-medium text-gray-900 dark:text-white">Values</h5>
                      {trait.values.map((value, valueIndex) => (
                        <div key={valueIndex} className="flex items-center space-x-3">
                          <input
                            type="text"
                            value={value.value}
                            onChange={(e) => updateTraitValue(traitIndex, valueIndex, 'value', e.target.value)}
                            placeholder="Value (e.g., Blue, Rare, Golden)"
                            className="flex-1 input-field"
                          />
                          <div className="w-24">
                            <input
                              type="number"
                              min="0"
                              max="100"
                              value={value.rarity}
                              onChange={(e) => updateTraitValue(traitIndex, valueIndex, 'rarity', parseFloat(e.target.value))}
                              placeholder="Rarity %"
                              className="input-field text-center"
                            />
                          </div>
                          <button
                            onClick={() => removeTraitValue(traitIndex, valueIndex)}
                            className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                          >
                            <XMarkIcon className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                      
                      <button
                        onClick={() => addTraitValue(traitIndex)}
                        className="flex items-center space-x-2 text-primary-600 hover:text-primary-700 text-sm"
                      >
                        <PlusIcon className="h-4 w-4" />
                        <span>Add Value</span>
                      </button>
                    </div>
                  </motion.div>
                ))}

                <button
                  onClick={addTrait}
                  className="w-full btn-outline flex items-center justify-center"
                >
                  <PlusIcon className="h-5 w-5 mr-2" />
                  Add New Trait
                </button>
              </div>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Mint Settings
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Max Supply *
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={collectionData.maxSupply}
                    onChange={(e) => setCollectionData(prev => ({ ...prev, maxSupply: parseInt(e.target.value) }))}
                    className="input-field"
                    required
                  />
                  <div className="text-xs text-gray-500 mt-1">
                    Total number of NFTs in this collection
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Mint Price (ETH) *
                  </label>
                  <input
                    type="number"
                    step="0.001"
                    min="0"
                    value={collectionData.mintPrice}
                    onChange={(e) => setCollectionData(prev => ({ ...prev, mintPrice: e.target.value }))}
                    className="input-field"
                    required
                  />
                  <div className="text-xs text-gray-500 mt-1">
                    Price per NFT mint
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={collectionData.isPublic}
                      onChange={(e) => setCollectionData(prev => ({ ...prev, isPublic: e.target.checked }))}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Public Mint
                    </span>
                  </label>
                  <div className="text-xs text-gray-500 ml-6 mt-1">
                    Allow anyone to mint from your collection
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      case 5:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Review & Deploy
              </h3>
              
              <div className="card bg-gray-50 dark:bg-gray-700/50">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Collection Summary</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h5 className="font-medium text-gray-900 dark:text-white mb-2">Basic Info</h5>
                    <div className="space-y-2 text-sm">
                      <div><strong>Name:</strong> {collectionData.name}</div>
                      <div><strong>Symbol:</strong> {collectionData.symbol}</div>
                      <div><strong>Category:</strong> {collectionData.category}</div>
                      <div><strong>Royalty:</strong> {collectionData.royaltyPercentage}%</div>
                    </div>
                  </div>
                  
                  <div>
                    <h5 className="font-medium text-gray-900 dark:text-white mb-2">Mint Settings</h5>
                    <div className="space-y-2 text-sm">
                      <div><strong>Max Supply:</strong> {collectionData.maxSupply.toLocaleString()}</div>
                      <div><strong>Mint Price:</strong> {collectionData.mintPrice} ETH</div>
                      <div><strong>Public Mint:</strong> {collectionData.isPublic ? 'Yes' : 'No'}</div>
                      <div><strong>Traits:</strong> {traits.length}</div>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <h5 className="font-medium text-gray-900 dark:text-white mb-2">Description</h5>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {collectionData.description}
                  </p>
                </div>
              </div>

              <div className="card border-2 border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-900/20">
                <div className="flex items-start space-x-3">
                  <SparklesIcon className="h-6 w-6 text-yellow-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
                      Ready to Deploy!
                    </h4>
                    <p className="text-sm text-yellow-700 dark:text-yellow-300 mb-4">
                      Your collection contract will be deployed to the Polygon Amoy testnet. 
                      This process may take a few minutes and requires gas fees.
                    </p>
                    <div className="text-xs text-yellow-600 dark:text-yellow-400">
                      Estimated gas cost: ~0.01 MATIC
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-blue-900 flex items-center justify-center">
        <div className="text-center">
          <UserGroupIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Connect Your Wallet
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            You need to connect your wallet to create a collection
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-blue-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/marketplace" className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-primary-600 mb-4 transition-colors">
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Back to Marketplace
          </Link>
          
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Create Collection
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Launch your own NFT collection with custom traits and metadata
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors ${
                  currentStep >= step.id 
                    ? 'bg-primary-600 border-primary-600 text-white' 
                    : 'border-gray-300 dark:border-gray-600 text-gray-400'
                }`}>
                  {currentStep > step.id ? (
                    <CheckCircleIcon className="h-6 w-6" />
                  ) : (
                    <step.icon className="h-5 w-5" />
                  )}
                </div>
                <div className="ml-3 hidden sm:block">
                  <div className={`text-sm font-medium ${
                    currentStep >= step.id ? 'text-primary-600' : 'text-gray-500 dark:text-gray-400'
                  }`}>
                    {step.name}
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className={`hidden sm:block w-16 h-0.5 ml-6 ${
                    currentStep > step.id ? 'bg-primary-600' : 'bg-gray-300 dark:bg-gray-600'
                  }`}></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="card mb-8"
        >
          {renderStep()}
        </motion.div>

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
            disabled={currentStep === 1}
            className="btn-outline disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          
          {currentStep < 5 ? (
            <button
              onClick={() => setCurrentStep(prev => Math.min(5, prev + 1))}
              className="btn-primary"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleCreateCollection}
              disabled={isCreating}
              className="btn-primary flex items-center"
            >
              {isCreating ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              ) : (
                <SparklesIcon className="h-5 w-5 mr-2" />
              )}
              {isCreating ? 'Creating Collection...' : 'Create Collection'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}








