import { upsertStreamUser } from '../lib/stream.js';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';

export async function signup(req, res) {
    const {email, password, fullName} = req.body;
    try{
        if(!email || !password || !fullName){
            return res.status(400).json({message: 'All fields are required'});
        }

        if(password.length < 6){
            return res.status(400).json({message: 'Password must be at least 6 characters long'});
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailRegex.test(email)){
            return res.status(400).json({message: 'Invalid email format'});
        }

        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({message: 'Email already in use'});
        }

        const randomSeed = Math.random().toString(36).substring(7);//dicebar api to generate random avatar based on seed value
        const randomAvatar =`https://api.dicebear.com/7.x/adventurer/png?seed=${randomSeed}`;

        const newUser = await User.create({
            email,
            password,
            fullName,
            profilePicture: randomAvatar
        })

        try{
            await upsertStreamUser({
                id: newUser._id.toString(),
                name: newUser.fullName,
                image: newUser.profilePicture || "",
            });
            console.log(`Stream user created for ${newUser.fullName}`);
        } catch(error){
            console.error("Error creating Stream user:", error);
        }

        const token = jwt.sign({id: newUser._id, email: newUser.email}, process.env.JWT_SECRET, 
            {expiresIn: '7d'}
        );
        res.cookie("jwt", token, {
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true, // prevents client-side JS from accessing the cookie (XSS protection)
            sameSite: 'strict', //prevents the browser from sending this cookie along with cross-site requests (CSRF protection)
            secure: process.env.NODE_ENV === 'production'
        });
        
        await newUser.save();
        res.status(201).json({ success: true, user: newUser });
    }catch(error){
        console.error('Signup error:', error);
        return  res.status(500).json({message: 'Internal server error'});
    }
}


export async function login(req, res) {
    try{
        const {email, password} = req.body;
        if(!email || !password){
            return res.status(400).json({message: 'Email and password are required'});
        }

        const user = await User.findOne({email});
        if(!user){
            return res.status(401).json({message: 'Invalid email or password'});
        }
        const isPasswordCorrect = await user.comparePassword(password);
        if(!isPasswordCorrect){
            return res.status(401).json({message: 'Invalid email or password'});
        }

        const token = jwt.sign({id: user._id, email: user.email}, process.env.JWT_SECRET, 
            {expiresIn: '7d'}
        );
        res.cookie("jwt", token, {
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            sameSite: 'strict',  
            secure: process.env.NODE_ENV === 'production'
        });

        res.status(200).json({ success: true, user });

    }catch(error){
        console.error('Login error:', error);
        return res.status(500).json({message: 'Internal server error'});
    }
}


export async function logout(req, res) {
    res.clearCookie("jwt");
    res.status(200).json({message: 'Logged out successfully'});
}

export async function onboard(req, res) {
    try{
        const user = req.user;

        const {fullName, bio, nativeLanguage, learningLanguage, location} = req.body;

        if(!fullName || !nativeLanguage || !learningLanguage || !location || !bio){
            return res.status(400).json({
                message: 'All fields are required',
                    missingFields: [
                        !fullName && 'fullName',
                        !bio && 'bio',
                        !nativeLanguage && 'nativeLanguage',
                        !learningLanguage && 'learningLanguage',
                        !location && 'location'
                    ].filter(Boolean) // filter out falsy values
            });
        }

        const updatedUser = await User.findByIdAndUpdate(req.user._id, {
            ...req.body,
            isOnboarded: true
        }, {new: true}).select('-password');
        
        if(!updatedUser){
            return res.status(404).json({message: 'User not found'});
        }

        try{
            await upsertStreamUser({
                id: updatedUser._id.toString(),
                name: updatedUser.fullName,
                image: updatedUser.profilePicture || ""
            });
            console.log(`Stream user updated after onboarding for ${updatedUser.fullName}`);
        } catch(streamError){
            console.error("Error updating Stream user:", streamError);
        }

        res.status(200).json({success: true, user: updatedUser});

    }catch(error){
        console.error('Onboarding error:', error);
        return res.status(500).json({message: 'Internal server error'});
    }
}