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
  "function mint(address to, uint256 amount) external",
  "function burn(uint256 amount) external",
  "function pause() external",
  "function unpause() external",
  "function owner() view returns (address)"
];

/**
 * Helper to quickly instantiate the CTK token contract instance.
 */
export const getCTKContract = (
  contractAddress: string,
  signerOrProvider: ethers.Signer | ethers.Provider
) => {
  return new ethers.Contract(contractAddress, CryptoTrackerTokenABI, signerOrProvider);
};
