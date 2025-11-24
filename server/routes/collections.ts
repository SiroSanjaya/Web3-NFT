import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import multer from 'multer';
import { uploadToIPFS } from '../utils/ipfs';

const router = express.Router();
const prisma = new PrismaClient();

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 2 // Allow max 2 files (logo + banner)
  },
  fileFilter: (_req, file, cb) => {
    // Accept only images
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Get all collections with filters
router.get('/', async (req: Request, res: Response) => {
  try {
    const { 
      creator, 
      category, 
      featured,
      sort = 'createdAt_DESC' // default value
    } = req.query;

    // Ensure sort is a string and handle its parts
    const sortParam = String(sort);
    const [sortField, sortDirection] = sortParam.split('_');

    const collections = await prisma.collection.findMany({
      where: {
        ...(creator && { creatorId: String(creator) }),
        ...(category && { category: String(category) }),
        ...(featured === 'true' && { featured: true })
      },
      include: {
        creator: {
          select: {
            id: true,
            username: true,
            profile: true
          }
        },
        _count: {
          select: { nfts: true }
        }
      },
      orderBy: {
        [sortField]: sortDirection.toLowerCase()
      }
    });

    res.json(collections);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch collections' });
  }
});

// Get collection by id
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const collection = await prisma.collection.findUnique({
      where: { id: req.params.id },
      include: {
        creator: {
          select: {
            id: true,
            username: true,
            profile: true
          }
        },
        nfts: {
          include: {
            owner: true,
            attributes: true
          }
        },
        traits: true
      }
    });

    if (!collection) {
      return res.status(404).json({ error: 'Collection not found' });
    }

    res.json(collection);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch collection' });
  }
});

// Create new collection
router.post('/', upload.fields([
  { name: 'logo', maxCount: 1 },
  { name: 'banner', maxCount: 1 }
]), async (req: Request, res: Response) => {
  try {
    const {
      name,
      description,
      category,
      royalties,
      traits
    } = req.body;

    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    
    // Upload images to IPFS
    const logoHash = files.logo ? await uploadToIPFS(files.logo[0].buffer) : null;
    const bannerHash = files.banner ? await uploadToIPFS(files.banner[0].buffer) : null;

    const collection = await prisma.collection.create({
      data: {
        name,
        description,
        category,
        royalties: Number(royalties),
        logoUrl: logoHash ? `ipfs://${logoHash}` : null,
        bannerUrl: bannerHash ? `ipfs://${bannerHash}` : null,
        creatorId: req.user?.id,
        traits: {
          createMany: {
            data: JSON.parse(traits)
          }
        }
      },
      include: {
        creator: true,
        traits: true
      }
    });

    res.status(201).json(collection);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create collection' });
  }
});

// Update collection
router.put('/:id', upload.fields([
  { name: 'logo', maxCount: 1 },
  { name: 'banner', maxCount: 1 }
]), async (req: Request, res: Response) => {
  try {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    
    // Upload new images if provided
    const updates: any = { ...req.body };
    if (files.logo) {
      const logoHash = await uploadToIPFS(files.logo[0].buffer);
      updates.logoUrl = `ipfs://${logoHash}`;
    }
    if (files.banner) {
      const bannerHash = await uploadToIPFS(files.banner[0].buffer);
      updates.bannerUrl = `ipfs://${bannerHash}`;
    }

    const collection = await prisma.collection.update({
      where: { id: req.params.id },
      data: updates,
      include: {
        creator: true,
        traits: true
      }
    });

    res.json(collection);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update collection' });
  }
});

// Delete collection
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    await prisma.collection.delete({
      where: { id: req.params.id }
    });

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete collection' });
  }
});

export default router;