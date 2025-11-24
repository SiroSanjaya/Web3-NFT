const hre = require("hardhat");
const { ethers, network } = hre;

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", ethers.formatEther(balance), "ETH");

  // Deploy Reward Token first
  console.log("\nDeploying RewardToken...");
  const RewardToken = await ethers.getContractFactory("RewardToken");
  const rewardToken = await RewardToken.deploy();
  await rewardToken.waitForDeployment();
  const rewardTokenAddress = await rewardToken.getAddress();
  console.log("RewardToken deployed to:", rewardTokenAddress);

  // Deploy NFT Marketplace
  console.log("\nDeploying NFTMarketplace...");
  const NFTMarketplace = await ethers.getContractFactory("NFTMarketplace");
  const nftMarketplace = await NFTMarketplace.deploy();
  await nftMarketplace.waitForDeployment();
  const nftMarketplaceAddress = await nftMarketplace.getAddress();
  console.log("NFTMarketplace deployed to:", nftMarketplaceAddress);

  // Deploy NFT Staking
  console.log("\nDeploying NFTStaking...");
  const NFTStaking = await ethers.getContractFactory("NFTStaking");
  const nftStaking = await NFTStaking.deploy(nftMarketplaceAddress, rewardTokenAddress);
  await nftStaking.waitForDeployment();
  const nftStakingAddress = await nftStaking.getAddress();
  console.log("NFTStaking deployed to:", nftStakingAddress);

  // Transfer some reward tokens to staking contract
  console.log("\nTransferring reward tokens to staking contract...");
  const transferAmount = ethers.parseEther("100000"); // 100k tokens
  const tx = await rewardToken.transfer(nftStakingAddress, transferAmount);
  await tx.wait();
  console.log("Transferred", ethers.formatEther(transferAmount), "tokens to staking contract");

  console.log("\n=== DEPLOYMENT SUMMARY ===");
  console.log("RewardToken:", rewardTokenAddress);
  console.log("NFTMarketplace:", nftMarketplaceAddress);
  console.log("NFTStaking:", nftStakingAddress);
  console.log("Network:", network.name);
  console.log("Deployer:", deployer.address);

  // Save deployment addresses
  const deploymentInfo = {
    network: network.name,
    deployer: deployer.address,
    contracts: {
      rewardToken: rewardTokenAddress,
      nftMarketplace: nftMarketplaceAddress,
      nftStaking: nftStakingAddress,
    },
    timestamp: new Date().toISOString(),
  };

  const fs = require("fs");
  fs.writeFileSync(
    `deployment-${network.name}.json`,
    JSON.stringify(deploymentInfo, null, 2)
  );
  console.log("\nDeployment info saved to deployment-" + network.name + ".json");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });



