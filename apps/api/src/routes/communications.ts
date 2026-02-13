import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/communications
router.get('/', async (req, res) => {
    try {
        const communications = await prisma.communication.findMany({
            orderBy: { createdAt: 'desc' },
            take: 50,
            include: {
                exception: {
                    include: {
                        loan: true
                    }
                }
            }
        });
        res.json(communications);
    } catch (error) {
        console.error('Failed to fetch communications:', error);
        res.status(500).json({ error: 'Failed to fetch communications' });
    }
});

export default router;
