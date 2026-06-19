import { NextFunction, Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model";

/**
 * Register
 * @param req 
 * @param res 
 */
export const register = async (req: Request, res: Response, next: NextFunction) => {
    try {
        //1. If the user already exists
        const user = await User.findOne({ email: req.body.email });

        //2. if user exists, send an error response
        if (user) {
            // return res.status(400).json({
            //     message: 'User already exists.',
            //     success: false
            // });

            const error = new Error("User already exists.") as any;
            error.statusCode = 404;
            error.success = false;

            return next(error);
        }

        //3. encrypt the password
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        req.body.password = hashedPassword;

        //4. Create new user, save in DB
        // const newUser = await User.create({...req.body, password: hashedPassword});
        const newUser = new User(req.body);
        await newUser.save();

        res.status(201).json({
            message: 'User registered successfully.',
            success: true,
            user: newUser
        });

    } catch (error) {
        // res.status(500).json({ message: "Error creating user", error, status: false });
        next(error);
    }
}

/**
 * Login
 * @param req 
 * @param res 
 */
export const login = async (req: Request, res: Response) => {
    try {
        //1. check if  user exists
        const user = await User.findOne({ email: req.body.email }).select("+password"); // 👉 +password overrides select: false
        if (!user) {
            return res.status(400).json({
                message: "Please enter the registered email Id.",
                success: false
            });
        }

        //2. check if the password is correct
        const validatePassword = await bcrypt.compare(req.body.password, user.password);
        if (!validatePassword) {
            return res.status(400).json({
                message: "Please enter the correct password",
                status: false
            })
        }

        //3. If the user exists & password is correct, assign a JWT
        const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY as string, { expiresIn: "1D" });

        res.status(200).json({
            message: `${user.firstName} ${user.lastName}, Welcome to chat app`,
            success: true,
            token: token
        })
    } catch (error) {
        res.status(500).json({ message: "Error logging user", error, status: false });
    }
}

/**
 * Get loggedin user
 * @param req 
 * @param res 
 */
export const getloggedInUser = async (req: Request, res: Response) => {
    try {
        const user = await User.findOne({ _id: (req as any).userId });

        res.status(200).json({
            message: 'Logged in user fetched successfully',
            success: true,
            data: user
        })
    } catch (error: any) {
        res.status(400).json({
            message: error.message,
            success: false
        })
    }
}

/**
 * Get all users
 * @param req 
 * @param res 
 */
export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).userId;
        const allUsers = (await User.find({ _id: { $ne: userId } }).sort({ createdAt: -1 }))

        res.status(200).json({
            message: "Users list fetched successfully",
            success: true,
            data: allUsers
        })

    } catch (error: any) {
        res.status(400).json({
            message: error.message,
            success: false
        })
    }
}

/** 
 * UPLOAD THE IMAGE TO CLODINARY
*/