import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import multer from 'multer';
import { uploadToIPFS } from '../utils/ipfs';

const router = express.Router();
const prisma = new PrismaClient();
const upload = multer({ storage: multer.memoryStorage() });

// Get all NFTs with filters
router.get('/', async (req: Request, res: Response) => {
  try {
    const {
      owner,
      collection,
      minPrice,
      maxPrice,
      status,
      sort = 'createdAt_DESC' // default value
    } = req.query;

    // Ensure sort is a string and handle its parts
    const sortParam = String(sort);
    const [sortField, sortDirection] = sortParam.split('_');

    const nfts = await prisma.nFT.findMany({
      where: {
        ...(owner && { ownerId: String(owner) }),
        ...(collection && { collectionId: String(collection) }),
        ...(minPrice && { price: { gte: Number(minPrice) } }),
        ...(maxPrice && { price: { lte: Number(maxPrice) } }),
        ...(status && { status: String(status) })
      },
      include: {
        owner: {
          select: {
            id: true,
            username: true,
            profile: true
          }
        },
        collection: true,
        attributes: true
      },
      orderBy: {
        [sortField]: sortDirection.toLowerCase()
      }
    });

    res.json(nfts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch NFTs' });
  }
});

// Get NFT by id
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const nft = await prisma.nFT.findUnique({
      where: { id: req.params.id },
      include: {
        owner: {
          select: {
            id: true,
            username: true,
            profile: true
          }
        },
        collection: true,
        attributes: true,
        bids: {
          include: {
            bidder: true
          },
          orderBy: {
            amount: 'desc'
          }
        }
      }
    });

    if (!nft) {
      return res.status(404).json({ error: 'NFT not found' });
    }

    res.json(nft);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch NFT' });
  }
});

// Create new NFT
router.post('/', upload.single('image'), async (req: Request, res: Response) => {
  try {
    const { name, description, price, collectionId, attributes } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: 'Image is required' });
    }

    // Upload image to IPFS
    const ipfsHash = await uploadToIPFS(req.file.buffer);

    const nft = await prisma.nFT.create({
      data: {
        name,
        description,
        price: Number(price),
        imageUrl: `ipfs://${ipfsHash}`,
        ownerId: req.user?.id,
        collectionId,
        attributes: {
          createMany: {
            data: JSON.parse(attributes)
          }
        }
      },
      include: {
        owner: true,
        collection: true,
        attributes: true
      }
    });

    res.status(201).json(nft);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create NFT' });
  }
});

// Update NFT
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const nft = await prisma.nFT.update({
      where: { id: req.params.id },
      data: req.body,
      include: {
        owner: true,
        collection: true,
        attributes: true
      }
    });

    res.json(nft);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update NFT' });
  }
});

// Delete NFT
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    await prisma.nFT.delete({
      where: { id: req.params.id }
    });

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete NFT' });
  }
});

export default router;