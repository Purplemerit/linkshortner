import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.example.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
        user: process.env.SMTP_USER || 'user',
        pass: process.env.SMTP_PASS || 'pass',
    },
});

export async function sendEmail({ to, subject, html }: { to: string; subject: string; html: string }) {
    // If no real SMTP config is present, just log (Simulate for Dev)
    if (!process.env.SMTP_HOST) {
        console.log('=================================================================');
        console.log(`[EMAIL SIMULATION] To: ${to}`);
        console.log(`[EMAIL SIMULATION] Subject: ${subject}`);
        console.log(`[EMAIL SIMULATION] Content: ${html}`);
        console.log('=================================================================');
        return true;
    }

    try {
        await transporter.sendMail({
            from: process.env.SMTP_FROM || '"LinkShortener" <noreply@example.com>',
            to,
            subject,
            html,
        });
        return true;
    } catch (error) {
        console.error('Failed to send email:', error);
        return false;
    }
}
