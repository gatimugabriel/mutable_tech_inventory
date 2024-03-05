import dotenv from 'dotenv';
dotenv.config()

const authConfig = {
    jwt_access_token_secret: process.env['JWT_SECRET_ACCESS_TOKEN'],
    jwt_refresh_token_secret: process.env['JWT_SECRET_REFRESH_TOKEN'],
}

export default authConfig
