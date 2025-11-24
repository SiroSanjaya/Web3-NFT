import { z } from 'zod'

// User validation schemas
export const userSchema = z.object({
  username: z.string().min(3).max(30).regex(/^[a-zA-Z0-9_]+$/),
  email: z.string().email(),
  password: z.string().min(8).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, "Password is required"),
})

export const profileUpdateSchema = z.object({
  username: z.string().min(3).max(30).optional(),
  bio: z.string().max(500).optional(),
  avatar: z.string().url().optional(),
  socialLinks: z.object({
    twitter: z.string().url().optional(),
    discord: z.string().optional(),
    website: z.string().url().optional(),
  }).optional(),
})

// NFT validation schemas
export const nftMintSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().min(1).max(1000),
  image: z.string().url(),
  attributes: z.array(z.object({
    trait_type: z.string().min(1),
    value: z.string().min(1),
  })).optional(),
  collection: z.string().min(1),
  price: z.number().positive(),
  royalty: z.number().min(0).max(50),
})

export const nftUpdateSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().min(1).max(1000).optional(),
  price: z.number().positive().optional(),
  isForSale: z.boolean().optional(),
})

// Collection validation schemas
export const collectionSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().min(1).max(1000),
  image: z.string().url(),
  banner: z.string().url().optional(),
  category: z.string().min(1),
  royalty: z.number().min(0).max(50),
  isVerified: z.boolean().default(false),
})

// Search and filter schemas
export const searchFiltersSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  category: z.string().optional(),
  collection: z.string().optional(),
  minPrice: z.number().min(0).optional(),
  maxPrice: z.number().min(0).optional(),
  rarity: z.string().optional(),
  attributes: z.array(z.object({
    trait: z.string(),
    value: z.string(),
  })).optional(),
  sortBy: z.enum(['newest', 'oldest', 'price-low', 'price-high', 'trending', 'random']),
  onSale: z.boolean().optional(),
  hasOffers: z.boolean().optional(),
})

// Auction validation schemas
export const auctionSchema = z.object({
  nftId: z.string().min(1),
  startingPrice: z.number().positive(),
  reservePrice: z.number().positive().optional(),
  duration: z.number().min(300).max(604800), // 5 minutes to 7 days
  description: z.string().max(500).optional(),
})

export const bidSchema = z.object({
  auctionId: z.string().min(1),
  amount: z.number().positive(),
})

// Staking validation schemas
export const stakingSchema = z.object({
  nftId: z.string().min(1),
  duration: z.enum(['30', '90', '180', '365']),
  pool: z.enum(['bronze', 'silver', 'gold', 'diamond']),
})

// Chat validation schemas
export const messageSchema = z.object({
  content: z.string().min(1).max(1000),
  recipientId: z.string().min(1),
  type: z.enum(['text', 'image', 'file']).default('text'),
})

// Admin validation schemas
export const adminActionSchema = z.object({
  action: z.enum(['ban', 'unban', 'verify', 'unverify', 'delete']),
  userId: z.string().min(1),
  reason: z.string().min(1).max(500).optional(),
})

// Rate limiting schemas
export const rateLimitSchema = z.object({
  windowMs: z.number().min(1000),
  max: z.number().min(1),
  message: z.string().optional(),
})

// Export types
export type UserInput = z.infer<typeof userSchema>
export type LoginInput = z.infer<typeof loginSchema>
export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>
export type NFTMintInput = z.infer<typeof nftMintSchema>
export type NFTUpdateInput = z.infer<typeof nftUpdateSchema>
export type CollectionInput = z.infer<typeof collectionSchema>
export type SearchFilters = z.infer<typeof searchFiltersSchema>
export type AuctionInput = z.infer<typeof auctionSchema>
export type BidInput = z.infer<typeof bidSchema>
export type StakingInput = z.infer<typeof stakingSchema>
export type MessageInput = z.infer<typeof messageSchema>
export type AdminActionInput = z.infer<typeof adminActionSchema>
export type RateLimitInput = z.infer<typeof rateLimitSchema>


