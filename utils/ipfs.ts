// IPFS utilities - Simplified version for development
export const uploadToIPFS = async (file: File): Promise<string> => {
  try {
    // For development, return a mock hash
    console.log('Mock IPFS upload for file:', file.name)
    return 'mock-ipfs-hash-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9)
  } catch (error) {
    console.error('Error uploading to IPFS:', error)
    return 'mock-ipfs-hash-' + Date.now()
  }
}

export const uploadMetadataToIPFS = async (metadata: any): Promise<string> => {
  try {
    // For development, return a mock hash
    console.log('Mock IPFS metadata upload:', metadata)
    return 'mock-metadata-hash-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9)
  } catch (error) {
    console.error('Error uploading metadata to IPFS:', error)
    return 'mock-metadata-hash-' + Date.now()
  }
}

export const getIPFSGatewayURL = (hash: string): string => {
  return `https://ipfs.io/ipfs/${hash}`
}

export const getInfuraIPFSURL = (hash: string): string => {
  return `https://ipfs.infura.io/ipfs/${hash}`
}

// Alternative using Pinata (if you prefer)
export const uploadToPinata = async (file: File): Promise<string> => {
  const formData = new FormData()
  formData.append('file', file)

  try {
    const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_PINATA_JWT}`,
      },
      body: formData,
    })

    const data = await response.json()
    return data.IpfsHash
  } catch (error) {
    console.error('Error uploading to Pinata:', error)
    throw new Error('Failed to upload to Pinata')
  }
}

export const uploadMetadataToPinata = async (metadata: any): Promise<string> => {
  try {
    const response = await fetch('https://api.pinata.cloud/pinning/pinJSONToIPFS', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_PINATA_JWT}`,
      },
      body: JSON.stringify(metadata),
    })

    const data = await response.json()
    return data.IpfsHash
  } catch (error) {
    console.error('Error uploading metadata to Pinata:', error)
    throw new Error('Failed to upload metadata to Pinata')
  }
}
