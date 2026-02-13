import { PrismaClient } from '@prisma/client';
import { Exception, ExceptionStatus, ExceptionType, Severity, DocumentType } from '@meda/shared';
import { ChaseLoopService } from './chase-loop.service';

const prisma = new PrismaClient();

export class ExceptionService {
    async getExceptions(filter: any = {}) {
        return prisma.exception.findMany({
            where: filter,
            include: {
                loan: true,
                assignedTo: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }

    async getExceptionById(id: string) {
        return prisma.exception.findUnique({
            where: { id },
            include: {
                loan: true,
                assignedTo: true,
                documents: true,
                communications: {
                    orderBy: { createdAt: 'desc' }
                },
                auditLogs: {
                    orderBy: { createdAt: 'desc' }
                }
            },
        });
    }

    async createException(data: any) {
        // Basic rule-based classification fallback if not provided
        if (!data.exceptionType) {
            data.exceptionType = ExceptionType.MISSING_DOCUMENT; // Default
        }

        try {
            const result = await prisma.exception.create({
                data: {
                    ...data,
                    status: ExceptionStatus.OPEN,
                    auditLogs: {
                        create: {
                            action: 'exception.created',
                            details: JSON.stringify({ source: 'manual_creation' })
                        }
                    }
                },
            });

            // Trigger async chase loop (fire and forget)
            const chaseLoop = new ChaseLoopService();
            chaseLoop.processNewException(result.id).catch(err => console.error('Chase Loop Error:', err));

            return result;
        } catch (error) {
            console.error('Prisma Create Exception Error:', error);
            throw error;
        }
    }

    async updateException(id: string, data: any) {
        return prisma.exception.update({
            where: { id },
            data,
        });
    }

    async resolveException(id: string) {
        return prisma.exception.update({
            where: { id },
            data: {
                status: ExceptionStatus.RESOLVED,
                resolvedAt: new Date(),
                updatedAt: new Date(),
                auditLogs: {
                    create: {
                        action: 'exception.resolved',
                        details: JSON.stringify({ user: 'processor' }) // In real app, use auth user ID
                    }
                }
            }
        });
    }

    async rejectException(id: string, reason: string) {
        // Logic: Re-open exception, maybe increment attempt count or reset status
        // For MVP: Set to open and trigger chase loop again
        const result = await prisma.exception.update({
            where: { id },
            data: {
                status: ExceptionStatus.OPEN,
                updatedAt: new Date(),
                auditLogs: {
                    create: {
                        action: 'exception.rejected',
                        details: JSON.stringify({ reason, user: 'processor' })
                    }
                }
            }
        });

        // Re-trigger loop? Or just leave open? 
        // Let's re-trigger loop to notify user of rejection.
        const chaseLoop = new ChaseLoopService();
        chaseLoop.processNewException(result.id).catch(console.error);

        return result;
    }
}
