import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { 
    getRecommendedUsers, 
    getMyFriends, 
    sendFriendRequest,
    acceptFriendRequest,
    getFriendRequests,
    getOutgoingFriendRequests} from "../controllers/user.controller.js";
import { get } from "mongoose";

const router = express.Router();

//apply to all routes below
router.use(protectRoute);

router.get("/", getRecommendedUsers);
router.get("/friends", getMyFriends);

router.post("/friend-request/:id", sendFriendRequest);
router.put("/friend-request/:id/accept", acceptFriendRequest);
router.get("/friend-requests", getFriendRequests);
router.get("/outgoing-friend-requests", getOutgoingFriendRequests);
//TODO: reject friend request, unfriend routes

export default router;