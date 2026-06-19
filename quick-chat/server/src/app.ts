import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./routes/user.routes";
import chatRoutes from "./routes/chat.routes";
import messageRoutes from "./routes/message.routes";
import http from "http";
import socket from "socket.io";
import { errorHandler } from "./middlewares/error.middleware";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const server = http.createServer(app);

const io = new socket.Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ['GET', 'POST']
    }
})

// User Routes
app.use("/api/user", userRoutes);

// Chat Routes
app.use("/api/chat", chatRoutes);

// Message Routes
app.use("/api/message", messageRoutes);

// Global Error Handler
app.use(errorHandler);


io.on("connection", (socket) => {
    // console.log("User connected:", socket.id);

    socket.on("join-room", (userId) => {
        socket.join(userId);
    });

    socket.on('send-msg', (message) => {
        console.log(message);
        io
        .to(message.members[0])
        .to(message.members[1])
        .emit('receive-msg', message);

        io
        .to(message.members[0])
        .to(message.members[1])
        .emit('set-msg-count', message)
    })

    socket.on('clear-unread-msg', (data) => {
        console.log(data);
        io
        .to(data.members[0])
        .to(data.members[1])
        .emit('msg-count-cleared', data);
    })

    // socket.on("disconnect", () => {
    //     console.log("User disconnected:", socket.id);
    // });
});


export default server;