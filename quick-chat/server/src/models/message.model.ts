import mongoose, { Document, Schema, Types } from "mongoose";

export interface IMessage extends Document {
    chatId: Types.ObjectId;
    sender: Types.ObjectId;
    text: string;
    image: string;
    read: boolean;
}

const messageSchema = new Schema(
    {
        chatId: { type: Types.ObjectId, required: true, ref: "Chat" },
        sender: { type: Types.ObjectId, required: true, ref: "User" },
        text: { type: String, required: true },
        image: { type: String, required: false },
        read: { type: Boolean, default: false }
    },
    {
        timestamps: true
    }
)

export const Messages = mongoose.model<IMessage>("Messages", messageSchema)