const { ethers } = require("hardhat");

async function main() {
  console.log("🧪 Testing NFT Marketplace Contracts...");

  // Get signers
  const [deployer, user1, user2] = await ethers.getSigners();
  console.log("Deployer:", deployer.address);
  console.log("User1:", user1.address);
  console.log("User2:", user2.address);

  // Deploy contracts
  console.log("\n📦 Deploying contracts...");
  
  const RewardToken = await ethers.getContractFactory("RewardToken");
  const rewardToken = await RewardToken.deploy();
  await rewardToken.deployed();
  console.log("✅ RewardToken deployed to:", rewardToken.address);

  const NFTMarketplace = await ethers.getContractFactory("NFTMarketplace");
  const nftMarketplace = await NFTMarketplace.deploy();
  await nftMarketplace.deployed();
  console.log("✅ NFTMarketplace deployed to:", nftMarketplace.address);

  const NFTStaking = await ethers.getContractFactory("NFTStaking");
  const nftStaking = await NFTStaking.deploy(nftMarketplace.address, rewardToken.address);
  await nftStaking.deployed();
  console.log("✅ NFTStaking deployed to:", nftStaking.address);

  // Transfer reward tokens to staking contract
  const transferAmount = ethers.utils.parseEther("100000");
  await rewardToken.transfer(nftStaking.address, transferAmount);
  console.log("✅ Transferred", ethers.utils.formatEther(transferAmount), "tokens to staking contract");

  // Test NFT Minting
  console.log("\n🎨 Testing NFT Minting...");
  
  const listingPrice = await nftMarketplace.listingPrice();
  const mintPrice = ethers.utils.parseEther("0.1");
  
  const mintTx = await nftMarketplace.connect(user1).createNFT(
    "ipfs://QmTest123",
    mintPrice,
    5, // 5% royalty
    { value: listingPrice }
  );
  await mintTx.wait();
  console.log("✅ NFT minted successfully");

  // Test NFT Listing
  console.log("\n📋 Testing NFT Listing...");
  
  const listTx = await nftMarketplace.connect(user1).listNFT(1, mintPrice);
  await listTx.wait();
  console.log("✅ NFT listed successfully");

  // Test NFT Buying
  console.log("\n💰 Testing NFT Buying...");
  
  const buyTx = await nftMarketplace.connect(user2).buyNFT(1, { value: mintPrice });
  await buyTx.wait();
  console.log("✅ NFT bought successfully");

  // Test Staking
  console.log("\n🏦 Testing Staking...");
  
  // Approve NFT for staking
  const approveTx = await nftMarketplace.connect(user2).setApprovalForAll(nftStaking.address, true);
  await approveTx.wait();
  console.log("✅ NFT approved for staking");

  // Stake NFT
  const stakeTx = await nftStaking.connect(user2).stakeNFT(1, 1); // Pool 1
  await stakeTx.wait();
  console.log("✅ NFT staked successfully");

  // Check staking info
  const stakedNFTs = await nftStaking.getUserStakedNFTs(user2.address);
  console.log("✅ User staked NFTs:", stakedNFTs.length);

  // Test reward calculation
  const rewards = await nftStaking.calculateRewards(1);
  console.log("✅ Calculated rewards:", ethers.utils.formatEther(rewards));

  console.log("\n🎉 All tests passed successfully!");
  console.log("\n📊 Contract Addresses:");
  console.log("RewardToken:", rewardToken.address);
  console.log("NFTMarketplace:", nftMarketplace.address);
  console.log("NFTStaking:", nftStaking.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Test failed:", error);
    process.exit(1);
  });


