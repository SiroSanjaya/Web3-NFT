import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { devtools } from 'zustand/middleware'

// Types
interface User {
  id: string
  username: string
  email: string
  avatar?: string
  bio?: string
  walletAddress?: string
  isVerified: boolean
  createdAt: Date
}

interface NFT {
  id: string
  name: string
  description: string
  image: string
  price: number
  owner: string
  creator: string
  collection: string
  attributes: Array<{ trait_type: string; value: string }>
  isForSale: boolean
  tokenId: string
  createdAt: Date
}

interface Collection {
  id: string
  name: string
  description: string
  image: string
  banner?: string
  category: string
  creator: string
  isVerified: boolean
  nftCount: number
  floorPrice: number
  totalVolume: number
  createdAt: Date
}

interface Auction {
  id: string
  nftId: string
  startingPrice: number
  reservePrice?: number
  currentBid: number
  highestBidder: string
  endTime: Date
  isActive: boolean
  bids: Array<{
    bidder: string
    amount: number
    timestamp: Date
  }>
}

interface StakingPool {
  id: string
  name: string
  apy: number
  minDuration: number
  maxDuration: number
  totalStaked: number
  totalRewards: number
}

interface StakingPosition {
  id: string
  userId: string
  nftId: string
  poolId: string
  amount: number
  startDate: Date
  endDate: Date
  rewards: number
  isActive: boolean
}

// Store interfaces
interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  register: (userData: Partial<User>) => Promise<void>
  updateProfile: (data: Partial<User>) => Promise<void>
}

interface NFTState {
  nfts: NFT[]
  collections: Collection[]
  selectedNFT: NFT | null
  selectedCollection: Collection | null
  isLoading: boolean
  error: string | null
  fetchNFTs: () => Promise<void>
  fetchCollections: () => Promise<void>
  createNFT: (nftData: Partial<NFT>) => Promise<void>
  updateNFT: (id: string, data: Partial<NFT>) => Promise<void>
  deleteNFT: (id: string) => Promise<void>
}

interface MarketplaceState {
  auctions: Auction[]
  stakingPools: StakingPool[]
  userStakingPositions: StakingPosition[]
  isLoading: boolean
  error: string | null
  createAuction: (auctionData: Partial<Auction>) => Promise<void>
  placeBid: (auctionId: string, amount: number) => Promise<void>
  stakeNFT: (stakingData: Partial<StakingPosition>) => Promise<void>
  unstakeNFT: (positionId: string) => Promise<void>
  claimRewards: (positionId: string) => Promise<void>
}

interface UIState {
  theme: 'light' | 'dark'
  sidebarOpen: boolean
  searchModalOpen: boolean
  notificationModalOpen: boolean
  currentPage: string
  toggleTheme: () => void
  toggleSidebar: () => void
  toggleSearchModal: () => void
  toggleNotificationModal: () => void
  setCurrentPage: (page: string) => void
}

// Auth Store
export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set, get) => ({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
        login: async (email: string, password: string) => {
          set({ isLoading: true, error: null })
          try {
            // TODO: Implement actual API call
            const mockUser: User = {
              id: '1',
              username: 'testuser',
              email,
              isVerified: true,
              createdAt: new Date(),
            }
            set({ user: mockUser, isAuthenticated: true, isLoading: false })
          } catch (error) {
            set({ error: 'Login failed', isLoading: false })
          }
        },
        logout: () => {
          set({ user: null, isAuthenticated: false })
        },
        register: async (userData: Partial<User>) => {
          set({ isLoading: true, error: null })
          try {
            // TODO: Implement actual API call
            const mockUser: User = {
              id: '1',
              username: userData.username || 'newuser',
              email: userData.email || '',
              isVerified: false,
              createdAt: new Date(),
            }
            set({ user: mockUser, isAuthenticated: true, isLoading: false })
          } catch (error) {
            set({ error: 'Registration failed', isLoading: false })
          }
        },
        updateProfile: async (data: Partial<User>) => {
          const { user } = get()
          if (user) {
            set({ user: { ...user, ...data } })
          }
        },
      }),
      {
        name: 'auth-storage',
        storage: createJSONStorage(() => localStorage),
      }
    )
  )
)

// NFT Store
export const useNFTStore = create<NFTState>()(
  devtools(
    (set, get) => ({
      nfts: [],
      collections: [],
      selectedNFT: null,
      selectedCollection: null,
      isLoading: false,
      error: null,
      fetchNFTs: async () => {
        set({ isLoading: true })
        try {
          // TODO: Implement actual API call
          const mockNFTs: NFT[] = []
          set({ nfts: mockNFTs, isLoading: false })
        } catch (error) {
          set({ error: 'Failed to fetch NFTs', isLoading: false })
        }
      },
      fetchCollections: async () => {
        set({ isLoading: true })
        try {
          // TODO: Implement actual API call
          const mockCollections: Collection[] = []
          set({ collections: mockCollections, isLoading: false })
        } catch (error) {
          set({ error: 'Failed to fetch collections', isLoading: false })
        }
      },
      createNFT: async (nftData: Partial<NFT>) => {
        // TODO: Implement actual API call
        const { nfts } = get()
        const newNFT: NFT = {
          id: Date.now().toString(),
          name: nftData.name || '',
          description: nftData.description || '',
          image: nftData.image || '',
          price: nftData.price || 0,
          owner: 'current-user',
          creator: 'current-user',
          collection: nftData.collection || '',
          attributes: nftData.attributes || [],
          isForSale: false,
          tokenId: '',
          createdAt: new Date(),
        }
        set({ nfts: [...nfts, newNFT] })
      },
      updateNFT: async (id: string, data: Partial<NFT>) => {
        const { nfts } = get()
        const updatedNFTs = nfts.map(nft =>
          nft.id === id ? { ...nft, ...data } : nft
        )
        set({ nfts: updatedNFTs })
      },
      deleteNFT: async (id: string) => {
        const { nfts } = get()
        const filteredNFTs = nfts.filter(nft => nft.id !== id)
        set({ nfts: filteredNFTs })
      },
    })
  )
)

// Marketplace Store
export const useMarketplaceStore = create<MarketplaceState>()(
  devtools(
    (set, get) => ({
      auctions: [],
      stakingPools: [],
      userStakingPositions: [],
      isLoading: false,
      error: null,
      createAuction: async (auctionData: Partial<Auction>) => {
        // TODO: Implement actual API call
        const { auctions } = get()
        const newAuction: Auction = {
          id: Date.now().toString(),
          nftId: auctionData.nftId || '',
          startingPrice: auctionData.startingPrice || 0,
          reservePrice: auctionData.reservePrice,
          currentBid: 0,
          highestBidder: '',
          endTime: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
          isActive: true,
          bids: [],
        }
        set({ auctions: [...auctions, newAuction] })
      },
      placeBid: async (auctionId: string, amount: number) => {
        const { auctions } = get()
        const updatedAuctions = auctions.map(auction =>
          auction.id === auctionId
            ? {
                ...auction,
                currentBid: amount,
                highestBidder: 'current-user',
                bids: [
                  ...auction.bids,
                  {
                    bidder: 'current-user',
                    amount,
                    timestamp: new Date(),
                  },
                ],
              }
            : auction
        )
        set({ auctions: updatedAuctions })
      },
      stakeNFT: async (stakingData: Partial<StakingPosition>) => {
        // TODO: Implement actual API call
        const { userStakingPositions } = get()
        const newPosition: StakingPosition = {
          id: Date.now().toString(),
          userId: 'current-user',
          nftId: stakingData.nftId || '',
          poolId: stakingData.poolId || '',
          amount: 1,
          startDate: new Date(),
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
          rewards: 0,
          isActive: true,
        }
        set({ userStakingPositions: [...userStakingPositions, newPosition] })
      },
      unstakeNFT: async (positionId: string) => {
        const { userStakingPositions } = get()
        const updatedPositions = userStakingPositions.map(position =>
          position.id === positionId ? { ...position, isActive: false } : position
        )
        set({ userStakingPositions: updatedPositions })
      },
      claimRewards: async (positionId: string) => {
        const { userStakingPositions } = get()
        const updatedPositions = userStakingPositions.map(position =>
          position.id === positionId ? { ...position, rewards: 0 } : position
        )
        set({ userStakingPositions: updatedPositions })
      },
    })
  )
)

// UI Store
export const useUIStore = create<UIState>()(
  devtools(
    persist(
      (set) => ({
        theme: 'light',
        sidebarOpen: false,
        searchModalOpen: false,
        notificationModalOpen: false,
        currentPage: '/',
        toggleTheme: () =>
          set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
        toggleSidebar: () =>
          set((state) => ({ sidebarOpen: !state.sidebarOpen })),
        toggleSearchModal: () =>
          set((state) => ({ searchModalOpen: !state.searchModalOpen })),
        toggleNotificationModal: () =>
          set((state) => ({ notificationModalOpen: !state.notificationModalOpen })),
        setCurrentPage: (page: string) => set({ currentPage: page }),
      }),
      {
        name: 'ui-storage',
        storage: createJSONStorage(() => localStorage),
      }
    )
  )
)


