'use client'

import { useState, useEffect } from 'react'
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline'
import { motion } from 'framer-motion'

export default function DarkModeToggle() {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    // Check if user has a preference stored
    const stored = localStorage.getItem('darkMode')
    if (stored) {
      setIsDark(JSON.parse(stored))
    } else {
      // Check system preference
      setIsDark(window.matchMedia('(prefers-color-scheme: dark)').matches)
    }
  }, [])

  useEffect(() => {
    // Apply dark mode to document
    if (isDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    // Store preference
    localStorage.setItem('darkMode', JSON.stringify(isDark))
  }, [isDark])

  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={() => setIsDark(!isDark)}
      className="relative p-2 rounded-full bg-gray-200 dark:bg-gray-700 transition-colors duration-200"
      aria-label="Toggle dark mode"
    >
      <motion.div
        initial={false}
        animate={{ rotate: isDark ? 180 : 0 }}
        transition={{ duration: 0.3 }}
      >
        {isDark ? (
          <MoonIcon className="h-5 w-5 text-gray-700 dark:text-gray-200" />
        ) : (
          <SunIcon className="h-5 w-5 text-gray-700 dark:text-gray-200" />
        )}
      </motion.div>
    </motion.button>
  )
}
