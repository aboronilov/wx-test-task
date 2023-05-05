import express from "express";
import bcrypt from "bcryptjs"
import * as EmailValidator from 'email-validator';
import jwt from "jsonwebtoken"

import { User } from "../models";
import { CustomRequest } from "../types";

export const register = async (req: express.Request, res: express.Response) => {
    try {
        const {username, password, avatar, email} = req.body;
        if (!email || !password || !username) {
            return res.status(400).json({msg: "Please provide username, email and password"});
        }
        if (!EmailValidator.validate(email)) {
            return res.status(400).json({msg: "Please provide the valid email"});
         }

        const userExitst = await User.findOne({email})
        if (userExitst) {
            return res.status(400).json({msg: `User with email ${email} allready exits`});
        }

        const avatarPath = avatar ? avatar : "https://upload.wikimedia.org/wikipedia/commons/6/67/User_Avatar.png"
        const salt = bcrypt.genSaltSync(10)
        const hash = bcrypt.hashSync(password, salt)

        const newUser = await User.create({
            username,
            email,
            password: hash,
            avatar: avatarPath
        })
        await newUser.save()


        return res.status(201).json({
            newUser: {
                id: newUser._id,
                email,
            },
            msg: "Successfully registred"
        })
    } catch (error: any) {
        console.log(`Register error - ${error.message}`);
        return res.status(500).json({msg: error.message});
     }
}

export const login = async (req: express.Request, res: express.Response) => {
    try {
        const {email, password} = req.body;
        if (!email || !password) {
            return res.status(400).json({msg: "Please provide email and password"});
        }

        const user = await User.findOne({email})
        const isPasswordCorrect = await bcrypt.compare(password, user.password)
        if (!user || !isPasswordCorrect) {
            return res.status(401).json({msg: "Wrong credentials"})
        }

        const accessToken = jwt.sign(
            {id: user._id}, 
            process.env.JWT_SECRET,
            {expiresIn: "1d"}
        )
        const refreshToken = jwt.sign(
            {id: user._id}, 
            process.env.JWT_SECRET,
            {expiresIn: "14d"}
        )
        res.cookie("accessToken", accessToken)
        res.cookie("refreshToken", refreshToken)

        return res.status(200).json({
            msg: "Login sucessfully",
            user: {
                id: user._id,
                email,
            },
            accessToken,
            refreshToken
        })

    } catch (error: any) {
        console.log(`Login error - ${error.message}`);
        return res.status(500).json({msg: error.message});
     }
}

export const getMe = async (req: CustomRequest, res: express.Response) => {
    try {
        const user = await User.findById(req.userId)
        if (!user) {
            return res.status(401).json({msg: "Access denied"})
        }

        return res.status(200).json({
            msg: "Current user seccessfully recieved",
            user: {
                id: user._id,
                email: user.email,
                avatar: user.avatar
            }
        })      
    } catch (error: any) {
        console.log(`Get current user error - ${error.message}`);
        return res.status(500).json({msg: error.message});
     }
}