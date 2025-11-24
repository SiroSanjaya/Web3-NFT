import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { isAdmin } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// Middleware to check admin rights
router.use(isAdmin);

// Get platform statistics
router.get('/dashboard', async (req: Request, res: Response) => {
  try {
    const [users, nfts, collections, volume] = await Promise.all([
      prisma.user.count(),
      prisma.nFT.count(),
      prisma.collection.count(),
      prisma.listing.aggregate({
        where: { status: 'completed' },
        _sum: { price: true }
      })
    ]);

    res.json({
      users,
      nfts,
      collections,
      volume: volume._sum.price || 0
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
});

// Moderate content
router.post('/moderate/nft/:id', async (req: Request, res: Response) => {
  try {
    const { action } = req.body;
    const nft = await prisma.nFT.update({
      where: { id: req.params.id },
      data: { status: action }
    });
    res.json(nft);
  } catch (error) {
    res.status(500).json({ error: 'Failed to moderate NFT' });
  }
});

// Manage featured collections
router.put('/collections/:id/featured', async (req: Request, res: Response) => {
  try {
    const { featured } = req.body;
    const collection = await prisma.collection.update({
      where: { id: req.params.id },
      data: { featured }
    });
    res.json(collection);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update collection' });
  }
});

export default router;