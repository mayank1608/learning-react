import mongoose, { Document, Schema, Types } from "mongoose";

export interface IChat extends Document {
    members: Types.ObjectId[];
    lastMessage: Types.ObjectId;
    unreadMessageCount: number;
}

const chatSchema = new Schema<IChat>(
    {
        members: {
            type: [
                { type: Types.ObjectId, ref: "User" }
            ]
        },
        lastMessage: { type: Types.ObjectId, ref: "Messages" },
        unreadMessageCount: { type: Number, default: 0 }
    },
    {
        timestamps: true
    }
);

export const Chat = mongoose.model<IChat>("Chat", chatSchema)