import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// POST /api/admin/reset
router.post('/reset', async (req, res) => {
    try {
        console.warn('⚠️⚠️⚠️ ADMIN RESET TRIGGERED ⚠️⚠️⚠️');

        // Delete in order to respect foreign keys
        try {
            await prisma.communication.deleteMany({});
            await prisma.auditLog.deleteMany({});
            await prisma.document.deleteMany({});
            await prisma.exception.deleteMany({});
            await prisma.loan.deleteMany({});
            await prisma.user.deleteMany({});
        } catch (e) {
            console.error('Delete error', e);
        }

        console.log('Database cleared.');

        res.json({ message: 'Database reset successfully' });
    } catch (error) {
        console.error('Reset Error:', error);
        res.status(500).json({ error: 'Failed to reset database' });
    }
});

// POST /api/admin/seed
router.post('/seed', async (req, res) => {
    console.log('🌱 Seeding database...');

    try {
        // 1. Create a dummy organization
        const org = await prisma.organization.create({
            data: {
                name: 'Default Bank Corp',
                settings: {
                    slaHours: 24,
                    reminderFrequency: 'daily'
                }
            }
        });

        // 2. Create a dummy loan
        const loan = await prisma.loan.create({
            data: {
                loanNumber: Math.floor(1000000 + Math.random() * 9000000).toString(),
                borrowerName: 'John Doe',
                borrowerEmail: 'john.doe@example.com',
                loanAmount: 350000,
                organizationId: org.id
            }
        });

        // 3. Create a dummy exception for the loan
        const exception = await prisma.exception.create({
            data: {
                loanId: loan.id,
                exceptionType: 'MISSING_DOCUMENT',
                documentType: 'BANK_STATEMENT',
                description: 'We need your bank statements for the last 3 months to verify your recent down payment transfer.',
                severity: 'HIGH',
                status: 'OPEN',
                attemptCount: 0,
            },
            include: {
                loan: true
            }
        });

        res.json({
            message: 'Database seeded successfully',
            exceptionId: exception.id,
            loanNumber: loan.loanNumber
        });
    } catch (error: any) {
        console.error('Seed Error:', error);
        res.status(500).json({
            error: 'Failed to seed database',
            details: error.message || String(error)
        });
    }
});

export default router;
