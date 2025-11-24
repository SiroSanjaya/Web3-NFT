'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  PaperAirplaneIcon, SparklesIcon, CpuChipIcon, LightBulbIcon,
  CurrencyDollarIcon, ChartBarIcon, FireIcon, StarIcon
} from '@heroicons/react/24/outline'
import { v4 as uuidv4 } from 'uuid';

interface Message {
  id: string
  text: string
  sender: 'user' | 'ai'
  timestamp: Date
  type?: 'text' | 'suggestion' | 'analysis'
  suggestions?: string[]
  analysis?: {
    sentiment: 'positive' | 'negative' | 'neutral'
    confidence: number
    recommendations: string[]
  }
}

interface AnalysisResponse {
  text: string;
  type: 'analysis';
  analysis: {
    sentiment: 'positive' | 'negative' | 'neutral';
    confidence: number;
    recommendations: string[];
  };
}

interface SuggestionResponse {
  text: string;
  type: 'suggestion';
  suggestions: string[];
}

type ResponseType = AnalysisResponse | SuggestionResponse;

const quickQuestions = [
  "What's the best time to buy NFTs?",
  "How do I analyze NFT rarity?",
  "Which categories are trending?",
  "What's your price prediction for this NFT?",
  "How do I avoid NFT scams?",
  "What's the difference between ERC-721 and ERC-1155?"
]

const aiResponses = {
  "What's the best time to buy NFTs?": {
    text: "The best time to buy NFTs typically depends on market cycles. Generally, buying during bear markets or when there's less hype can be advantageous. Look for:\n\n• Projects with strong fundamentals\n• Active communities\n• Clear utility or roadmap\n• Reasonable floor prices\n\nI recommend doing your own research and never investing more than you can afford to lose.",
    type: 'analysis' as const,
    analysis: {
      sentiment: 'positive' as const,
      confidence: 85,
      recommendations: [
        "Monitor market sentiment indicators",
        "Set price alerts for your target NFTs",
        "Diversify across different categories",
        "Consider dollar-cost averaging"
      ]
    }
  },
  "How do I analyze NFT rarity?": {
    text: "NFT rarity analysis involves several factors:\n\n• **Trait Analysis**: Check the rarity of individual traits\n• **Statistical Analysis**: Look at trait combinations\n• **Market Demand**: Consider community preferences\n• **Historical Data**: Analyze past sales of similar items\n\nUse rarity tools like Rarity.tools or NFTGo for detailed analysis.",
    type: 'suggestion' as const,
    suggestions: [
      "Use rarity calculators",
      "Check trait distribution",
      "Analyze community sentiment",
      "Review historical sales data"
    ]
  },
  "Which categories are trending?": {
    text: "Currently trending NFT categories include:\n\n🔥 **Gaming NFTs**: Play-to-earn games and metaverse assets\n🎨 **AI-Generated Art**: Unique AI-created artworks\n🎵 **Music NFTs**: Exclusive tracks and artist collaborations\n🏀 **Sports NFTs**: Trading cards and collectibles\n\nGaming NFTs are showing the strongest growth with +25% volume increase this month.",
    type: 'analysis' as const,
    analysis: {
      sentiment: 'positive' as const,
      confidence: 92,
      recommendations: [
        "Focus on gaming and AI art categories",
        "Look for projects with strong communities",
        "Consider utility over aesthetics",
        "Monitor emerging trends"
      ]
    }
  }
}

export default function AIChatAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm your AI NFT assistant. I can help you with market analysis, price predictions, rarity assessment, and general NFT advice. What would you like to know?",
      sender: 'ai',
      timestamp: new Date(),
      type: 'text'
    }
  ])
  const [inputText, setInputText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [error, setError] = useState<string | null>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return
    setError(null)
    const userMessage: Message = {
      id: Date.now().toString(),
      text: text.trim(),
      sender: 'user',
      timestamp: new Date(),
      type: 'text'
    }
    setMessages(prev => [...prev, userMessage])
    setInputText('')
    setIsTyping(true)
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Gagal mendapatkan respons AI')
      
      let messageText = data.response
      if (data.note) {
        messageText += `\n\n💡 **Note**: ${data.note}`
      }
      
      const aiMessage: Message = {
        id: Date.now().toString() + '-ai',
        text: messageText,
        sender: 'ai',
        timestamp: new Date(),
        type: 'text'
      }
      setMessages(prev => [...prev, aiMessage])
    } catch (err: any) {
      setError(err.message)
      setMessages(prev => [...prev, {
        id: Date.now().toString() + '-err',
        text: err.message,
        sender: 'ai',
        timestamp: new Date(),
        type: 'text'
      }])
    } finally {
      setIsTyping(false)
    }
  }

  const generateAIResponse = (userInput: string): Message => {
    const lowerInput = userInput.toLowerCase()
    
    // Check for predefined responses
    for (const [question, response] of Object.entries(aiResponses)) {
      if (lowerInput.includes(question.toLowerCase().replace("'", ""))) {
        return {
          id: Date.now().toString(),
          text: response.text,
          sender: 'ai',
          timestamp: new Date(),
          type: response.type,
          ...(response.type === 'suggestion' 
            ? { suggestions: (response as SuggestionResponse).suggestions } 
            : { analysis: (response as AnalysisResponse).analysis })
        }
      }
    }

    // Generate generic response
    const genericResponses = [
      "That's an interesting question about NFTs! Based on current market data, I'd recommend doing thorough research and considering the project's fundamentals.",
      "Great question! The NFT market is constantly evolving. I suggest looking at historical data and community engagement to make informed decisions.",
      "Thanks for asking! For NFT investments, always consider the team behind the project, community strength, and long-term utility."
    ]

    return {
      id: Date.now().toString(),
      text: genericResponses[Math.floor(Math.random() * genericResponses.length)],
      sender: 'ai',
      timestamp: new Date(),
      type: 'text'
    }
  }

  const handleQuickQuestion = (question: string) => {
    handleSendMessage(question)
  }

  return (
    <div className="flex flex-col h-[600px] bg-white dark:bg-slate-800 rounded-xl shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
            <CpuChipIcon className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">AI NFT Assistant</h3>
            <p className="text-sm text-gray-500">Powered by AI</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-green-600">Online</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[80%] ${message.sender === 'user' ? 'order-2' : 'order-1'}`}>
                <div className={`p-3 rounded-lg ${
                  message.sender === 'user'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 dark:bg-slate-700 text-gray-900 dark:text-white'
                }`}>
                  <div className="whitespace-pre-line">{message.text}</div>
                  
                  {/* Suggestions */}
                  {message.suggestions && (
                    <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                      <p className="text-sm font-medium mb-2 flex items-center">
                        <LightBulbIcon className="h-4 w-4 mr-1" />
                        Quick Actions:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {message.suggestions.map((suggestion, index) => (
                          <button
                            key={index}
                            onClick={() => handleQuickQuestion(suggestion)}
                            className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Analysis */}
                  {message.analysis && (
                    <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-medium flex items-center">
                          <ChartBarIcon className="h-4 w-4 mr-1" />
                          Analysis:
                        </p>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          message.analysis.sentiment === 'positive' ? 'bg-green-100 text-green-700' :
                          message.analysis.sentiment === 'negative' ? 'bg-red-100 text-red-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {message.analysis.confidence}% confidence
                        </span>
                      </div>
                      <div className="space-y-1">
                        {message.analysis.recommendations.map((rec, index) => (
                          <div key={index} className="text-xs flex items-start space-x-2">
                            <StarIcon className="h-3 w-3 text-yellow-500 mt-0.5 flex-shrink-0" />
                            <span>{rec}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {message.timestamp.toLocaleTimeString()}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing Indicator */}
        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="bg-gray-100 dark:bg-slate-700 p-3 rounded-lg">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </motion.div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="bg-red-100 dark:bg-red-900 p-3 rounded-lg text-red-800 dark:text-red-200">
              <p className="text-sm">{error}</p>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Questions */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Quick Questions:</p>
        <div className="flex flex-wrap gap-2">
          {quickQuestions.map((question, index) => (
            <button
              key={index}
              onClick={() => handleQuickQuestion(question)}
              className="text-xs bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-full hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors"
            >
              {question}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex space-x-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(inputText)}
            placeholder="Ask me about NFTs, market analysis, or price predictions..."
            className="flex-1 input-field"
            disabled={isTyping}
          />
          <button
            onClick={() => handleSendMessage(inputText)}
            disabled={isTyping || !inputText.trim()}
            className="btn-primary px-4 py-2 disabled:opacity-50"
          >
            <PaperAirplaneIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  )
}
