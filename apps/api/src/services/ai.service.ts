import Anthropic from '@anthropic-ai/sdk';
import { Exception, ExceptionType, DocumentType } from '@meda/shared';

export class AIService {
    private anthropic: Anthropic;
    private apiKey: string | undefined;

    constructor() {
        this.apiKey = process.env.ANTHROPIC_API_KEY;

        // Initialize Anthropic client (will throw if key is missing later, handled in methods)
        if (this.apiKey) {
            this.anthropic = new Anthropic({
                apiKey: this.apiKey,
            });
        } else {
            console.warn('ANTHROPIC_API_KEY is missing. AI features will be disabled.');
            // dummy client to prevent crash on init
            this.anthropic = { messages: { create: async () => ({}) } } as any;
        }
    }

    async generateMessage(exception: Exception, loanContext: any, attemptCount: number): Promise<{ subject: string; body: string }> {
        if (!this.apiKey || this.apiKey.startsWith('sk-ant-api03-...')) {
            // Return mock response if no API key is set
            console.log('Using Mock AI Response (No API Key)');
            return {
                subject: `Action Required: Mortgage Document Issue - ${loanContext.loanNumber}`,
                body: `Hello ${loanContext.borrowerName},\n\nWe are reviewing your mortgage application and noticed an issue with your ${exception.documentType}.Specifically: ${exception.description}.\n\nPlease upload the corrected document using the link below.\n\nThank you,\nLoan Processing Team`
            };
        }

        const systemPrompt = `You are a mortgage document assistant. Your job is to write clear, friendly emails to borrowers explaining what documents they need to provide for their mortgage application.
    Rules:
    - Write at an 8th grade reading level
    - Be warm and reassuring
    - Be SPECIFIC about exactly what is needed
    - Include the account details they should look for
    - Never use mortgage jargon
    - Keep emails under 200 words
    - Always include a clear call to action`;

        const userPrompt = `Generate an email for the following exception:
    - Borrower name: ${loanContext.borrowerName}
    - Exception type: ${exception.exceptionType}
    - Document type: ${exception.documentType}
    - Specific issue: ${exception.description}
    - Loan details: Loan #${loanContext.loanNumber}
    - Attempt number: ${attemptCount}
    
    Return ONLY a JSON object with "subject" and "body" keys. Do not include any other text.`;

        try {
            const response = await this.anthropic.messages.create({
                model: 'claude-3-haiku-20240307',
                max_tokens: 1024,
                system: systemPrompt,
                messages: [{ role: 'user', content: userPrompt }],
            });

            const content = (response.content[0] as any).text;
            const jsonResponse = JSON.parse(content);
            return {
                subject: jsonResponse.subject,
                body: jsonResponse.body
            };

        } catch (error) {
            console.error('Claude API Error:', error);
            throw new Error('Failed to generate message via AI');
        }
    }

    async validateDocument(fileBuffer: Buffer, exception: Exception): Promise<any> {
        // Placeholder for Sprint 3 (Document Validation)
        if (!this.apiKey) return { status: 'ACCEPTED', confidence: 1.0 };

        // Impl: Send image/pdf to Claude Vision
        return { status: 'ACCEPTED', confidence: 0.95 };
    }
}
