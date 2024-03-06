import asyncHandler from 'express-async-handler';
import { hash } from "bcrypt";
import { randomBytes } from "crypto";
import db from '../models/index.js';
const { sequelize, User, Token } = db;
import { tokenGenerator, nodemailer } from '../utils/index.js';

// @ desc --- Create new user
// @ route  --POST-- [base_api]/auth/signup
const signUp = asyncHandler(async (req, res) => {
    const { userName, email, password, role } = req.body;

    const t = await sequelize.transaction()

    try {
        const emailExists = await User.findOne({ where: { email } });
        if (emailExists) {
            res.status(409);
            throw new Error("This EMAIL is already in use. Use another email");
        }

        const usernameExists = await User.findOne({ where: { userName } });
        if (usernameExists) {
            res.status(409);
            throw new Error("username is already taken. Try another one");
        }

        const newUser = await User.create({
            userName,
            email,
            password,
            role,
        }, { transaction: t });
        if (!newUser) {
            res.status(500)
            throw new Error('Failed to create user. Try again later')
        }     
      
        await t.commit()
        res.status(201).json({
            message:
                "User created successfully",
            user: {
                userName: newUser.userName,
                email: newUser.email,
                role: newUser.role,
            }
        })
    } catch (error) {
        await t.rollback()
        console.error(error)
        res.status(500)
        throw new Error(error)
    }
})

// @ desc ---- User Login -> set tokens
// @ route  --POST-- [base_api]/auth/signIn
const signIn = asyncHandler(async (req, res) => {
    const { email, userName, password } = req.body;
    let user;

    if (email) {
        user = await User.findOne({ where: { email } });
    } else if (userName) {
        user = await User.findOne({ where: { userName } });
    } else {
        res.status(400);
        throw new Error("Email or username is required");
    }

    if (!user) {
        res.status(404);
        throw new Error("Invalid credentials");
    }

    // compare password
    if (await user.matchPassword(password)) {
        const { accessToken, refreshToken } = await tokenGenerator(
            res,
            user.id,
            user.userName,
            user.email,
            user.role
        );

        // save refresh token
        await Token.create({
            user_id: user.id,
            token: refreshToken,
            action: 'auth',
            expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
        })

        const userData = {
            userName: user.userName,
            email: user.email,
            role: user.role,
        }

        return res.status(200).json({
            user: userData,
            accessToken: accessToken,
        });
    } else {
        res.status(401);
        throw new Error("Invalid Credentials");
    }
});

// @ desc ---- Logout user -> destroy refresh token
// @ route--GET-- [base_api] / auth / sign - out
const signOut = asyncHandler(async (req, res) => {
    const { userId } = req.user

    const destroyToken = await Token.destroy({
        where: { user_id: userId, action: 'auth' }
    })

    if (!destroyToken) {
        res.status(500)
        throw new Error('Failed to logout')
    }

     // clear tokens in http-only cookies
     res.clearCookie("accessToken");
     res.clearCookie("refreshToken");

    res.status(200).json({ message: "Logged Out" });
});

// @ desc ---- Refresh Access Token
// @ route  --POST-- [base_api]/auth/refresh
const refresh = asyncHandler(async (req, res) => {
    const { userId } = req.user
    const user = await User.findByPk(userId)
    if (!user) {
        res.status(404);
        throw new Error("Unknown User");
    }

    // generate new access token
    const { accessToken } = await tokenGenerator(
        res,
        user.id,
        user.userName,
        user.email,
        user.role
    );

    const userData = {
        userName: user.userName,
        userId: user.id,
        email: user.email,
        role: user.role,
    }

    return res.status(200).json({
        user: userData,
        accessToken: accessToken
    });
});

// @ desc ---- Forgot Password
// @ route--POST-- [base_api] /auth/forgot-password
const forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user) {
        res.status(404);
        throw new Error("User not found");
    } else {
        // --- destroy any existing token and assign a new one
        await Token.destroy({ where: { user_id: user.id, action: 'password-reset' } })

        // verification code
        const verificationCode = randomBytes(20).toString("hex")
        const newToken = await Token.create({
            user_id: user.id,
            token: verificationCode,
            action: 'password-reset',
            expires: Date.now() + 3 * 60 * 60 * 1000 // 3 hours
        })

        // send email
        await nodemailer.sendResetPassword(
            user.userName,
            user.email,
            newToken.token
        )
        res.status(201).json({
            passwordResetMessage:
                "A password reset email has been sent to your inbox. Check your email to reset your password ",
        })
    }
})

// @ desc ---- Reset Password
// @ route--PUT-- [base_api]/auth/reset-password/:resetToken
const resetPassword = asyncHandler(async (req, res) => {
    const { password, confirmPassword } = req.body;
    const { resetToken } = req.params;

    if (password !== confirmPassword) {
        res.status(400);
        throw new Error("Passwords do not match");
    }

    const token = await Token.findOne({
        where: {
            action: 'password-reset',
            token: resetToken,
        },
    });

    if (!token) {
        res.status(400);
        throw new Error("Password reset link is invalid or has expired.");
    } else {
        const user = await User.findByPk(token.user_id);

        user.password = await hash(password, 10)
        const updatedUser = await user.save()
        const removeToken = await token.destroy()

        if (!updatedUser || !removeToken) {
            res.status(500);
            throw new Error("Server Error occurred when updating user. Try again later");
        }

        res.status(200).json({ message: "Your password has been reset" });
    }
});

export default {
    signUp,
    signIn,
    signOut,
    refresh,
    forgotPassword,
    resetPassword,
}
