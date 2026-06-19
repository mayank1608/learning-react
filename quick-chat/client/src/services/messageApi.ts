import api from "./api";


export const createNewMessage = (payload: any) => api.post("/message/new-message", payload);
export const getMessageByChatId = (chatId: any) => api.get(`/message/get-all-messages/${chatId}`);