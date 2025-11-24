// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract NFTStaking is ReentrancyGuard, Ownable {
    using Counters for Counters.Counter;
    
    IERC721 public nftContract;
    IERC20 public rewardToken;
    
    uint256 public rewardRate = 100; // 100 tokens per day per NFT
    uint256 public constant REWARD_PRECISION = 1e18;
    
    struct StakingPool {
        uint256 poolId;
        string name;
        uint256 minStakePeriod;
        uint256 rewardMultiplier;
        bool isActive;
    }
    
    struct StakedNFT {
        uint256 tokenId;
        uint256 poolId;
        uint256 stakedAt;
        uint256 lastRewardCalculation;
        uint256 accumulatedRewards;
        address owner;
    }
    
    Counters.Counter private _poolIds;
    
    mapping(uint256 => StakingPool) public stakingPools;
    mapping(uint256 => StakedNFT) public stakedNFTs; // tokenId => StakedNFT
    mapping(address => uint256[]) public userStakedNFTs;
    mapping(address => uint256) public userTotalRewards;
    
    event NFTStaked(uint256 indexed tokenId, address indexed owner, uint256 poolId);
    event NFTUnstaked(uint256 indexed tokenId, address indexed owner, uint256 rewards);
    event RewardsClaimed(address indexed user, uint256 amount);
    event PoolCreated(uint256 indexed poolId, string name, uint256 minStakePeriod, uint256 rewardMultiplier);
    event PoolUpdated(uint256 indexed poolId, bool isActive);
    
    constructor(address _nftContract, address _rewardToken) Ownable() {
        nftContract = IERC721(_nftContract);
        rewardToken = IERC20(_rewardToken);
        
        // Create default pools
        _createPool("Bronze", 7 days, 100); // 1x multiplier
        _createPool("Silver", 30 days, 150); // 1.5x multiplier
        _createPool("Gold", 90 days, 200); // 2x multiplier
        _createPool("Diamond", 180 days, 300); // 3x multiplier
    }
    
    // Create new staking pool
    function createPool(string memory name, uint256 minStakePeriod, uint256 rewardMultiplier) 
        public onlyOwner returns (uint256) {
        return _createPool(name, minStakePeriod, rewardMultiplier);
    }
    
    function _createPool(string memory name, uint256 minStakePeriod, uint256 rewardMultiplier) 
        internal returns (uint256) {
        _poolIds.increment();
        uint256 poolId = _poolIds.current();
        
        stakingPools[poolId] = StakingPool({
            poolId: poolId,
            name: name,
            minStakePeriod: minStakePeriod,
            rewardMultiplier: rewardMultiplier,
            isActive: true
        });
        
        emit PoolCreated(poolId, name, minStakePeriod, rewardMultiplier);
        return poolId;
    }
    
    // Update pool status
    function updatePool(uint256 poolId, bool isActive) public onlyOwner {
        require(poolId > 0 && poolId <= _poolIds.current(), "Invalid pool ID");
        stakingPools[poolId].isActive = isActive;
        emit PoolUpdated(poolId, isActive);
    }
    
    // Stake NFT
    function stakeNFT(uint256 tokenId, uint256 poolId) public nonReentrant {
        require(nftContract.ownerOf(tokenId) == msg.sender, "You don't own this NFT");
        require(nftContract.isApprovedForAll(msg.sender, address(this)), "NFT not approved for staking");
        require(poolId > 0 && poolId <= _poolIds.current(), "Invalid pool ID");
        require(stakingPools[poolId].isActive, "Pool is not active");
        require(stakedNFTs[tokenId].owner == address(0), "NFT already staked");
        
        // Transfer NFT to contract
        nftContract.transferFrom(msg.sender, address(this), tokenId);
        
        stakedNFTs[tokenId] = StakedNFT({
            tokenId: tokenId,
            poolId: poolId,
            stakedAt: block.timestamp,
            lastRewardCalculation: block.timestamp,
            accumulatedRewards: 0,
            owner: msg.sender
        });
        
        userStakedNFTs[msg.sender].push(tokenId);
        
        emit NFTStaked(tokenId, msg.sender, poolId);
    }
    
    // Unstake NFT
    function unstakeNFT(uint256 tokenId) public nonReentrant {
        StakedNFT storage stakedNFT = stakedNFTs[tokenId];
        require(stakedNFT.owner == msg.sender, "You don't own this staked NFT");
        
        StakingPool storage pool = stakingPools[stakedNFT.poolId];
        require(block.timestamp >= stakedNFT.stakedAt + pool.minStakePeriod, "Minimum staking period not met");
        
        // Calculate and claim rewards
        uint256 rewards = calculateRewards(tokenId);
        if (rewards > 0) {
            require(rewardToken.transfer(msg.sender, rewards), "Reward transfer failed");
            userTotalRewards[msg.sender] += rewards;
        }
        
        // Transfer NFT back to owner
        nftContract.transferFrom(address(this), msg.sender, tokenId);
        
        // Remove from staked NFTs
        _removeFromUserStakedNFTs(msg.sender, tokenId);
        delete stakedNFTs[tokenId];
        
        emit NFTUnstaked(tokenId, msg.sender, rewards);
    }
    
    // Claim rewards without unstaking
    function claimRewards(uint256 tokenId) public nonReentrant {
        StakedNFT storage stakedNFT = stakedNFTs[tokenId];
        require(stakedNFT.owner == msg.sender, "You don't own this staked NFT");
        
        uint256 rewards = calculateRewards(tokenId);
        require(rewards > 0, "No rewards to claim");
        
        stakedNFT.lastRewardCalculation = block.timestamp;
        stakedNFT.accumulatedRewards = 0;
        
        require(rewardToken.transfer(msg.sender, rewards), "Reward transfer failed");
        userTotalRewards[msg.sender] += rewards;
        
        emit RewardsClaimed(msg.sender, rewards);
    }
    
    // Calculate rewards for a staked NFT
    function calculateRewards(uint256 tokenId) public view returns (uint256) {
        StakedNFT storage stakedNFT = stakedNFTs[tokenId];
        if (stakedNFT.owner == address(0)) return 0;
        
        StakingPool storage pool = stakingPools[stakedNFT.poolId];
        uint256 timeStaked = block.timestamp - stakedNFT.lastRewardCalculation;
        uint256 baseReward = (timeStaked * rewardRate * REWARD_PRECISION) / 1 days;
        uint256 multiplierReward = (baseReward * pool.rewardMultiplier) / 100;
        
        return stakedNFT.accumulatedRewards + multiplierReward;
    }
    
    // Get user's staked NFTs
    function getUserStakedNFTs(address user) public view returns (StakedNFT[] memory) {
        uint256[] memory userTokenIds = userStakedNFTs[user];
        StakedNFT[] memory stakedNFTsArray = new StakedNFT[](userTokenIds.length);
        
        for (uint256 i = 0; i < userTokenIds.length; i++) {
            stakedNFTsArray[i] = stakedNFTs[userTokenIds[i]];
        }
        
        return stakedNFTsArray;
    }
    
    // Get all staking pools
    function getAllPools() public view returns (StakingPool[] memory) {
        uint256 totalPools = _poolIds.current();
        StakingPool[] memory pools = new StakingPool[](totalPools);
        
        for (uint256 i = 1; i <= totalPools; i++) {
            pools[i - 1] = stakingPools[i];
        }
        
        return pools;
    }
    
    // Get total rewards for user
    function getUserTotalRewards(address user) public view returns (uint256) {
        return userTotalRewards[user];
    }
    
    // Update reward rate
    function updateRewardRate(uint256 newRate) public onlyOwner {
        rewardRate = newRate;
    }
    
    // Emergency unstake (only owner, bypasses time restrictions)
    function emergencyUnstake(uint256 tokenId) public onlyOwner {
        StakedNFT storage stakedNFT = stakedNFTs[tokenId];
        require(stakedNFT.owner != address(0), "NFT not staked");
        
        // Calculate rewards
        uint256 rewards = calculateRewards(tokenId);
        if (rewards > 0) {
            require(rewardToken.transfer(stakedNFT.owner, rewards), "Reward transfer failed");
            userTotalRewards[stakedNFT.owner] += rewards;
        }
        
        // Transfer NFT back
        nftContract.transferFrom(address(this), stakedNFT.owner, tokenId);
        
        // Remove from staked NFTs
        _removeFromUserStakedNFTs(stakedNFT.owner, tokenId);
        delete stakedNFTs[tokenId];
        
        emit NFTUnstaked(tokenId, stakedNFT.owner, rewards);
    }
    
    // Helper function to remove NFT from user's staked list
    function _removeFromUserStakedNFTs(address user, uint256 tokenId) internal {
        uint256[] storage userTokenIds = userStakedNFTs[user];
        for (uint256 i = 0; i < userTokenIds.length; i++) {
            if (userTokenIds[i] == tokenId) {
                userTokenIds[i] = userTokenIds[userTokenIds.length - 1];
                userTokenIds.pop();
                break;
            }
        }
    }
    
    // Check if NFT is staked
    function isNFTStaked(uint256 tokenId) public view returns (bool) {
        return stakedNFTs[tokenId].owner != address(0);
    }
    
    // Get staking info for NFT
    function getStakingInfo(uint256 tokenId) public view returns (StakedNFT memory, StakingPool memory) {
        StakedNFT memory stakedNFT = stakedNFTs[tokenId];
        StakingPool memory pool = stakingPools[stakedNFT.poolId];
        return (stakedNFT, pool);
    }
}



