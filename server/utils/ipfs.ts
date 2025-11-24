import { create } from 'ipfs-http-client';

// Configure IPFS client
const ipfs = create({
  host: process.env.IPFS_HOST || 'ipfs.infura.io',
  port: Number(process.env.IPFS_PORT) || 5001,
  protocol: process.env.IPFS_PROTOCOL || 'https',
  headers: {
    authorization: `Basic ${Buffer.from(
      `${process.env.IPFS_PROJECT_ID}:${process.env.IPFS_PROJECT_SECRET}`
    ).toString('base64')}`
  }
});

/**
 * Uploads file buffer to IPFS
 * @param buffer - File buffer to upload
 * @returns Promise<string> IPFS hash of uploaded file
 */
export const uploadToIPFS = async (buffer: Buffer): Promise<string> => {
  try {
    const result = await ipfs.add(buffer);
    return result.path;
  } catch (error) {
    console.error('IPFS upload failed:', error);
    throw new Error('Failed to upload to IPFS');
  }
};

/**
 * Gets IPFS URL for a hash
 * @param hash - IPFS hash
 * @returns string Full IPFS gateway URL
 */
export const getIPFSUrl = (hash: string): string => {
  return `https://${process.env.IPFS_GATEWAY || 'ipfs.io'}/ipfs/${hash}`;
};