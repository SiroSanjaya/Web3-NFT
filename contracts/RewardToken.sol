// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract RewardToken is ERC20, Ownable {
    constructor() ERC20("NFT Staking Reward", "NSR") Ownable(msg.sender) {
        // Mint initial supply to contract deployer
        _mint(msg.sender, 1000000 * 10**decimals()); // 1 million tokens
    }
    
    // Mint tokens (only owner)
    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }
    
    // Burn tokens
    function burn(uint256 amount) public {
        _burn(msg.sender, amount);
    }
}


