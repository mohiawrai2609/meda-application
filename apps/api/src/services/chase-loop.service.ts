import { Communication, Exception, MessageType, CommChannel, CommDirection } from '@meda/shared';
import { AIService } from './ai.service';
import { EmailService } from './email.service';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class ChaseLoopService {
    private aiService: AIService;
    private emailService: EmailService;

    constructor() {
        this.aiService = new AIService();
        this.emailService = new EmailService();
    }

    async processNewException(exceptionId: string) {
        console.log(`Processing new exception: ${exceptionId}`);

        // 1. Fetch full exception details
        const exception = await prisma.exception.findUnique({
            where: { id: exceptionId },
            include: { loan: true }
        });

        if (!exception) throw new Error('Exception not found');

        // 2. Generate personalized message via AI
        const message = await this.aiService.generateMessage(
            exception as any,
            exception.loan,
            exception.attemptCount + 1
        );

        // 3. Send email to borrower
        const emailResponse = await this.emailService.sendEmail(
            exception.loan.borrowerEmail,
            message.subject,
            message.body,
            { exceptionId: exception.id }
        );

        // 4. Log communication in DB
        await prisma.communication.create({
            data: {
                exceptionId: exception.id,
                channel: 'EMAIL',
                direction: 'OUTBOUND',
                messageType: 'DOCUMENT_REQUEST',
                subject: message.subject,
                body: message.body,
                sentAt: new Date(),
                metadata: JSON.stringify(emailResponse)
            }
        });

        // 5. Update exception status
        await prisma.exception.update({
            where: { id: exceptionId },
            data: {
                status: 'CONTACTING',
                attemptCount: { increment: 1 },
                firstContactAt: new Date(),
                updatedAt: new Date()
            }
        });

        console.log(`Successfully processed exception ${exceptionId}`);
    }
}
