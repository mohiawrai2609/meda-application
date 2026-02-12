
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
});

async function main() {
    try {
        console.log('Attempting to connect to database...');
        // Simple query to test connection
        const count = await prisma.loan.count();
        console.log('Success! Loan count:', count);
    } catch (error) {
        console.error('DATABASE CONNECTION ERROR:');
        console.error(error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
