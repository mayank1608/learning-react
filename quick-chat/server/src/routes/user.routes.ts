import { Router } from "express";
import { getAllUsers, getloggedInUser, login, register } from "../controllers/user.controller"
import { verifyToken } from "../middlewares/auth";


const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/profile', verifyToken, getloggedInUser);
router.get('/get-all-users', verifyToken, getAllUsers);


export default router

