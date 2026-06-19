import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

/**
 * Token Verification
 * @param req 
 * @param res 
 * @param next 
 */
export const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
    debugger;
    try {
        const token = req.headers.authorization?.split(' ')[1];
        const decodedToken: any = jwt.verify(token as string, process.env.SECRET_KEY as string);
        (req as any).userId = decodedToken.userId;
        next();
    } catch (error: any) {
        res.status(500).json({
            message: error.message,
            success: false
        });
    }


}