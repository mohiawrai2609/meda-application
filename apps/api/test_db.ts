import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    try {
        const orgs = await prisma.organization.findMany();
        console.log('Orgs:', orgs);
    } catch (e) {
        console.error('Test DB Error:', e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
