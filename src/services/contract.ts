import { ethers } from "ethers";

/**
 * Human-Readable ABI for CryptoTrackerToken on the Frontend.
 * This is highly lightweight and avoids loading large JSON build files.
 */
export const CryptoTrackerTokenABI = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address owner) view returns (uint256)",
  "function transfer(address to, uint256 amount) returns (bool)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function mint(address to, uint256 amount) external",
  "function burn(uint256 amount) external",
  "function pause() external",
  "function unpause() external",
  "function owner() view returns (address)",
  "function nonces(address owner) view returns (uint256)",
  "function DOMAIN_SEPARATOR() view returns (bytes32)",
];

/**
 * Human-Readable ABI for CryptoTrackerStaking Vault Contract.
 */
export const CryptoTrackerStakingABI = [
  "function stakingToken() view returns (address)",
  "function rewardToken() view returns (address)",
  "function totalStaked() view returns (uint256)",
  "function balances(address account) view returns (uint256)",
  "function rewardRate() view returns (uint256)",
  "function rewardPerToken() view returns (uint256)",
  "function earned(address account) view returns (uint256)",
  "function stake(uint256 amount) external",
  "function withdraw(uint256 amount) external",
  "function claimReward() external returns (uint256)",
  "function exit() external",
  "event Staked(address indexed user, uint256 amount)",
  "event Withdrawn(address indexed user, uint256 amount)",
  "event RewardClaimed(address indexed user, uint256 reward)",
];

/**
 * Helper to quickly instantiate the CTK token contract instance.
 */
export const getCTKContract = (
  contractAddress: string,
  signerOrProvider: ethers.Signer | ethers.Provider,
) => {
  return new ethers.Contract(
    contractAddress,
    CryptoTrackerTokenABI,
    signerOrProvider,
  );
};

/**
 * Helper to instantiate the CTK Staking Vault contract instance.
 */
export const getStakingContract = (
  stakingAddress: string,
  signerOrProvider: ethers.Signer | ethers.Provider,
) => {
  return new ethers.Contract(
    stakingAddress,
    CryptoTrackerStakingABI,
    signerOrProvider,
  );
};
