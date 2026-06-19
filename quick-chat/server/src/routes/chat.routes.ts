import Router from "express";
import { verifyToken } from "../middlewares/auth";
import { clearAllUnreadMessages, createNewChat, getAllChats } from "../controllers/chat.controller";

const router = Router();

router.post('/create-new-chat', verifyToken, createNewChat);

router.get('/get-all-chats', verifyToken, getAllChats);

router.post('/clear-unread-messages', verifyToken, clearAllUnreadMessages);

export default router;