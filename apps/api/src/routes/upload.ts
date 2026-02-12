import { Router } from 'express';
import multer from 'multer';
import { PrismaClient } from '@prisma/client';
import path from 'path';
import fs from 'fs';

const router = Router();
const prisma = new PrismaClient();

// Ensure uploads dir exists (for MVP)
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir)
    },
    filename: function (req, file, cb) {
        // secure unique filename
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
    }
})

const upload = multer({ storage: storage });

// POST /api/upload/:exceptionId
router.post('/upload/:exceptionId', upload.single('document'), async (req, res) => {
    const { exceptionId } = req.params;

    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    try {
        // 1. Create Document Record
        const document = await prisma.document.create({
            data: {
                exceptionId: exceptionId,
                fileName: req.file.originalname,
                fileType: req.file.mimetype,
                fileSize: req.file.size,
                storageKey: req.file.filename, // MVP: local filename
                storageUrl: `/uploads/${req.file.filename}`, // MVP: local path
            }
        });

        // 2. Update Exception Status
        await prisma.exception.update({
            where: { id: exceptionId },
            data: {
                status: 'DOCUMENT_RECEIVED',
                updatedAt: new Date(),
                auditLogs: {
                    create: {
                        action: 'document.uploaded',
                        details: { documentId: document.id, fileName: document.fileName }
                    }
                }
            }
        });

        res.json({ message: 'Document uploaded successfully', document });

    } catch (error) {
        console.error('Upload Error:', error);
        res.status(500).json({ error: 'Failed to process upload' });
    }
});

export default router;
