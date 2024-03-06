import asyncHandler from "express-async-handler";
import { hash } from "bcrypt";
import db from "../models/index.js";
const { User, Token } = db;
import { tokenGenerator } from "../utils/index.js";

// @ desc --- Get user profile
// route  --POST-- [base_api]/u/profile
const getUserProfile = asyncHandler(async (req, res) => {
    const { userId } = req.user;
    const user = await User.findByPk(userId, {
        attributes: {
            exclude: [
                "password"
            ]
        }
    })

    if (!user) {
        res.status(404)
        throw new Error('User not found')
    }
    res.status(200).json(user);
});

// @ desc --- Update user profile
// route  --PUT-- [base_api]/u/profile
const updateUserProfile = asyncHandler(async (req, res) => {
    const { userId } = req.user;
    const { userName, email, password } = req.body

    const user = await User.findByPk(userId);
    if (!user) {
        res.status(404);
        throw new Error("User not found");
    }

    if (email && (email !== user.email)) {
        const existingEmail = await User.findOne({ where: { email } })
        if (existingEmail) {
            res.status(409)
            throw new Error('Such EMAIL is already in use. Use another one')
        }
    }

    if (userName && (userName !== user.userName)) {
        const existingUserName = await User.findOne({ where: { userName } })
        if (existingUserName) {
            res.status(409)
            throw new Error('Such username is already taken. Try another one')
        }
    }


    // update user details
    user.userName = userName || user.userName;
    user.email = email || user.email;
    if (password) {
        user.password = await hash(password, 10);
    }
    await user.save();

    // generate new access tokens for updated user
    const {
        accessToken, refreshToken
    } = await tokenGenerator(res, user.id, user.userName, user.email, user.role);

    // destroy old refresh token
    await Token.destroy({
        where: { user_id: user.id, action: 'auth' }
    })

    // save the new refresh token
    await Token.create({
        user_id: user.id,
        token: refreshToken,
        action: 'auth',
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    })


    const updatedUserData = {
        email: user.email,
        userName: user.userName,
        role: user.role,
    }

    res.status(200).json({
        success: true,
        message: "Profile Updated Successfully",
        user: updatedUserData,
        accessToken: accessToken
    })
});

// @ desc --- Delete user profile
// route  --DELETE-- [base_api]/u/profile
const deleteUserProfile = asyncHandler(async (req, res) => {
    const { userId } = req.user;
    const user = await User.findByPk(userId);

    if (!user) {
        res.status(404);
        throw new Error("User not found");
    }

    const deletedUser = await user.destroy();

    if (deletedUser) {
        res.status(200).json({ message: "Profile deleted successfully" });
    } else {
        res.status(500);
        throw new Error("Failed to delete user profile");
    }
});

// --- SUPER USER ROUTE
// @ desc --- GET all user profiles
// route  --GET-- [base_api]/u/profile/all
const getAllProfiles = asyncHandler(async (req, res) => {
    const users = await User.findAll()
    if (!users) {
        res.status(500);
        throw new Error("Error occurred when fetching users");
    }
    res.status(200).send(users);

})


export default {
    getUserProfile,
    updateUserProfile,
    deleteUserProfile,
    getAllProfiles
}
