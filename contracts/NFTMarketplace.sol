// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract NFTMarketplace is ERC721, ERC721URIStorage, Ownable, ReentrancyGuard {
    using Counters for Counters.Counter;
    
    Counters.Counter private _tokenIds;
    Counters.Counter private _itemsSold;
    
    uint256 public listingPrice = 0.025 ether;
    uint256 public platformFee = 2.5; // 2.5%
    uint256 public creatorRoyalty = 5; // 5%
    
    struct NFTItem {
        uint256 tokenId;
        address payable seller;
        address payable owner;
        uint256 price;
        bool sold;
        bool isListed;
        uint256 royaltyPercentage;
    }
    
    mapping(uint256 => NFTItem) private idToNFTItem;
    mapping(address => uint256[]) private userNFTs;
    
    event NFTItemCreated(
        uint256 indexed tokenId,
        address seller,
        address owner,
        uint256 price,
        bool sold,
        string tokenURI
    );
    
    event NFTItemSold(
        uint256 indexed tokenId,
        address seller,
        address buyer,
        uint256 price
    );
    
    event NFTListed(
        uint256 indexed tokenId,
        address owner,
        uint256 price
    );
    
    event NFTUnlisted(
        uint256 indexed tokenId,
        address owner
    );
    
    constructor() ERC721("NFT Marketplace", "NFTM") Ownable(msg.sender) {}
    
    // Mint new NFT
    function createNFT(string memory tokenURI, uint256 price, uint256 royaltyPercentage) 
        public payable returns (uint256) {
        require(msg.value >= listingPrice, "Price must be equal to listing price");
        require(royaltyPercentage <= 10, "Royalty cannot exceed 10%");
        
        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();
        
        _safeMint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, tokenURI);
        
        idToNFTItem[newTokenId] = NFTItem(
            newTokenId,
            payable(msg.sender),
            payable(msg.sender),
            price,
            false,
            false,
            royaltyPercentage
        );
        
        userNFTs[msg.sender].push(newTokenId);
        
        emit NFTItemCreated(
            newTokenId,
            msg.sender,
            msg.sender,
            price,
            false,
            tokenURI
        );
        
        return newTokenId;
    }
    
    // List NFT for sale
    function listNFT(uint256 tokenId, uint256 price) public {
        require(_exists(tokenId), "NFT does not exist");
        require(ownerOf(tokenId) == msg.sender, "You don't own this NFT");
        require(price > 0, "Price must be greater than 0");
        
        NFTItem storage item = idToNFTItem[tokenId];
        item.price = price;
        item.isListed = true;
        item.seller = payable(msg.sender);
        
        emit NFTListed(tokenId, msg.sender, price);
    }
    
    // Unlist NFT from sale
    function unlistNFT(uint256 tokenId) public {
        require(_exists(tokenId), "NFT does not exist");
        require(ownerOf(tokenId) == msg.sender, "You don't own this NFT");
        
        NFTItem storage item = idToNFTItem[tokenId];
        item.isListed = false;
        
        emit NFTUnlisted(tokenId, msg.sender);
    }
    
    // Buy NFT
    function buyNFT(uint256 tokenId) public payable nonReentrant {
        NFTItem storage item = idToNFTItem[tokenId];
        require(_exists(tokenId), "NFT does not exist");
        require(item.isListed, "NFT is not listed for sale");
        require(msg.value >= item.price, "Insufficient payment");
        require(msg.sender != item.seller, "You cannot buy your own NFT");
        
        uint256 platformFeeAmount = (item.price * platformFee) / 1000;
        uint256 creatorRoyaltyAmount = (item.price * item.royaltyPercentage) / 1000;
        uint256 sellerAmount = item.price - platformFeeAmount - creatorRoyaltyAmount;
        
        // Transfer payments
        payable(owner()).transfer(platformFeeAmount);
        payable(item.seller).transfer(sellerAmount);
        
        // If creator is different from seller, pay royalty
        if (item.seller != item.owner) {
            payable(item.owner).transfer(creatorRoyaltyAmount);
        }
        
        // Transfer NFT
        _transfer(item.seller, msg.sender, tokenId);
        
        item.owner = payable(msg.sender);
        item.seller = payable(msg.sender);
        item.sold = true;
        item.isListed = false;
        
        _itemsSold.increment();
        
        // Update user NFTs
        _removeFromUserNFTs(item.seller, tokenId);
        userNFTs[msg.sender].push(tokenId);
        
        emit NFTItemSold(tokenId, item.seller, msg.sender, item.price);
    }
    
    // Get all NFTs
    function fetchNFTs() public view returns (NFTItem[] memory) {
        uint256 totalItemCount = _tokenIds.current();
        uint256 unsoldItemCount = _tokenIds.current() - _itemsSold.current();
        uint256 currentIndex = 0;
        
        NFTItem[] memory items = new NFTItem[](unsoldItemCount);
        for (uint256 i = 0; i < totalItemCount; i++) {
            if (idToNFTItem[i + 1].owner != address(0)) {
                uint256 currentId = i + 1;
                NFTItem storage currentItem = idToNFTItem[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return items;
    }
    
    // Get user's NFTs
    function fetchUserNFTs(address user) public view returns (NFTItem[] memory) {
        uint256[] memory userTokenIds = userNFTs[user];
        NFTItem[] memory items = new NFTItem[](userTokenIds.length);
        
        for (uint256 i = 0; i < userTokenIds.length; i++) {
            items[i] = idToNFTItem[userTokenIds[i]];
        }
        
        return items;
    }
    
    // Get listed NFTs
    function fetchListedNFTs() public view returns (NFTItem[] memory) {
        uint256 totalItemCount = _tokenIds.current();
        uint256 listedItemCount = 0;
        
        // Count listed items
        for (uint256 i = 0; i < totalItemCount; i++) {
            if (idToNFTItem[i + 1].isListed) {
                listedItemCount += 1;
            }
        }
        
        NFTItem[] memory items = new NFTItem[](listedItemCount);
        uint256 currentIndex = 0;
        
        for (uint256 i = 0; i < totalItemCount; i++) {
            if (idToNFTItem[i + 1].isListed) {
                uint256 currentId = i + 1;
                NFTItem storage currentItem = idToNFTItem[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return items;
    }
    
    // Get single NFT
    function fetchNFT(uint256 tokenId) public view returns (NFTItem memory) {
        require(_exists(tokenId), "NFT does not exist");
        return idToNFTItem[tokenId];
    }
    
    // Update listing price
    function updateListingPrice(uint256 _listingPrice) public onlyOwner {
        listingPrice = _listingPrice;
    }
    
    // Update platform fee
    function updatePlatformFee(uint256 _platformFee) public onlyOwner {
        require(_platformFee <= 50, "Platform fee cannot exceed 5%");
        platformFee = _platformFee;
    }
    
    // Withdraw platform fees
    function withdrawFees() public onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
    
    // Helper function to remove NFT from user's list
    function _removeFromUserNFTs(address user, uint256 tokenId) internal {
        uint256[] storage userTokenIds = userNFTs[user];
        for (uint256 i = 0; i < userTokenIds.length; i++) {
            if (userTokenIds[i] == tokenId) {
                userTokenIds[i] = userTokenIds[userTokenIds.length - 1];
                userTokenIds.pop();
                break;
            }
        }
    }
    
    // Override required functions
    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }
    
    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }
    
    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721URIStorage) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}


