import sgMail from '@sendgrid/mail';
import nodemailer from 'nodemailer';

export class EmailService {
    private apiKey: string | undefined;
    private fromEmail: string;
    private transporter: nodemailer.Transporter | undefined;

    constructor() {
        this.apiKey = process.env.SENDGRID_API_KEY!;
        this.fromEmail = process.env.SENDGRID_FROM_EMAIL || 'docs@meda.ai';

        if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
            console.log('Initializing Nodemailer with Gmail...');
            this.transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.GMAIL_USER,
                    pass: process.env.GMAIL_APP_PASSWORD,
                },
            });
        }
        else if (this.apiKey && !this.apiKey.startsWith('SG.xxxxxxxx')) {
            sgMail.setApiKey(this.apiKey);
        } else {
            console.warn('No Email Provider Configured. Emails will be logged to console only.');
            this.apiKey = undefined;
        }
    }

    async sendEmail(to: string, subject: string, body: string, trackingMetadata?: any) {
        // Option 1: Gmail (Nodemailer)
        if (this.transporter) {
            try {
                console.log(`Sending Real Email via Gmail to: ${to}`);
                const info = await this.transporter.sendMail({
                    from: `"Meda Loan Team" <${process.env.GMAIL_USER}>`,
                    to: to,
                    subject: subject,
                    text: body,
                    html: body.replace(/\n/g, '<br>'),
                });
                console.log('Email sent: %s', info.messageId);
                return { messageId: info.messageId };
            } catch (error) {
                console.error('Nodemailer Error:', error);
                throw error;
            }
        }

        // Option 2: SendGrid
        if (this.apiKey) {
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

        // Option 3: Mock (Console Log)
        console.log('=== MOCK EMAIL SENT (No Provider) ===');
        console.log(`To: ${to}`);
        console.log(`Subject: ${subject}`);
        console.log('=======================');
        return { messageId: 'mock-email-id' };
    }
}
