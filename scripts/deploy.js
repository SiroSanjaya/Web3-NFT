const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString());

  // Deploy Reward Token first
  console.log("\nDeploying RewardToken...");
  const RewardToken = await ethers.getContractFactory("RewardToken");
  const rewardToken = await RewardToken.deploy();
  await rewardToken.deployed();
  console.log("RewardToken deployed to:", rewardToken.address);

  // Deploy NFT Marketplace
  console.log("\nDeploying NFTMarketplace...");
  const NFTMarketplace = await ethers.getContractFactory("NFTMarketplace");
  const nftMarketplace = await NFTMarketplace.deploy();
  await nftMarketplace.deployed();
  console.log("NFTMarketplace deployed to:", nftMarketplace.address);

  // Deploy NFT Staking
  console.log("\nDeploying NFTStaking...");
  const NFTStaking = await ethers.getContractFactory("NFTStaking");
  const nftStaking = await NFTStaking.deploy(nftMarketplace.address, rewardToken.address);
  await nftStaking.deployed();
  console.log("NFTStaking deployed to:", nftStaking.address);

  // Transfer some reward tokens to staking contract
  console.log("\nTransferring reward tokens to staking contract...");
  const transferAmount = ethers.utils.parseEther("100000"); // 100k tokens
  await rewardToken.transfer(nftStaking.address, transferAmount);
  console.log("Transferred", ethers.utils.formatEther(transferAmount), "tokens to staking contract");

  console.log("\n=== DEPLOYMENT SUMMARY ===");
  console.log("RewardToken:", rewardToken.address);
  console.log("NFTMarketplace:", nftMarketplace.address);
  console.log("NFTStaking:", nftStaking.address);
  console.log("Network:", network.name);
  console.log("Deployer:", deployer.address);

  // Save deployment addresses
  const deploymentInfo = {
    network: network.name,
    deployer: deployer.address,
    contracts: {
      rewardToken: rewardToken.address,
      nftMarketplace: nftMarketplace.address,
      nftStaking: nftStaking.address,
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


