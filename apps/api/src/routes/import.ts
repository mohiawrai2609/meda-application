import { Router } from 'express';
import multer from 'multer';
import { CsvImportService } from '../services/csv-import.service';

const router = Router();
const upload = multer({ dest: 'uploads/' });
const csvImportService = new CsvImportService();

router.post('/import', upload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    try {
        const result = await csvImportService.importExceptions(req.file.path);
        res.json({ message: 'Import successful', count: result.length, data: result });
    } catch (error) {
        res.status(500).json({ error: 'Import failed', details: error });
    }
});

export default router;
