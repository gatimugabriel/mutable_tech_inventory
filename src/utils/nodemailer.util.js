import { createTransport } from 'nodemailer';
import { mailConfig } from "../config/index.js";
import dotenv from "dotenv"
dotenv.config();

// -- transport config -- //
const transport = createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
        user: mailConfig.EMAIL_SENDER,
        pass: mailConfig.EMAIL_PASSWORD,
    },
});

const sendResetPassword = async (userName, email, token) => {
    const mailOptions = {
        from: mailConfig.EMAIL_SENDER,
        to: email,
        subject: "Password Reset Request ",
        html: `
        <div>
        <h1>Reset your M-Tech Account Password</h1>
        <h2>Hello ${userName}</h2>
        <p>
        You are receiving this email because you (or someone else) has requested a password reset for your Mutable Tech Enterprises Inventory Store account.\nConfirm by clicking on the following link</p>\n
        <a href=${process.env.BASE_API_URL}/reset-password/${token}> Click here to reset your password</a>\n
           If you did not request this, please ignore this email and your password will remain unchanged.
        </div>
        `
    }

    try {
        const info = await transport.sendMail(mailOptions)
        return info
    } catch (error) {
        throw new Error('Failed to send password reset link. Try again later')
    }
}

export default {sendResetPassword}