import { Router } from 'express';
import { ExceptionService } from '../services/exception.service';

const router = Router();
const exceptionService = new ExceptionService();

router.get('/', async (req, res) => {
    try {
        const exceptions = await exceptionService.getExceptions(req.query);
        res.json(exceptions);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch exceptions' });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const exception = await exceptionService.getExceptionById(req.params.id);
        if (!exception) {
            return res.status(404).json({ error: 'Exception not found' });
        }
        res.json(exception);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch exception' });
    }
});

router.post('/', async (req, res) => {
    try {
        const exception = await exceptionService.createException(req.body);
        res.status(201).json(exception);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create exception', details: error });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const exception = await exceptionService.getExceptionById(req.params.id);
        if (!exception) return res.status(404).json({ error: 'Exception not found' });
        res.json(exception);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch exception' });
    }
});

router.post('/:id/resolve', async (req, res) => {
    try {
        const result = await exceptionService.resolveException(req.params.id);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: 'Failed to resolve' });
    }
});

router.post('/:id/reject', async (req, res) => {
    try {
        const { reason } = req.body;
        const result = await exceptionService.rejectException(req.params.id, reason || 'Rejected by processor');
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: 'Failed to reject' });
    }
});

export default router;
