import sgMail from '@sendgrid/mail';

export class EmailService {
    private apiKey: string | undefined;
    private fromEmail: string;

    constructor() {
        this.apiKey = process.env.SENDGRID_API_KEY!;
        this.fromEmail = process.env.SENDGRID_FROM_EMAIL || 'docs@meda.ai';

        if (this.apiKey && !this.apiKey.startsWith('SG.xxxxxxxx')) {
            sgMail.setApiKey(this.apiKey);
        } else {
            console.warn('SENDGRID_API_KEY is missing or invalid. Emails will be logged to console only.');
            this.apiKey = undefined;
        }
    }

    async sendEmail(to: string, subject: string, body: string, trackingMetadata?: any) {
        if (!this.apiKey) {
            console.log('=== MOCK EMAIL SENT ===');
            console.log(`To: ${to}`);
            console.log(`From: ${this.fromEmail}`);
            console.log(`Subject: ${subject}`);
            console.log(`Body: ${body}`);
            console.log('=======================');
            return { messageId: 'mock-email-id' };
        }

        const msg = {
            to,
            from: this.fromEmail,
            subject,
            text: body, // Fallback plain text
            html: body.replace(/\n/g, '<br>'), // Simple HTML conversion
            customArgs: trackingMetadata,
        };

        try {
            const response = await sgMail.send(msg);
            return response[0];
        } catch (error) {
            console.error('SendGrid Error:', error);
            throw error;
        }
    }
}
