import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { ethers } from 'ethers';
import { verifySignature } from '../utils/crypto';

const router = express.Router();
const prisma = new PrismaClient();

// Get active listings
router.get('/listings', async (req: Request, res: Response) => {
  try {
    const {
      type = 'all',
      minPrice,
      maxPrice,
      collection,
      sort = 'createdAt_DESC' // default value
    } = req.query;

    // Ensure sort is a string and handle its parts
    const sortParam = String(sort);
    const [sortField, sortDirection] = sortParam.split('_');

    const listings = await prisma.listing.findMany({
      where: {
        status: 'active',
        ...(type !== 'all' && { type: String(type) }),
        ...(collection && { nft: { collectionId: String(collection) } }),
        ...(minPrice && { price: { gte: Number(minPrice) } }),
        ...(maxPrice && { price: { lte: Number(maxPrice) } })
      },
      include: {
        nft: {
          include: {
            owner: true,
            collection: true
          }
        },
        seller: {
          select: {
            id: true,
            username: true,
            profile: true
          }
        }
      },
      orderBy: {
        [sortField]: sortDirection.toLowerCase()
      }
    });

    res.json(listings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch listings' });
  }
});

// Create new listing
router.post('/listings', async (req: Request, res: Response) => {
  try {
    const { nftId, price, type, signature } = req.body;

    // Verify ownership and signature
    const nft = await prisma.nFT.findUnique({
      where: { id: nftId }
    });

    if (!nft || nft.ownerId !== req.user?.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    if (!verifySignature(signature, req.user.id, nftId)) {
      return res.status(400).json({ error: 'Invalid signature' });
    }

    const listing = await prisma.listing.create({
      data: {
        nftId,
        price: Number(price),
        type,
        sellerId: req.user.id,
        status: 'active'
      },
      include: {
        nft: true,
        seller: true
      }
    });

    res.status(201).json(listing);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create listing' });
  }
});

// Place bid
router.post('/bids', async (req: Request, res: Response) => {
  try {
    const { listingId, amount, expiresAt } = req.body;

    const bid = await prisma.bid.create({
      data: {
        listingId,
        amount: Number(amount),
        bidderId: req.user?.id,
        expiresAt: new Date(expiresAt)
      },
      include: {
        listing: {
          include: {
            nft: true
          }
        },
        bidder: true
      }
    });

    res.status(201).json(bid);
  } catch (error) {
    res.status(500).json({ error: 'Failed to place bid' });
  }
});

// Accept bid
router.post('/bids/:id/accept', async (req: Request, res: Response) => {
  try {
    const { signature } = req.body;

    const bid = await prisma.bid.findUnique({
      where: { id: req.params.id },
      include: {
        listing: {
          include: {
            nft: true,
            seller: true
          }
        }
      }
    });

    if (!bid || bid.listing.seller.id !== req.user?.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    if (!verifySignature(signature, req.user.id, bid.id)) {
      return res.status(400).json({ error: 'Invalid signature' });
    }

    // Process transaction and transfer NFT
    const transaction = await prisma.$transaction(async (tx) => {
      // Update NFT ownership
      await tx.nFT.update({
        where: { id: bid.listing.nft.id },
        data: { ownerId: bid.bidderId }
      });

      // Close listing
      await tx.listing.update({
        where: { id: bid.listingId },
        data: { status: 'completed' }
      });

      // Mark bid as accepted
      return tx.bid.update({
        where: { id: bid.id },
        data: { status: 'accepted' }
      });
    });

    res.json(transaction);
  } catch (error) {
    res.status(500).json({ error: 'Failed to accept bid' });
  }
});

// Get market statistics
router.get('/stats', async (req: Request, res: Response) => {
  try {
    const [
      totalVolume,
      activeListings,
      totalSales
    ] = await Promise.all([
      prisma.listing.aggregate({
        where: { status: 'completed' },
        _sum: { price: true }
      }),
      prisma.listing.count({
        where: { status: 'active' }
      }),
      prisma.listing.count({
        where: { status: 'completed' }
      })
    ]);

    res.json({
      volume: totalVolume._sum.price || 0,
      activeListings,
      totalSales
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

export default router;