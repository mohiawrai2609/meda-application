import fs from 'fs';
import csv from 'csv-parser';
import { ExceptionService } from './exception.service';
import { NotificationService } from './notification.service';
import { ExceptionType, DocumentType, Severity } from '@meda/shared';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class CsvImportService {
    private exceptionService: ExceptionService;
    private notificationService: NotificationService;

    constructor() {
        this.exceptionService = new ExceptionService();
        this.notificationService = new NotificationService();
    }

    async importExceptions(filePath: string): Promise<any[]> {
        const results: any[] = [];
        return new Promise<any[]>((resolve, reject) => {
            fs.createReadStream(filePath)
                .pipe(csv())
                .on('data', (data) => results.push(data))
                .on('end', async () => {
                    try {
                        const createdExceptions = [];

                        // 1. Ensure a default organization exists
                        let defaultOrg = await prisma.organization.findFirst();
                        if (!defaultOrg) {
                            defaultOrg = await prisma.organization.create({
                                data: { name: 'Default Bank Corp', settings: JSON.stringify({}) }
                            });
                        }

                        for (const row of results) {
                            const exceptionData = {
                                loan: {
                                    connectOrCreate: {
                                        where: { loanNumber: row.loan_number },
                                        create: {
                                            loanNumber: row.loan_number,
                                            borrowerName: row.borrower_name,
                                            borrowerEmail: row.borrower_email,
                                            organizationId: defaultOrg.id
                                        }
                                    }
                                },
                                exceptionType: row.exception_type as ExceptionType || 'MISSING_DOCUMENT',
                                documentType: (row.missing_document || row.document_type || 'Unknown') as DocumentType,
                                description: row.description,
                                severity: row.severity as Severity || Severity.MEDIUM,
                            };

                            const exception = await this.exceptionService.createException(exceptionData);
                            createdExceptions.push(exception);
                        }

                        // Create notification after successful import
                        await this.notificationService.createNotification({
                            title: 'Data Import Successful',
                            message: `Successfully imported ${createdExceptions.length} records.`,
                            type: 'SUCCESS'
                        });

                        resolve(createdExceptions);
                    } catch (error) {
                        console.error('CSV Import Service Error:', error);
                        reject(error);
                    }
                })
                .on('error', (error) => reject(error));
        });
    }
}
