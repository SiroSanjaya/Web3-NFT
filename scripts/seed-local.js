const hre = require('hardhat')
const { ethers, network } = hre
const fs = require('fs')

async function main() {
  if (network.name !== 'localhost') {
    console.log('This seeding script is intended for the localhost network only.')
    return
  }

  const deploymentPath = 'deployment-localhost.json'
  if (!fs.existsSync(deploymentPath)) {
    throw new Error('deployment-localhost.json not found. Run `npm run deploy-local` first.')
  }

  const deployment = JSON.parse(fs.readFileSync(deploymentPath, 'utf-8'))
  const marketplaceAddress = deployment.contracts?.nftMarketplace
  if (!marketplaceAddress) {
    throw new Error('nftMarketplace address missing in deployment-localhost.json')
  }

  const [deployer] = await ethers.getSigners()
  console.log('Seeding with account:', deployer.address)

  const marketplace = await ethers.getContractAt('NFTMarketplace', marketplaceAddress)
  const listingPrice = await marketplace.listingPrice()

  const items = [
    { tokenURI: 'ipfs://demo1', priceEth: '0.05', royalty: 5 },
    { tokenURI: 'ipfs://demo2', priceEth: '0.10', royalty: 5 },
    { tokenURI: 'ipfs://demo3', priceEth: '0.25', royalty: 5 },
    { tokenURI: 'ipfs://demo4', priceEth: '0.08', royalty: 5 },
    { tokenURI: 'ipfs://demo5', priceEth: '0.15', royalty: 5 },
  ]

  console.log('Minting and listing demo NFTs...')
  for (let i = 0; i < items.length; i++) {
    const { tokenURI, priceEth, royalty } = items[i]
    // Mint (requires listingPrice fee)
    const mintTx = await marketplace.createNFT(
      tokenURI,
      ethers.parseEther(priceEth),
      royalty,
      { value: listingPrice }
    )
    const mintRc = await mintTx.wait()
    // Token IDs start at 1 and increment
    const tokenId = i + 1
    // List for sale (explicitly set to ensure isListed true)
    const listTx = await marketplace.listNFT(tokenId, ethers.parseEther(priceEth))
    await listTx.wait()
    console.log(`- NFT #${tokenId} minted and listed at ${priceEth} ETH`)
  }

  console.log('Seeding complete.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})






