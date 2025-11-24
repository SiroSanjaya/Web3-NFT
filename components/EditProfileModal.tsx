'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  XMarkIcon,
  PhotoIcon,
  CameraIcon,
  LinkIcon,
  MapPinIcon,
  UserIcon
} from '@heroicons/react/24/outline'
import Image from 'next/image'

interface EditProfileModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (profileData: any) => void
  currentProfile: any
}

export default function EditProfileModal({ 
  isOpen, 
  onClose, 
  onSave, 
  currentProfile 
}: EditProfileModalProps) {
  const [formData, setFormData] = useState({
    name: currentProfile?.name || '',
    bio: currentProfile?.bio || '',
    website: currentProfile?.website || '',
    twitter: currentProfile?.twitter || '',
    instagram: currentProfile?.instagram || '',
    discord: currentProfile?.discord || '',
    location: currentProfile?.location || '',
    avatar: currentProfile?.avatar || '',
    banner: currentProfile?.banner || ''
  })

  const [avatarPreview, setAvatarPreview] = useState(currentProfile?.avatar || '')
  const [bannerPreview, setBannerPreview] = useState(currentProfile?.banner || '')
  const [isLoading, setIsLoading] = useState(false)

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleImageUpload = (type: 'avatar' | 'banner', event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        if (type === 'avatar') {
          setAvatarPreview(result)
          setFormData(prev => ({ ...prev, avatar: result }))
        } else {
          setBannerPreview(result)
          setFormData(prev => ({ ...prev, banner: result }))
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSave = async () => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      onSave(formData)
      onClose()
    } catch (error) {
      console.error('Error saving profile:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const socialPlatforms = [
    { key: 'website', label: 'Website', icon: LinkIcon, placeholder: 'https://yourwebsite.com' },
    { key: 'twitter', label: 'Twitter', icon: LinkIcon, placeholder: '@username' },
    { key: 'instagram', label: 'Instagram', icon: LinkIcon, placeholder: '@username' },
    { key: 'discord', label: 'Discord', icon: LinkIcon, placeholder: 'username#1234' }
  ]

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
              className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Edit Profile
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <XMarkIcon className="h-5 w-5 text-gray-500" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                {/* Banner Upload */}
                <div className="mb-8">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Banner Image
                  </label>
                  <div className="relative h-32 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden group cursor-pointer">
                    {bannerPreview ? (
                      <Image
                        src={bannerPreview}
                        alt="Banner preview"
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <PhotoIcon className="h-8 w-8 text-gray-400" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <CameraIcon className="h-6 w-6 text-white" />
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload('banner', e)}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                  </div>
                </div>

                {/* Avatar Upload */}
                <div className="mb-8">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Profile Picture
                  </label>
                  <div className="relative w-24 h-24 mx-auto">
                    <div className="w-24 h-24 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden group cursor-pointer">
                      {avatarPreview ? (
                        <Image
                          src={avatarPreview}
                          alt="Avatar preview"
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <UserIcon className="h-8 w-8 text-gray-400" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-full">
                        <CameraIcon className="h-5 w-5 text-white" />
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload('avatar', e)}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                    </div>
                  </div>
                </div>

                {/* Basic Info */}
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Display Name
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Enter your display name"
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Bio
                    </label>
                    <textarea
                      value={formData.bio}
                      onChange={(e) => handleInputChange('bio', e.target.value)}
                      placeholder="Tell the world about yourself"
                      rows={4}
                      className="input-field resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      <MapPinIcon className="h-4 w-4 inline mr-1" />
                      Location
                    </label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      placeholder="Where are you based?"
                      className="input-field"
                    />
                  </div>
                </div>

                {/* Social Links */}
                <div className="mt-8">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                    Social Links
                  </h3>
                  <div className="space-y-4">
                    {socialPlatforms.map((platform) => (
                      <div key={platform.key}>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          <platform.icon className="h-4 w-4 inline mr-1" />
                          {platform.label}
                        </label>
                        <input
                          type="text"
                          value={formData[platform.key as keyof typeof formData]}
                          onChange={(e) => handleInputChange(platform.key, e.target.value)}
                          placeholder={platform.placeholder}
                          className="input-field"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                <button
                  onClick={onClose}
                  className="btn-outline"
                  disabled={isLoading}
                >
                  Cancel
                </button>
                
                <button
                  onClick={handleSave}
                  disabled={isLoading}
                  className="btn-primary flex items-center"
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  ) : null}
                  {isLoading ? 'Saving...' : 'Save Profile'}
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  )
}








