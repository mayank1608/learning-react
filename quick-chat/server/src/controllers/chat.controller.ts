import Router, { NextFunction, Request, Response } from "express";
import { Chat } from "../models/chat.model";
import { Messages } from "../models/message.model";

const router = Router();

export const createNewChat = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const chat = await Chat.create(req.body);
        await chat.populate('members');

        res.status(201).json({
            message: 'Chat created successfully',
            success: true,
            data: chat
        })
    } catch (error) {
        next(error);
    }
}

export const getAllChats = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const uid = (req as any).userId;
        const allChats = await Chat.find({ members: { $in: uid } })
            .populate('members')
            .populate('lastMessage')
            .sort({ updatedAt: -1 });

        res.status(200).json({
            message: 'Chat fetched successfully',
            success: true,
            data: allChats
        })
    } catch (error) {
        next(error);
    }
}

export const clearAllUnreadMessages = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const chatId = req.body.chatId;

        // 1. clear the unread message count for the given chat
        const chat = await Chat.findById(chatId);
        if (!chat) {
            res.send({
                message: "No Chat found with given chat ID.",
                success: false
            });
        };

        const updatedChat = await Chat.findByIdAndUpdate(
            chatId, 
            { unreadMessageCount: 0 }, 
            { returnDocument: 'after' }
        ).populate('members').populate('lastMessage');

        // make the read property to true for all messages in the given chat
        await Messages.updateMany(
            {chatId , read: false},
            {read: true}
        );

        res.status(200).json({
            message: "Unread message cleared successfully",
            success: true,
            data: updatedChat
        });
    } catch (error) {
        next(error);
    }
}