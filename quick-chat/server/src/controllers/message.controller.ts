import Router, { NextFunction, Request, Response } from "express";
import { Messages } from "../models/message.model";
import { Chat } from "../models/chat.model";


export const createNewMessage = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const newMessage = await Messages.create(req.body);

        const currentChat = await Chat.findOneAndUpdate(
            { _id: req.body.chatId }, // find the current chat by chatId 
            {
                lastMessage: newMessage._id, // update with latest message
                $inc: { unreadMessageCount: 1 } // increment the count by 1 of unreadMessageCount
            }
        );

        res.status(201).json({
            message: 'Message sent successfully',
            success: true,
            data: newMessage
        })
    } catch (error) {
        next(error);
    }
} 

export const getAllMessagesByChatId = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const allMessages = await Messages.find({chatId: req.params.chatId})
                                        .sort({createdAt: 1});
        res.status(200).json({
            message: 'Messages fetched successfully',
            success: true,
            data: allMessages
        })
    } catch (error) {
        next(error);
    }
}