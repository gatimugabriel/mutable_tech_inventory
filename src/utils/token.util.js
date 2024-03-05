import jwt from "jsonwebtoken";
const {sign} = jwt
import { authConfig } from '../config/index.js';

const tokenGenerator = async (res, userId, userName, email, role) => {
    const accessToken = await sign(
        {userId, userName, email, role},
        authConfig.jwt_access_token_secret,
        {
            expiresIn: "15m",
        }
    );

    const refreshToken = sign(
        {userId},
        authConfig.jwt_refresh_token_secret,
        {
            expiresIn: "7d",
        }
    );

    // Set access token in HTTP-only cookie
    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
    });

    // Set refresh token in HTTP-only cookie
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
    });

    return { accessToken, refreshToken };
}

export default tokenGenerator

