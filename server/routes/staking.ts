import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Get all staking pools
router.get('/pools', async (req: Request, res: Response) => {
  try {
    const pools = await prisma.stakingPool.findMany({
      include: {
        _count: {
          select: { stakes: true }
        }
      }
    });
    res.json(pools);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch staking pools' });
  }
});

// Get user stakes
router.get('/my-stakes', async (req: Request, res: Response) => {
  try {
    const stakes = await prisma.stake.findMany({
      where: { userId: req.user?.id },
      include: {
        pool: true,
        nft: true
      }
    });
    res.json(stakes);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stakes' });
  }
});

// Stake NFT
router.post('/stake', async (req: Request, res: Response) => {
  try {
    const { nftId, poolId } = req.body;

    const stake = await prisma.stake.create({
      data: {
        nftId,
        poolId,
        userId: req.user?.id,
        startTime: new Date()
      },
      include: {
        pool: true,
        nft: true
      }
    });

    res.status(201).json(stake);
  } catch (error) {
    res.status(500).json({ error: 'Failed to stake NFT' });
  }
});

// Unstake NFT
router.post('/unstake/:stakeId', async (req: Request, res: Response) => {
  try {
    const stake = await prisma.stake.update({
      where: { 
        id: req.params.stakeId,
        userId: req.user?.id
      },
      data: {
        endTime: new Date()
      }
    });
    res.json(stake);
  } catch (error) {
    res.status(500).json({ error: 'Failed to unstake NFT' });
  }
});

export default router;