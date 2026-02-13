import express from 'express';
import cors from 'cors';
import exceptionRouter from './src/routes/exceptions';

const app = express();
const port = process.env.PORT || 3008;

app.use(cors({
    origin: '*', // Allow all origins for MVP
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

app.get('/', (req, res) => {
    res.json({
        message: 'MEDA API Server is running',
        status: 'OK',
        endpoints: {
            health: '/health',
            exceptions: '/api/exceptions',
            communications: '/api/communications'
        }
    });
});

app.get('/health', (req, res) => {
    res.send('OK');
});

app.use('/api/exceptions', exceptionRouter);
import importRouter from './src/routes/import';
import uploadRouter from './src/routes/upload';
import adminRouter from './src/routes/admin';

app.use('/api', importRouter);
app.use('/api', uploadRouter);
app.use('/api/admin', adminRouter);

import communicationsRouter from './src/routes/communications';
import notificationsRouter from './src/routes/notifications';
app.use('/api/communications', communicationsRouter);
app.use('/api/notifications', notificationsRouter);

// Serve uploads statically for MVP
app.use('/uploads', express.static('uploads'));

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

export default app;
