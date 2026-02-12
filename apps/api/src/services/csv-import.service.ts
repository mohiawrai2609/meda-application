import fs from 'fs';
import csv from 'csv-parser';
import { ExceptionService } from './exception.service';
import { ExceptionType, DocumentType, Severity } from '@meda/shared';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class CsvImportService {
    private exceptionService: ExceptionService;

    constructor() {
        this.exceptionService = new ExceptionService();
    }

    async importExceptions(filePath: string) {
        const results: any[] = [];
        return new Promise((resolve, reject) => {
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
                                data: { name: 'Default Bank Corp', settings: {} }
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
                                exceptionType: row.exception_type as ExceptionType,
                                documentType: row.document_type as DocumentType,
                                description: row.description,
                                severity: row.severity as Severity || Severity.MEDIUM,
                            };

                            const exception = await this.exceptionService.createException(exceptionData);
                            createdExceptions.push(exception);
                        }
                        resolve(createdExceptions);
                    } catch (error) {
                        reject(error);
                    }
                })
                .on('error', (error) => reject(error));
        });
    }
}
