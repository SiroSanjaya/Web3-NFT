'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAccount } from 'wagmi'
import { 
  ChatBubbleLeftRightIcon,
  PaperAirplaneIcon,
  XMarkIcon,
  UserIcon,
  PhotoIcon,
  EllipsisVerticalIcon,
  MinusIcon,
  PlusIcon
} from '@heroicons/react/24/outline'
import Image from 'next/image'

interface Message {
  id: string
  senderId: string
  senderName: string
  senderAvatar?: string
  content: string
  timestamp: Date
  type: 'text' | 'image' | 'offer' | 'system'
  attachments?: Array<{
    url: string
    type: 'image' | 'file'
    name: string
  }>
}

interface ChatRoom {
  id: string
  participants: Array<{
    address: string
    name: string
    avatar?: string
    isOnline: boolean
  }>
  nft?: {
    tokenId: string
    name: string
    image: string
    price: string
  }
  lastMessage?: Message
  unreadCount: number
}

interface ChatSystemProps {
  nftId?: string
  sellerId?: string
  isOpen: boolean
  onClose: () => void
}

export default function ChatSystem({ nftId, sellerId, isOpen, onClose }: ChatSystemProps) {
  const { address } = useAccount()
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([])
  const [selectedRoom, setSelectedRoom] = useState<ChatRoom | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [isMinimized, setIsMinimized] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Mock data
  const mockChatRooms: ChatRoom[] = [
    {
      id: '1',
      participants: [
        { 
          address: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6', 
          name: 'John Doe', 
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=center&q=80',
          isOnline: true 
        },
        { 
          address: address || '', 
          name: 'You', 
          isOnline: true 
        }
      ],
      nft: {
        tokenId: '1',
        name: 'Cosmic Explorer #1',
        image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=60&h=60&fit=crop&crop=center&q=80',
        price: '0.05'
      },
      lastMessage: {
        id: '1',
        senderId: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
        senderName: 'John Doe',
        content: 'Would you consider 0.04 ETH for this piece?',
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
        type: 'text'
      },
      unreadCount: 2
    },
    {
      id: '2',
      participants: [
        { 
          address: '0x456d35Cc6634C0532925a3b8D4C9db96C4b4d456', 
          name: 'Alice Smith', 
          avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b5c1?w=40&h=40&fit=crop&crop=center&q=80',
          isOnline: false 
        },
        { 
          address: address || '', 
          name: 'You', 
          isOnline: true 
        }
      ],
      nft: {
        tokenId: '2',
        name: 'Digital Dreams #2',
        image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=60&h=60&fit=crop&crop=center&q=80',
        price: '0.08'
      },
      lastMessage: {
        id: '2',
        senderId: address || '',
        senderName: 'You',
        content: 'Thanks for your interest!',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        type: 'text'
      },
      unreadCount: 0
    }
  ]

  const mockMessages: Message[] = [
    {
      id: '1',
      senderId: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
      senderName: 'John Doe',
      senderAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=center&q=80',
      content: 'Hi! I\'m interested in your Cosmic Explorer NFT.',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      type: 'text'
    },
    {
      id: '2',
      senderId: address || '',
      senderName: 'You',
      content: 'Hello! Thank you for your interest. What would you like to know about it?',
      timestamp: new Date(Date.now() - 25 * 60 * 1000),
      type: 'text'
    },
    {
      id: '3',
      senderId: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
      senderName: 'John Doe',
      senderAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=center&q=80',
      content: 'Would you consider 0.04 ETH for this piece?',
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      type: 'text'
    }
  ]

  useEffect(() => {
    if (isOpen) {
      setChatRooms(mockChatRooms)
      if (mockChatRooms.length > 0) {
        setSelectedRoom(mockChatRooms[0])
        setMessages(mockMessages)
      }
    }
  }, [isOpen])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedRoom || !address) return

    const message: Message = {
      id: Date.now().toString(),
      senderId: address,
      senderName: 'You',
      content: newMessage,
      timestamp: new Date(),
      type: 'text'
    }

    setMessages(prev => [...prev, message])
    setNewMessage('')

    // Simulate typing indicator
    setIsTyping(true)
    setTimeout(() => {
      setIsTyping(false)
      // Simulate response
      const response: Message = {
        id: (Date.now() + 1).toString(),
        senderId: selectedRoom.participants[0].address,
        senderName: selectedRoom.participants[0].name,
        senderAvatar: selectedRoom.participants[0].avatar,
        content: 'Thanks for your message! Let me think about it.',
        timestamp: new Date(),
        type: 'text'
      }
      setMessages(prev => [...prev, response])
    }, 2000)
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    })
  }

  const formatLastSeen = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)

    if (days > 0) return `${days}d ago`
    if (hours > 0) return `${hours}h ago`
    if (minutes > 0) return `${minutes}m ago`
    return 'Just now'
  }

  const MessageBubble = ({ message }: { message: Message }) => {
    const isOwnMessage = message.senderId === address

    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-4`}
      >
        <div className={`flex items-end space-x-2 max-w-xs lg:max-w-md ${isOwnMessage ? 'flex-row-reverse space-x-reverse' : ''}`}>
          {!isOwnMessage && (
            <div className="w-6 h-6 rounded-full overflow-hidden bg-gray-300">
              {message.senderAvatar ? (
                <Image
                  src={message.senderAvatar}
                  alt={message.senderName}
                  width={24}
                  height={24}
                  className="object-cover"
                />
              ) : (
                <UserIcon className="h-4 w-4 text-gray-500 m-1" />
              )}
            </div>
          )}
          
          <div className={`rounded-2xl px-4 py-2 ${
            isOwnMessage 
              ? 'bg-primary-600 text-white' 
              : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
          }`}>
            <p className="text-sm">{message.content}</p>
            <p className={`text-xs mt-1 ${
              isOwnMessage ? 'text-primary-100' : 'text-gray-500 dark:text-gray-400'
            }`}>
              {formatTime(message.timestamp)}
            </p>
          </div>
        </div>
      </motion.div>
    )
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="fixed bottom-4 right-4 z-50"
      >
        <div className={`bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden ${
          isMinimized ? 'w-80 h-16' : 'w-96 h-[600px]'
        } transition-all duration-300`}>
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
            <div className="flex items-center space-x-3">
              <ChatBubbleLeftRightIcon className="h-5 w-5 text-primary-600" />
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                  {selectedRoom ? `Chat with ${selectedRoom.participants[0].name}` : 'Messages'}
                </h3>
                {selectedRoom?.participants[0].isOnline && (
                  <p className="text-xs text-green-600">Online</p>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
              >
                {isMinimized ? (
                  <PlusIcon className="h-4 w-4 text-gray-500" />
                ) : (
                  <MinusIcon className="h-4 w-4 text-gray-500" />
                )}
              </button>
              <button
                onClick={onClose}
                className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
              >
                <XMarkIcon className="h-4 w-4 text-gray-500" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Chat Rooms List */}
              {!selectedRoom ? (
                <div className="flex-1 p-4">
                  <div className="space-y-3">
                    {chatRooms.map((room) => (
                      <motion.div
                        key={room.id}
                        whileHover={{ scale: 1.02 }}
                        onClick={() => setSelectedRoom(room)}
                        className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                      >
                        <div className="relative">
                          <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-300">
                            {room.participants[0].avatar ? (
                              <Image
                                src={room.participants[0].avatar}
                                alt={room.participants[0].name}
                                width={40}
                                height={40}
                                className="object-cover"
                              />
                            ) : (
                              <UserIcon className="h-6 w-6 text-gray-500 m-2" />
                            )}
                          </div>
                          {room.participants[0].isOnline && (
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                          )}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                              {room.participants[0].name}
                            </p>
                            {room.unreadCount > 0 && (
                              <span className="bg-primary-600 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                                {room.unreadCount}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                            {room.lastMessage?.content}
                          </p>
                          {room.nft && (
                            <div className="flex items-center space-x-2 mt-2">
                              <Image
                                src={room.nft.image}
                                alt={room.nft.name}
                                width={20}
                                height={20}
                                className="rounded object-cover"
                              />
                              <span className="text-xs text-gray-600 dark:text-gray-400">
                                {room.nft.name}
                              </span>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              ) : (
                <>
                  {/* NFT Info */}
                  {selectedRoom.nft && (
                    <div className="p-4 bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
                      <div className="flex items-center space-x-3">
                        <Image
                          src={selectedRoom.nft.image}
                          alt={selectedRoom.nft.name}
                          width={40}
                          height={40}
                          className="rounded-lg object-cover"
                        />
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white text-sm">
                            {selectedRoom.nft.name}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {selectedRoom.nft.price} ETH
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Messages */}
                  <div className="flex-1 p-4 overflow-y-auto max-h-96">
                    {messages.map((message) => (
                      <MessageBubble key={message.id} message={message} />
                    ))}
                    
                    {isTyping && (
                      <div className="flex justify-start mb-4">
                        <div className="bg-gray-100 dark:bg-gray-700 rounded-2xl px-4 py-2">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Message Input */}
                  <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                        <PhotoIcon className="h-5 w-5" />
                      </button>
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        placeholder="Type a message..."
                        className="flex-1 bg-gray-100 dark:bg-gray-700 border-0 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                      <button
                        onClick={handleSendMessage}
                        disabled={!newMessage.trim()}
                        className="p-2 bg-primary-600 text-white rounded-full hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <PaperAirplaneIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
