'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import {
  UserPlusIcon, UserMinusIcon, ChatBubbleLeftIcon, HeartIcon, ShareIcon,
  EllipsisHorizontalIcon, UsersIcon, FireIcon, StarIcon
} from '@heroicons/react/24/outline'
import { HeartIcon as HeartIconSolid, StarIcon as StarIconSolid } from '@heroicons/react/24/solid'
import toast from 'react-hot-toast'

// Mock data
const mockUsers = [
  {
    id: '1',
    address: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
    name: 'CryptoCreator',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cfd293ae?w=100&h=100&fit=crop&crop=faces',
    bio: 'Passionate digital artist and blockchain enthusiast',
    followers: 1234,
    following: 56,
    isFollowing: false,
    isVerified: true,
    lastActive: '2 hours ago'
  },
  {
    id: '2',
    address: '0xCreatorAddressHere',
    name: 'DigitalDreamer',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29329?w=100&h=100&fit=crop&crop=faces',
    bio: 'Creating unique digital experiences',
    followers: 856,
    following: 23,
    isFollowing: true,
    isVerified: false,
    lastActive: '1 hour ago'
  }
]

const mockPosts = [
  {
    id: '1',
    author: mockUsers[0],
    content: 'Just minted my latest NFT collection! Check out "Cosmic Dreams" on NexusVerse 🚀✨',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&h=400&fit=crop&crop=center&q=80',
    likes: 127,
    comments: 23,
    shares: 8,
    timestamp: '2 hours ago',
    isLiked: false,
    isBookmarked: false
  },
  {
    id: '2',
    author: mockUsers[1],
    content: 'Excited to announce my collaboration with @CryptoCreator! Something amazing is coming... 👀',
    image: null,
    likes: 89,
    comments: 15,
    shares: 12,
    timestamp: '4 hours ago',
    isLiked: true,
    isBookmarked: false
  }
]

export default function SocialPage() {
  const [users, setUsers] = useState(mockUsers)
  const [posts, setPosts] = useState(mockPosts)
  const [activeTab, setActiveTab] = useState('feed')
  const [newPost, setNewPost] = useState('')

  const handleFollow = (userId: string) => {
    setUsers(prevUsers => 
      prevUsers.map(user => 
        user.id === userId 
          ? { ...user, isFollowing: !user.isFollowing, followers: user.isFollowing ? user.followers - 1 : user.followers + 1 }
          : user
      )
    )
    
    const user = users.find(u => u.id === userId)
    toast.success(user?.isFollowing ? `Unfollowed ${user.name}` : `Following ${user?.name}`)
  }

  const handleLike = (postId: string) => {
    setPosts(prevPosts => 
      prevPosts.map(post => 
        post.id === postId 
          ? { ...post, isLiked: !post.isLiked, likes: post.isLiked ? post.likes - 1 : post.likes + 1 }
          : post
      )
    )
  }

  const handleCreatePost = () => {
    if (!newPost.trim()) return

    const newPostObj = {
      id: Date.now().toString(),
      author: mockUsers[0],
      content: newPost,
      image: null,
      likes: 0,
      comments: 0,
      shares: 0,
      timestamp: 'Just now',
      isLiked: false,
      isBookmarked: false
    }

    setPosts(prev => [newPostObj, ...prev])
    setNewPost('')
    toast.success('Post created successfully!')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-blue-900 py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gradient mb-4">NexusVerse Social</h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            Connect with creators, share your work, and discover amazing NFTs
          </p>
        </motion.div>

        {/* Navigation Tabs */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center mb-8"
        >
          <div className="flex bg-white dark:bg-slate-800 rounded-xl p-1 shadow-lg">
            {['feed', 'discover', 'following'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === tab
                    ? 'bg-gradient-to-r from-primary-600 to-secondary-600 text-white shadow-lg'
                    : 'text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Create Post */}
            <div className="card">
              <div className="flex items-start space-x-3">
                <Image
                  src={mockUsers[0].avatar}
                  alt={mockUsers[0].name}
                  width={48}
                  height={48}
                  className="rounded-full"
                />
                <div className="flex-1">
                  <textarea
                    value={newPost}
                    onChange={(e) => setNewPost(e.target.value)}
                    placeholder="What's on your mind?"
                    className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-xl resize-none focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                    rows={3}
                  />
                  <div className="flex justify-between items-center mt-3">
                    <div className="flex space-x-2">
                      <button className="p-2 text-gray-500 hover:text-primary-600 transition-colors">
                        <FireIcon className="h-5 w-5" />
                      </button>
                    </div>
                    <button
                      onClick={handleCreatePost}
                      disabled={!newPost.trim()}
                      className="btn-primary px-6 py-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Post
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Following */}
            <div className="card">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <UsersIcon className="h-5 w-5 mr-2" />
                Following
              </h3>
              <div className="space-y-3">
                {users.filter(user => user.isFollowing).map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-700 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Image
                        src={user.avatar}
                        alt={user.name}
                        width={40}
                        height={40}
                        className="rounded-full"
                      />
                      <div>
                        <p className="font-medium text-sm">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.lastActive}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleFollow(user.id)}
                      className="text-xs text-red-500 hover:text-red-700 transition-colors"
                    >
                      Unfollow
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2 space-y-6"
          >
            {posts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="card"
              >
                {/* Post Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <Image
                      src={post.author.avatar}
                      alt={post.author.name}
                      width={48}
                      height={48}
                      className="rounded-full"
                    />
                    <div>
                      <div className="flex items-center space-x-2">
                        <p className="font-semibold">{post.author.name}</p>
                        {post.author.isVerified && (
                          <StarIcon className="h-4 w-4 text-blue-500" />
                        )}
                      </div>
                      <p className="text-sm text-gray-500">{post.timestamp}</p>
                    </div>
                  </div>
                  <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                    <EllipsisHorizontalIcon className="h-5 w-5" />
                  </button>
                </div>

                {/* Post Content */}
                <p className="text-gray-800 dark:text-gray-200 mb-4">{post.content}</p>
                
                {post.image && (
                  <div className="mb-4">
                    <Image
                      src={post.image}
                      alt="Post image"
                      width={600}
                      height={400}
                      className="rounded-xl w-full"
                    />
                  </div>
                )}

                {/* Post Stats */}
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex space-x-4">
                    <span>{post.likes} likes</span>
                    <span>{post.comments} comments</span>
                    <span>{post.shares} shares</span>
                  </div>
                </div>

                {/* Post Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-600">
                  <button
                    onClick={() => handleLike(post.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                      post.isLiked
                        ? 'text-red-500 bg-red-50 dark:bg-red-900/20'
                        : 'text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20'
                    }`}
                  >
                    {post.isLiked ? (
                      <HeartIconSolid className="h-5 w-5" />
                    ) : (
                      <HeartIcon className="h-5 w-5" />
                    )}
                    <span>Like</span>
                  </button>

                  <button className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-500 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
                    <ChatBubbleLeftIcon className="h-5 w-5" />
                    <span>Comment</span>
                  </button>

                  <button className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-500 hover:text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors">
                    <ShareIcon className="h-5 w-5" />
                    <span>Share</span>
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
