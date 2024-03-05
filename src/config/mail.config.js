import dotenv from 'dotenv';
dotenv.config()

const mailConfig = {
    EMAIL_SENDER: process.env.EMAIL_SENDER,
    EMAIL_PASSWORD: process.env.EMAIL_PASSWORD
}

export default mailConfig
