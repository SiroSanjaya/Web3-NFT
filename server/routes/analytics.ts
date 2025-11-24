import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Get trading volume over time
router.get('/volume', async (req: Request, res: Response) => {
  try {
    const { period = '7d' } = req.query;
    const startDate = new Date();
    
    switch(period) {
      case '24h':
        startDate.setHours(startDate.getHours() - 24);
        break;
      case '7d':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(startDate.getDate() - 30);
        break;
    }

    const volume = await prisma.listing.groupBy({
      by: ['createdAt'],
      where: {
        status: 'completed',
        createdAt: { gte: startDate }
      },
      _sum: { price: true }
    });

    res.json(volume);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch volume data' });
  }
});

// Get top collections
router.get('/collections/top', async (req: Request, res: Response) => {
  try {
    const collections = await prisma.collection.findMany({
      take: 10,
      include: {
        _count: {
          select: { nfts: true }
        },
        nfts: {
          where: {
            listings: {
              some: {
                status: 'completed'
              }
            }
          },
          select: {
            listings: {
              where: { status: 'completed' },
              select: { price: true }
            }
          }
        }
      },
      orderBy: {
        nfts: {
          _count: 'desc'
        }
      }
    });

    res.json(collections);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch top collections' });
  }
});

// Get user activity metrics
router.get('/users/activity', async (req: Request, res: Response) => {
  try {
    const [newUsers, activeUsers] = await Promise.all([
      prisma.user.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000)
          }
        }
      }),
      prisma.user.count({
        where: {
          OR: [
            { listings: { some: { createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } } } },
            { bids: { some: { createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } } } }
          ]
        }
      })
    ]);

    res.json({ newUsers, activeUsers });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user activity' });
  }
});

export default router;