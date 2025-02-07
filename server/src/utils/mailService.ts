import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: process.env.SMTP_SERVICE,
    secure: true,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

export default transporter;