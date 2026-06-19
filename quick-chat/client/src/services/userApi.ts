import api from "./api";

export const getProfile = () => api.get("/user/profile");
export const getAllUsers = () => api.get("/user/get-all-users");
export const updateProfile = (data: any) => api.put("/profile", data);