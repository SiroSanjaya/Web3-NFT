'use client'

import { motion } from 'framer-motion'
import { SparklesIcon } from '@heroicons/react/24/outline'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
  showText?: boolean
  className?: string
}

export default function Logo({ size = 'md', showText = true, className = '' }: LogoProps) {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  }

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl'
  }

  return (
    <motion.div 
      className={`flex items-center ${className}`}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Logo Icon */}
      <div className="relative">
        <div className={`${sizeClasses[size]} bg-gradient-to-br from-primary-600 to-secondary-600 rounded-xl flex items-center justify-center shadow-lg`}>
          <SparklesIcon className="h-1/2 w-1/2 text-white" />
        </div>
        {/* Glow effect */}
        <div className={`absolute inset-0 ${sizeClasses[size]} bg-gradient-to-br from-primary-400 to-secondary-400 rounded-xl blur-lg opacity-30`}></div>
      </div>
      
      {/* Brand Text */}
      {showText && (
        <motion.div 
          className={`ml-3 font-bold ${textSizes[size]} bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent`}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          NexusVerse
        </motion.div>
      )}
    </motion.div>
  )
}

