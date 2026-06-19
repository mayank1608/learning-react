import api from "./api";

export const getAllChats = () => api.get("/chat/get-all-chats");
export const createNewChat = (members: any) => api.post("/chat/create-new-chat", { members });
export const clearAllUnreadMessageCount = (chatId: any) => api.post("/chat/clear-unread-messages", { chatId: chatId });