
import { PrismaClient } from '@prisma/client';
import fs from 'fs';

const prisma = new PrismaClient();

async function main() {
    try {
        const org = await prisma.organization.create({
            data: { name: 'Test', settings: {} }
        });
        const loan = await prisma.loan.create({
            data: {
                loanNumber: 'T' + Math.random(),
                borrowerName: 'T',
                borrowerEmail: 't@t.com',
                organizationId: org.id
            }
        });
        await prisma.exception.create({
            data: {
                loanId: loan.id,
                exceptionType: 'MISSING_DOCUMENT',
                documentType: 'BANK_STATEMENT',
                description: 'T'
            }
        });
        fs.writeFileSync('result.txt', 'SUCCESS');
    } catch (e: any) {
        fs.writeFileSync('result.txt', e.message || String(e));
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}
main();
