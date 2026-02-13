import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    try {
        const comms = await prisma.communication.findMany({
            orderBy: { createdAt: 'desc' },
            take: 5
        });
        console.log('Recent Communications:', JSON.stringify(comms, null, 2));
    } catch (e) {
        console.error('Error fetching communications:', e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
