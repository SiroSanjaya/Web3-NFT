'use client'

import React, { Component, ErrorInfo, ReactNode } from 'react'
import { motion } from 'framer-motion'
import { ExclamationTriangleIcon, ArrowPathIcon } from '@heroicons/react/24/outline'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo,
    })

    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error caught by boundary:', error, errorInfo)
    }

    // TODO: Send error to logging service in production
    // logErrorToService(error, errorInfo)
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null })
  }

  handleReportError = () => {
    const { error, errorInfo } = this.state
    if (error && errorInfo) {
      // TODO: Implement error reporting to service
      console.log('Reporting error:', { error, errorInfo })
      
      // Example: Send to error reporting service
      // reportError({
      //   message: error.message,
      //   stack: error.stack,
      //   componentStack: errorInfo.componentStack,
      //   timestamp: new Date().toISOString(),
      //   userAgent: navigator.userAgent,
      //   url: window.location.href,
      // })
    }
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md w-full mx-4 text-center"
          >
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-red-200 dark:border-red-700">
              <div className="w-16 h-16 mx-auto mb-6 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                <ExclamationTriangleIcon className="w-8 h-8 text-red-600 dark:text-red-400" />
              </div>
              
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Oops! Something went wrong
              </h1>
              
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                We encountered an unexpected error. Don't worry, our team has been notified.
              </p>

              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="text-left mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <summary className="cursor-pointer text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Error Details (Development)
                  </summary>
                  <div className="text-xs text-gray-600 dark:text-gray-400 space-y-2">
                    <div>
                      <strong>Message:</strong> {this.state.error.message}
                    </div>
                    <div>
                      <strong>Stack:</strong>
                      <pre className="whitespace-pre-wrap break-words">
                        {this.state.error.stack}
                      </pre>
                    </div>
                    {this.state.errorInfo && (
                      <div>
                        <strong>Component Stack:</strong>
                        <pre className="whitespace-pre-wrap break-words">
                          {this.state.errorInfo.componentStack}
                        </pre>
                      </div>
                    )}
                  </div>
                </details>
              )}

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={this.handleRetry}
                  className="flex-1 flex items-center justify-center px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors"
                >
                  <ArrowPathIcon className="w-4 h-4 mr-2" />
                  Try Again
                </button>
                
                <button
                  onClick={this.handleReportError}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Report Issue
                </button>
              </div>

              <div className="mt-6 text-xs text-gray-500 dark:text-gray-400">
                <p>Error ID: {Date.now().toString(36)}</p>
                <p>Time: {new Date().toLocaleString()}</p>
              </div>
            </div>
          </motion.div>
        </div>
      )
    }

    return this.props.children
  }
}

// Hook for functional components
export const useErrorHandler = () => {
  const handleError = (error: Error, errorInfo?: any) => {
    // Log error
    console.error('Error caught by hook:', error, errorInfo)
    
    // TODO: Send to error reporting service
    // reportError(error, errorInfo)
    
    // Show user-friendly notification
    // toast.error('Something went wrong. Please try again.')
  }

  return { handleError }
}

// Higher-order component for error boundaries
export const withErrorBoundary = <P extends object>(
  Component: React.ComponentType<P>,
  fallback?: ReactNode
) => {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary fallback={fallback}>
      <Component {...props} />
    </ErrorBoundary>
  )
  
  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`
  
  return WrappedComponent
}


