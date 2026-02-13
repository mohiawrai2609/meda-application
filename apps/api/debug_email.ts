import { PrismaClient } from '@prisma/client';
import { ChaseLoopService } from './src/services/chase-loop.service';
import * as fs from 'fs';

const prisma = new PrismaClient();
const chaseLoop = new ChaseLoopService();

async function debugChaseLoop() {
    const logFile = 'debug_output.txt'; // in current dir
    const logStream = fs.createWriteStream(logFile);

    const log = (msg: string) => {
        console.log(msg);
        logStream.write(msg + '\n');
    };

    try {
        log('--- Debugging Chase Loop ---');

        const exception = await prisma.exception.findFirst({
            orderBy: { createdAt: 'desc' },
            include: { loan: true }
        });

        if (!exception) {
            log('No exceptions found in DB.');
            prisma.$disconnect();
            return;
        }

        log(`Found Exception: ${exception.id}`);
        log(`Borrower: ${exception.loan.borrowerName}`);

        await chaseLoop.processNewException(exception.id);

        log('Chase Loop execution completed.');

        const comms = await prisma.communication.findMany({
            where: { exceptionId: exception.id },
            orderBy: { createdAt: 'desc' },
            take: 1
        });

        log(`Communications found: ${comms.length}`);
        if (comms.length > 0) {
            log('Comm created: ' + JSON.stringify(comms[0]));
        }

    } catch (error) {
        log('DEBUG ERROR: ' + error);
        if (error instanceof Error) {
            log(error.stack || '');
        }
    } finally {
        await prisma.$disconnect();
        logStream.end();
    }
}

debugChaseLoop();
