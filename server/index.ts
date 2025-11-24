import express, { Request, Response, NextFunction } from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import morgan from 'morgan'
import helmet from 'helmet'
import cors from 'cors'
import rateLimit from 'express-rate-limit'
import { stream } from '../utils/logger'
import { log } from '../utils/logger'
import { PrismaClient } from '@prisma/client'
import { config } from 'dotenv'

// Load environment variables
config()

const app = express()
const server = createServer(app)
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
})

// Initialize Prisma
const prisma = new PrismaClient()

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:", "blob:"],
      scriptSrc: ["'self'"],
      connectSrc: ["'self'", "ws:", "wss:"],
    },
  }
}))

// CORS configuration
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:3000',
    process.env.MOBILE_APP_URL,
  ].filter(Boolean),
  credentials: true
}))

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false // Disable the `X-RateLimit-*` headers
})

// Apply rate limiter to all routes
app.use(limiter)

// Body parsing middleware
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Logging middleware
app.use(morgan('combined', { stream }))

// Request logging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  const start = Date.now()
  res.on('finish', () => {
    const duration = Date.now() - start
    log.info({
      message: 'Request completed',
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      duration,
      userId: req.user?.id
    })
  })
  next()
})

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
    version: process.env.npm_package_version || '1.0.0',
  })
})

// API routes
import authRoutes from './routes/auth'
import userRoutes from './routes/users'
import nftRoutes from './routes/nfts'
import collectionRoutes from './routes/collections'
import marketplaceRoutes from './routes/marketplace'
import stakingRoutes from './routes/staking'
import adminRoutes from './routes/admin'
import analyticsRoutes from './routes/analytics'

app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/nfts', nftRoutes)
app.use('/api/collections', collectionRoutes)
app.use('/api/marketplace', marketplaceRoutes)
app.use('/api/staking', stakingRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/analytics', analyticsRoutes)

// Socket.IO connection handling
io.on('connection', (socket) => {
  log.info({
    message: 'User connected',
    socketId: socket.id
  })

  socket.on('join_room', (room) => {
    socket.join(room)
    log.info({
      message: 'User joined room',
      socketId: socket.id,
      room
    })
  })

  socket.on('leave_room', (room) => {
    socket.leave(room)
    log.info({
      message: 'User left room',
      socketId: socket.id,
      room
    })
  })

  socket.on('disconnect', () => {
    log.info({
      message: 'User disconnected',
      socketId: socket.id
    })
  })
})

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  log.error({
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    userId: req.user?.id,
    statusCode: err.status || 500
  });

  res.status(err.status || 500).json({
    error: process.env.NODE_ENV === 'production' ? 'Internal Server Error' : err.message
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.originalUrl} not found`,
  })
})

// Graceful shutdown
const gracefulShutdown = async (signal: string) => {
  log.info(`Received ${signal}. Starting graceful shutdown...`)
  
  server.close(() => {
    log.info('HTTP server closed')
    
    prisma.$disconnect().then(() => {
      log.info('Database connection closed')
      process.exit(0)
    })
  })
  
  // Force close after 30 seconds
  setTimeout(() => {
    log.error('Forced shutdown after timeout')
    process.exit(1)
  }, 30000)
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'))
process.on('SIGINT', () => gracefulShutdown('SIGINT'))

// Unhandled promise rejection handler
process.on('unhandledRejection', (reason, promise) => {
  log.error({
    message: 'Unhandled Rejection',
    reason: reason instanceof Error ? reason.stack : reason,
    promise
  })
  process.exit(1)
})

// Uncaught exception handler
process.on('uncaughtException', (error) => {
  log.error({
    message: 'Uncaught Exception',
    error: error instanceof Error ? error.stack : error
  })
  process.exit(1)
})

// Start server
const PORT = process.env.PORT || 5000

server.listen(PORT, () => {
  log.info({
    message: `Server running on port ${PORT}`,
    port: PORT,
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString()
  })
})

export { app, server, io, prisma }


