'use client'

import { useState } from 'react'
import { useAccount, useContractWrite, usePrepareContractWrite } from 'wagmi'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  XMarkIcon, 
  PhotoIcon,
  CurrencyDollarIcon,
  UserIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline'
import { NFTMarketplaceABI } from '@/utils/contracts'
import { uploadToIPFS } from '@/utils/ipfs'

interface NFTMintModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export default function NFTMintModal({ isOpen, onClose, onSuccess }: NFTMintModalProps) {
  const { address, isConnected } = useAccount()
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    royaltyPercentage: '5',
    image: null as File | null,
  })
  const [imagePreview, setImagePreview] = useState<string>('')
  const [isUploading, setIsUploading] = useState(false)
  const [isMinting, setIsMinting] = useState(false)

  const NFT_MARKETPLACE_ADDRESS = process.env.NEXT_PUBLIC_NFT_MARKETPLACE_ADDRESS || '0x...'

  // Prepare mint transaction
  const { config: mintConfig } = usePrepareContractWrite({
    address: NFT_MARKETPLACE_ADDRESS,
    abi: NFTMarketplaceABI,
    functionName: 'createNFT',
    args: ['', parseFloat(formData.price), parseInt(formData.royaltyPercentage)],
    value: '0.025', // listing price
    enabled: isConnected && !!formData.name && !!formData.price && !!formData.image,
  })

  const { write: mintNFT } = useContractWrite(mintConfig)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData(prev => ({ ...prev, image: file }))
      
      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.image || !formData.name || !formData.price) {
      alert('Please fill in all required fields')
      return
    }

    setIsUploading(true)
    
    try {
      // Upload image to IPFS
      const imageHash = await uploadToIPFS(formData.image)
      
      // Create metadata
      const metadata = {
        name: formData.name,
        description: formData.description,
        image: `ipfs://${imageHash}`,
        attributes: [
          {
            trait_type: 'Creator',
            value: address,
          },
          {
            trait_type: 'Royalty',
            value: `${formData.royaltyPercentage}%`,
          },
        ],
      }
      
      // Upload metadata to IPFS
      const metadataBlob = new Blob([JSON.stringify(metadata)], { type: 'application/json' })
      const metadataFile = new File([metadataBlob], 'metadata.json', { type: 'application/json' })
      const metadataHash = await uploadToIPFS(metadataFile)
      
      // Mint NFT
      setIsMinting(true)
      if (mintNFT) {
        mintNFT()
      }
      
      onSuccess()
      handleClose()
    } catch (error) {
      console.error('Error minting NFT:', error)
      alert('Error minting NFT. Please try again.')
    } finally {
      setIsUploading(false)
      setIsMinting(false)
    }
  }

  const handleClose = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      royaltyPercentage: '5',
      image: null,
    })
    setImagePreview('')
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm"
              onClick={handleClose}
            />
            
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Mint New NFT</h2>
                <button
                  onClick={handleClose}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <XMarkIcon className="h-5 w-5 text-gray-500" />
                </button>
              </div>
              
              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    NFT Image *
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-400 transition-colors">
                    {imagePreview ? (
                      <div className="relative">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-48 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setFormData(prev => ({ ...prev, image: null }))
                            setImagePreview('')
                          }}
                          className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                        >
                          <XMarkIcon className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <div>
                        <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="mt-2">
                          <label htmlFor="image-upload" className="cursor-pointer">
                            <span className="text-primary-600 hover:text-primary-500 font-medium">
                              Upload an image
                            </span>
                            <span className="text-gray-500"> or drag and drop</span>
                          </label>
                          <input
                            id="image-upload"
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                          />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          PNG, JPG, GIF up to 10MB
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    NFT Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="input-field"
                    placeholder="Enter NFT name"
                    required
                  />
                </div>
                
                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="input-field"
                    rows={3}
                    placeholder="Describe your NFT..."
                  />
                </div>
                
                {/* Price */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price (ETH) *
                  </label>
                  <div className="relative">
                    <CurrencyDollarIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="number"
                      step="0.001"
                      min="0"
                      value={formData.price}
                      onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                      className="input-field pl-10"
                      placeholder="0.01"
                      required
                    />
                  </div>
                </div>
                
                {/* Royalty */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Royalty Percentage
                  </label>
                  <div className="relative">
                    <UserIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="number"
                      min="0"
                      max="10"
                      value={formData.royaltyPercentage}
                      onChange={(e) => setFormData(prev => ({ ...prev, royaltyPercentage: e.target.value }))}
                      className="input-field pl-10"
                      placeholder="5"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Maximum 10%</p>
                </div>
                
                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isUploading || isMinting || !formData.image || !formData.name || !formData.price}
                  className="w-full btn-primary flex items-center justify-center"
                >
                  {isUploading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Uploading to IPFS...
                    </>
                  ) : isMinting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Minting NFT...
                    </>
                  ) : (
                    <>
                      <DocumentTextIcon className="h-4 w-4 mr-2" />
                      Mint NFT
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  )
}
