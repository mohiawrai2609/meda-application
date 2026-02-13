
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    try {
        console.log('🌱 Starting manual seed check...');

        // 1. Create org
        const org = await prisma.organization.create({
            data: {
                name: 'Test Org ' + Math.random(),
                settings: JSON.stringify({ test: true })
            }
        });
        console.log('Org created:', org.id);

        // 2. Create loan
        const loan = await prisma.loan.create({
            data: {
                loanNumber: 'TEST-' + Math.floor(Math.random() * 1000000),
                borrowerName: 'Test Borrower',
                borrowerEmail: 'test@example.com',
                organizationId: org.id
            }
        });
        console.log('Loan created:', loan.id);

        // 3. Create exception
        const exception = await prisma.exception.create({
            data: {
                loanId: loan.id,
                exceptionType: 'MISSING_DOCUMENT',
                documentType: 'BANK_STATEMENT',
                description: 'Test description',
                severity: 'MEDIUM',
                status: 'OPEN'
            }
        });
        console.log('Exception created:', exception.id);
        console.log('SUCCESS');
    } catch (e: any) {
        console.error('SEED SCRIPT FAILED');
        console.error(e);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

main();
