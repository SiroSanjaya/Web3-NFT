import { ethers } from 'ethers';

interface SignatureData {
  nftId: string;
  price: number;
  action: 'list' | 'bid' | 'accept';
  timestamp: number;
}

/**
 * Verifies an Ethereum signature
 */
export const verifySignature = (
  signature: string,
  signerAddress: string,
  data: SignatureData
): boolean => {
  try {
    // Create typed message
    const message = createSignMessage(data);
    
    // Create message hash and recover signer
    const messageHash = ethers.hashMessage(message);
    const recoveredAddress = ethers.recoverAddress(messageHash, signature);
    
    return recoveredAddress.toLowerCase() === signerAddress.toLowerCase();
  } catch (error) {
    console.error('Signature verification failed:', error);
    return false;
  }
};

/**
 * Creates a typed message for signing
 */
const createSignMessage = (data: SignatureData): string => {
  const { nftId, price, action, timestamp } = data;
  return ethers.AbiCoder.defaultAbiCoder().encode(
    ['string', 'string', 'uint256', 'uint256'],
    [action.toUpperCase(), nftId, price, timestamp]
  );
};

export const generateSignatureData = (
  nftId: string,
  price: number,
  action: SignatureData['action']
): SignatureData => ({
  nftId,
  price,
  action,
  timestamp: Date.now()
});