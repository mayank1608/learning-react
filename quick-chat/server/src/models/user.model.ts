import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    profilePic?: string;
}

const UserSchema = new Schema<IUser>(
    {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true, select: false, minlength: 8 },
        profilePic: { type: String, required: false }
    },
    {
        timestamps: true
    }
);


// remove password from response 
UserSchema.set("toJSON", {
    transform: (_doc, ret:any) => {
        delete ret.password; // 👉 Password automatically removed
        return ret;
    }
});


export const User = mongoose.model<IUser>("User", UserSchema);