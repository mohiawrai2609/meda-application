import express from 'express';
import cors from 'cors';
import exceptionRouter from './src/routes/exceptions';

const app = express();
const port = process.env.PORT || 3008;

app.use(cors());
app.use(express.json());

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

// Serve uploads statically for MVP
app.use('/uploads', express.static('uploads'));

if (process.env.NODE_ENV !== 'production') {
    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
}

export default app;
