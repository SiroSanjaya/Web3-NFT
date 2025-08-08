'use client'

import { useState, useEffect } from 'react'
import { useAccount, useContractRead, useContractWrite, usePrepareContractWrite } from 'wagmi'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { motion } from 'framer-motion'
import { 
  BanknotesIcon, 
  ClockIcon,
  TrophyIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  SparklesIcon
} from '@heroicons/react/24/outline'
import { NFTStakingABI, RewardTokenABI } from '@/utils/contracts'

export default function Staking() {
  const { address, isConnected } = useAccount()
  const [selectedPool, setSelectedPool] = useState(1)
  const [selectedNFT, setSelectedNFT] = useState(null)
  const [userNFTs, setUserNFTs] = useState([])
  const [stakingPools, setStakingPools] = useState([])
  const [userStakedNFTs, setUserStakedNFTs] = useState([])
  const [totalRewards, setTotalRewards] = useState('0')

  // Contract addresses
  const NFT_STAKING_ADDRESS = (process.env.NEXT_PUBLIC_NFT_STAKING_ADDRESS || '0x0000000000000000000000000000000000000000') as `0x${string}`
  const REWARD_TOKEN_ADDRESS = (process.env.NEXT_PUBLIC_REWARD_TOKEN_ADDRESS || '0x0000000000000000000000000000000000000000') as `0x${string}`
  const NFT_MARKETPLACE_ADDRESS = (process.env.NEXT_PUBLIC_NFT_MARKETPLACE_ADDRESS || '0x0000000000000000000000000000000000000000') as `0x${string}`

  // Fetch staking pools
  const { data: pools } = useContractRead({
    address: NFT_STAKING_ADDRESS,
    abi: NFTStakingABI,
    functionName: 'getAllPools',
    watch: true,
  })

  // Fetch user's staked NFTs
  const { data: stakedNFTs, refetch: refetchStaked } = useContractRead({
    address: NFT_STAKING_ADDRESS,
    abi: NFTStakingABI,
    functionName: 'getUserStakedNFTs',
    args: [address],
    enabled: !!address,
    watch: true,
  })

  // Fetch user's NFTs (for staking)
  const { data: userNFTsData, refetch: refetchUserNFTs } = useContractRead({
    address: NFT_MARKETPLACE_ADDRESS,
    abi: NFTStakingABI,
    functionName: 'fetchUserNFTs',
    args: [address],
    enabled: !!address,
    watch: true,
  })

  // Fetch reward token balance
  const { data: rewardBalance } = useContractRead({
    address: REWARD_TOKEN_ADDRESS,
    abi: RewardTokenABI,
    functionName: 'balanceOf',
    args: [address],
    enabled: !!address,
    watch: true,
  })

  // Prepare stake transaction
  const { config: stakeConfig } = usePrepareContractWrite({
    address: NFT_STAKING_ADDRESS,
    abi: NFTStakingABI,
    functionName: 'stakeNFT',
    args: [selectedNFT?.tokenId, selectedPool],
    enabled: isConnected && !!selectedNFT && !!selectedPool,
  })

  const { write: stakeNFT, isLoading: isStaking } = useContractWrite(stakeConfig)

  // Prepare unstake transaction
  const { config: unstakeConfig } = usePrepareContractWrite({
    address: NFT_STAKING_ADDRESS,
    abi: NFTStakingABI,
    functionName: 'unstakeNFT',
    args: [selectedNFT?.tokenId],
    enabled: isConnected && selectedNFT,
  })

  const { write: unstakeNFT, isLoading: isUnstaking } = useContractWrite(unstakeConfig)

  // Prepare claim rewards transaction
  const { config: claimConfig } = usePrepareContractWrite({
    address: NFT_STAKING_ADDRESS,
    abi: NFTStakingABI,
    functionName: 'claimRewards',
    args: [selectedNFT?.tokenId],
    enabled: isConnected && selectedNFT,
  })

  const { write: claimRewards, isLoading: isClaiming } = useContractWrite(claimConfig)

  useEffect(() => {
    if (pools) {
      setStakingPools(pools as any[])
    }
  }, [pools])

  useEffect(() => {
    if (stakedNFTs) {
      setUserStakedNFTs(stakedNFTs as any[])
    }
  }, [stakedNFTs])

  useEffect(() => {
    if (userNFTsData) {
      setUserNFTs(userNFTsData as any[])
    }
  }, [userNFTsData])

  useEffect(() => {
    if (rewardBalance) {
      setTotalRewards(rewardBalance.toString())
    }
  }, [rewardBalance])

  const handleStake = () => {
    if (stakeNFT) {
      stakeNFT()
    }
  }

  const handleUnstake = () => {
    if (unstakeNFT) {
      unstakeNFT()
    }
  }

  const handleClaimRewards = () => {
    if (claimRewards) {
      claimRewards()
    }
  }

  const formatTime = (seconds: number) => {
    const days = Math.floor(seconds / 86400)
    const hours = Math.floor((seconds % 86400) / 3600)
    return `${days}d ${hours}h`
  }

  const formatRewards = (rewards: string) => {
    return (parseFloat(rewards) / 1e18).toFixed(2)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">NFT Staking</h1>
              <p className="text-gray-600">Stake your NFTs and earn rewards</p>
            </div>
            
            <div className="flex items-center space-x-4">
              <ConnectButton />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card text-center"
          >
            <div className="text-2xl font-bold text-primary-600 mb-2">
              {userStakedNFTs.length}
            </div>
            <div className="text-gray-600">Staked NFTs</div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card text-center"
          >
            <div className="text-2xl font-bold text-secondary-600 mb-2">
              {formatRewards(totalRewards)}
            </div>
            <div className="text-gray-600">Total Rewards</div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card text-center"
          >
            <div className="text-2xl font-bold text-green-600 mb-2">
              {stakingPools.length}
            </div>
            <div className="text-gray-600">Staking Pools</div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="card text-center"
          >
            <div className="text-2xl font-bold text-purple-600 mb-2">
              {userNFTs.length}
            </div>
            <div className="text-gray-600">Your NFTs</div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Staking Pools */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="card"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <TrophyIcon className="h-6 w-6 mr-2 text-yellow-500" />
              Staking Pools
            </h2>
            
            <div className="space-y-4">
              {stakingPools.map((pool, index) => (
                <div
                  key={pool.poolId}
                  className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                    selectedPool === pool.poolId
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-primary-300'
                  }`}
                  onClick={() => setSelectedPool(pool.poolId)}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold text-gray-900">{pool.name}</h3>
                      <p className="text-sm text-gray-600">
                        Min stake: {formatTime(pool.minStakePeriod)}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-primary-600">
                        {pool.rewardMultiplier / 100}x
                      </div>
                      <div className="text-xs text-gray-500">Multiplier</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Staking Actions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="card"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <BanknotesIcon className="h-6 w-6 mr-2 text-green-500" />
              Stake Your NFTs
            </h2>
            
            {isConnected ? (
              <div className="space-y-6">
                {/* Select NFT */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select NFT to Stake
                  </label>
                  <select
                    value={selectedNFT?.tokenId || ''}
                    onChange={(e) => {
                      const nft = userNFTs.find(n => n.tokenId.toString() === e.target.value)
                      setSelectedNFT(nft)
                    }}
                    className="input-field"
                  >
                    <option value="">Choose an NFT...</option>
                    {userNFTs.map((nft) => (
                      <option key={nft.tokenId} value={nft.tokenId}>
                        NFT #{nft.tokenId}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Selected Pool Info */}
                {selectedPool && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-2">Selected Pool</h3>
                    <div className="text-sm text-gray-600">
                      <p>Pool: {stakingPools.find(p => p.poolId === selectedPool)?.name}</p>
                      <p>Min Stake Period: {formatTime(stakingPools.find(p => p.poolId === selectedPool)?.minStakePeriod || 0)}</p>
                      <p>Reward Multiplier: {stakingPools.find(p => p.poolId === selectedPool)?.rewardMultiplier / 100}x</p>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="space-y-3">
                  <button
                    onClick={handleStake}
                    disabled={!selectedNFT || isStaking}
                    className="w-full btn-primary flex items-center justify-center"
                  >
                    {isStaking ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Staking...
                      </>
                    ) : (
                      <>
                        <ArrowUpIcon className="h-4 w-4 mr-2" />
                        Stake NFT
                      </>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <BanknotesIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Connect your wallet to start staking</p>
              </div>
            )}
          </motion.div>
        </div>

        {/* Staked NFTs */}
        {isConnected && userStakedNFTs.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <SparklesIcon className="h-6 w-6 mr-2 text-purple-500" />
              Your Staked NFTs
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userStakedNFTs.map((stakedNFT) => (
                <div key={stakedNFT.tokenId} className="card">
                  <div className="text-center mb-4">
                    <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <TrophyIcon className="h-8 w-8 text-primary-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900">NFT #{stakedNFT.tokenId}</h3>
                    <p className="text-sm text-gray-600">
                      Pool: {stakingPools.find(p => p.poolId === stakedNFT.poolId)?.name}
                    </p>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Staked Since:</span>
                      <span className="font-medium">
                        {new Date(stakedNFT.stakedAt * 1000).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Rewards:</span>
                      <span className="font-medium text-green-600">
                        {formatRewards(stakedNFT.accumulatedRewards.toString())} NSR
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-4 space-y-2">
                    <button
                      onClick={() => {
                        setSelectedNFT(stakedNFT)
                        handleClaimRewards()
                      }}
                      disabled={isClaiming}
                      className="w-full btn-secondary text-sm"
                    >
                      {isClaiming ? 'Claiming...' : 'Claim Rewards'}
                    </button>
                    <button
                      onClick={() => {
                        setSelectedNFT(stakedNFT)
                        handleUnstake()
                      }}
                      disabled={isUnstaking}
                      className="w-full btn-outline text-sm"
                    >
                      {isUnstaking ? 'Unstaking...' : 'Unstake NFT'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
