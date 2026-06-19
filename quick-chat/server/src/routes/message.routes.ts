import Router from "express";
import { createNewMessage, getAllMessagesByChatId } from "../controllers/message.controller";
import { verifyToken } from "../middlewares/auth";

const router = Router();

router.post('/new-message', verifyToken, createNewMessage);

router.get('/get-all-messages/:chatId', verifyToken, getAllMessagesByChatId);


export default router