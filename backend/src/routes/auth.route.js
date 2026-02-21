import express from 'express';
import cors from 'cors';
import { Server } from 'socket.io';
import http from 'http';
import  {login, logout, signup, onboard} from '../controllers/auth.controller.js';
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout); //Note for self: Post is for changing state on the server, even though it's just clearing a cookie

router.post("/onboarding", protectRoute, onboard);

//TODO: forget password, change password routes

router.get("/me", protectRoute, (req, res) => {
  res.status(200).json({ success: true, user: req.user });
});

export default router;