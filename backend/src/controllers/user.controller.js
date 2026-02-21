import User from "../models/User.js";
import FriendRequest from "../models/FriendRequest.js";

export async function getRecommendedUsers(req, res) {
  try {
    const currentUserId = req.user.id;

    // fetch full user from DB
    const currentUser = await User.findById(currentUserId);

    const recommendedUsers = await User.find({
      _id: {
        $ne: currentUserId,
        $nin: currentUser.friends || [],
      },
      isOnboarded: true,
    }).select("-password");

    res.status(200).json(recommendedUsers);

  } catch (error) {
    console.error("Error fetching recommended users:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
}

export async function getMyFriends(req, res) {
    try {
        const user = await User.findById(req.user.id).select("friends")
        .populate("friends", "fullName profilePicture nativeLanguage learningLanguage location bio");
        
        if(!user){
            return res.status(404).json({message: 'User not found'});
        }
        res.status(200).json(user.friends);
    }catch (error){
        console.error('Error fetching friends:', error);
        return res.status(500).json({
            message: 'Internal server error',
            error: error.message
        });
    }
}

export async function sendFriendRequest(req, res) {
    try{
        const myid = req.user.id;
        const { id:recipientId } = req.params;

        if(myid === recipientId){
            return res.status(400).json({message: 'Cannot send friend request to yourself'});
        }
        
        const recipient = await User.findById(recipientId);
        
        if(!recipient){
            return res.status(404).json({message: 'Recipient user not found'});
        }

        if(recipient.friends.some(id => id.toString() === myid)){
            return res.status(400).json({message: 'You are already friends with this user'});
        }

        const existingRequest = await FriendRequest.findOne({
            $or: [
                {sender: myid, recipient: recipientId},
                {sender: recipientId, recipient: myid}
            ]
        });

        if(existingRequest){
            return res.status(400).json({message: 'Friend request already exists between you and this user'});
        }
        
        const friendRequest = await FriendRequest.create({
            sender: myid,
            recipient: recipientId
        });

        res.status(201).json(friendRequest);
    }catch(error){
        console.error('Error sending friend request:', error);
        return res.status(500).json({
            message: 'Internal server error',
            error: error.message
        });
    }
}

export async function acceptFriendRequest(req, res) {
    try{
        const {id:requestId} = req.params;

        const friendRequest = await FriendRequest.findById(requestId);

        if(!friendRequest){
            return res.status(404).json({message: 'Friend request not found'});
        }

        //verify that user is the recipient of the friend request
        if(friendRequest.recipient.toString() !== req.user.id){
            return res.status(403).json({message: 'You are not authorized to accept this friend request'});
        }

        friendRequest.status = 'accepted';
        await friendRequest.save();
        
        //add each other to friends list
        await User.findByIdAndUpdate(friendRequest.sender, {
            $addToSet: {friends: friendRequest.recipient}
        });

        await User.findByIdAndUpdate(friendRequest.recipient, {
            $addToSet: {friends: friendRequest.sender}
        });

        res.status(200).json({message: 'Friend request accepted'});

    } catch(error){
        console.error('Error accepting friend request:', error);
        return res.status(500).json({
            message: 'Internal server error',
            error: error.message
        });
    }
}

export async function getFriendRequests(req, res) {
    try{
        const incomingRequests = await FriendRequest.find({
            recipient: req.user.id, 
            status: 'pending'}).populate('sender', 'fullName profilePicture nativeLanguage learningLanguage location bio');

            const acceptedRequests = await FriendRequest.find({
                sender: req.user.id,
                status: 'accepted'
            }).populate('recipient', 'fullName profilePicture');
            res.status(200).json({incomingRequests, acceptedRequests});
    }catch(error){
        console.error('Error in getFriendRequests Controller', error);
        return res.status(500).json({
            message: 'Internal server error',
            error: error.message
        });
    }
}

export async function getOutgoingFriendRequests(req, res) {
    try{
        const outgoingRequests = await FriendRequest.find({
            sender: req.user.id, 
            status: 'pending'
        }).populate('recipient', 'fullName profilePicture nativeLanguage learningLanguage location bio');

        res.status(200).json(outgoingRequests);
    }catch(error){
        console.error('Error in getOutgoingFriendRequests Controller', error);
        return res.status(500).json({
            message: 'Internal server error',
            error: error.message
        });
    }
}