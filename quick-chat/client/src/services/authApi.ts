import api from "./api";

export const login = (data: any) => api.post("/user/login", data);
export const register = (data: any) => api.post("/user/register", data);