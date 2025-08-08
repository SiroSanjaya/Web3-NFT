'use client'

import { useState } from 'react'
import { useAccount } from 'wagmi'
import { motion } from 'framer-motion'
import { 
  ChatBubbleLeftRightIcon,
  PaperAirplaneIcon,
  XMarkIcon,
  UserIcon
} from '@heroicons/react/24/outline'

interface Message {
  id: string
  sender: string
  content: string
  timestamp: Date
}

interface ChatIntegrationProps {
  nftId: string
  sellerId: string
  isOpen: boolean
  onClose: () => void
}

export default function ChatIntegration({ nftId, sellerId, isOpen, onClose }: ChatIntegrationProps) {
  const { address } = useAccount()
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: sellerId,
      content: 'Hi! I saw you\'re interested in this NFT. Any questions?',
      timestamp: new Date(Date.now() - 5 * 60 * 1000)
    }
  ])
  const [newMessage, setNewMessage] = useState('')

  const handleSendMessage = () => {
    if (!newMessage.trim() || !address) return

    const message: Message = {
      id: Date.now().toString(),
      sender: address,
      content: newMessage,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, message])
    setNewMessage('')

    // Simulate seller response
    setTimeout(() => {
      const response: Message = {
        id: (Date.now() + 1).toString(),
        sender: sellerId,
        content: 'Thanks for your message! I\'ll get back to you soon.',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, response])
    }, 2000)
  }

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  if (!isOpen) return null

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed bottom-4 right-4 w-80 h-96 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 z-50"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
            <UserIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">Chat</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {formatAddress(sellerId)}
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
        >
          <XMarkIcon className="h-5 w-5 text-gray-500" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 space-y-3 overflow-y-auto h-64">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === address ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs px-3 py-2 rounded-lg ${
                message.sender === address
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
              }`}
            >
              <p className="text-sm">{message.content}</p>
              <p className="text-xs opacity-70 mt-1">
                {message.timestamp.toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Type your message..."
            className="flex-1 input-field"
          />
          <button
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            className="btn-primary p-2"
          >
            <PaperAirplaneIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
    </motion.div>
  )
}
