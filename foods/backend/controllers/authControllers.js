import User from "../models/userModel.js";
import genToken from "../utils/token.js";
import bcrypt from "bcrypt"
import { sendOtpMail } from "../utils/mail.js";

export const signup = async (req, res) => {
    try{
        const {fullName, email, password, mobileNumber, role} = req.body;

        let user = await User.findOne({email});
        if(user){
            return res.status(400).json({message:"User already exists"});
        }

        if(password.length < 6){
            return res.status(400).json({message : "password must be at least 6 characters"})
        }
        if(mobileNumber.length < 10){
            return res.status(400).json({message: "mobile number must be at least 10 digits"})
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        user = await User.create({
            fullName,
            email,
            role,
            mobileNumber,
            password: hashedPassword
        })

        const token = await genToken(user._id)
        res.cookie("token", token, {
            secure: false,
            sameSite: "strict",
            maxAge: 7*24*60*60*1000,
            httpOnly: true
        })

        return res.status(201).json(user)
    }catch(error){
        return res.status(500).json(`sign up error ${error}`)
    }
}

export const signin = async (req, res) => {
    try{
        const {email, password} = req.body;

        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({message:"User does not exist"});
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(400).json({message: "Invalid credentials"});
        }

        const token = await genToken(user._id)
        res.cookie("token", token, {
            secure: false,
            sameSite: "strict",
            maxAge: 7*24*60*60*1000,
            httpOnly: true
        })

        return res.status(200).json(user)
    }catch(error){
        return res.status(500).json(`sign in error ${error}`)
    }
}

export const signout = async (req, res) => {
    try {
        res.clearCookie("token")
        return res.status(200).json({message: "logged out successfully"})
    }catch (error){
        return res.status(500).json(`sign out error ${error}`)
    }
}

export const sentOtp = async (req, res) => {
    try {
        const {email} = req.body;
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({message: "User does not exist" });
        }
        const otp = Math.floor(100000 + Math.random() * 9000).toString();
        user.resetOtp = otp;
        user.otpExpires = Date.now() + 5 * 60 * 1000;
        user.isOtpVerified = false;

        await user.save();
        await sendOtpMail(email, otp);
        return res.status(200).json({message: "OTP sent to your email address"})
    } catch (error) {
        return res.status(500).json(`set OTP error ${error}`)
    }
}

export const verifyOtp = async (req, res) => {
    try {
        const {email, otp} = req.body;
        const user = await User.findOne({email});

        if(!user || user.resetOtp!=otp || user.otpExpires<Date.now()){
            return res.status(400).json({message: "Invalid OTP"})
        }
        user.resetOtp = undefined;
        user.otpExpires = undefined;
        user.isOtpVerified = true;

        await user.save();
        return res.status(200).json({message: "OTP verified successfully"})
    } catch (error) {
        return res.status(500).json(`verify OTP error ${error}`)
    }
}

export const resetPassword = async (req, res) => {
    try {
        const {email, newPassword} = req.body;
        const user = await User.findOne({email});
        if(!user || !user.isOtpVerified){
            return res.status(400).json({message: "otp verification required"});
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        user.isOtpVerified = false;

        await user.save();
        return res.status(200).json({message: "password reset successful"})

    } catch (error) {
        return res.status(500).json(`reset password error ${error}`)
    }
}

export const googleAuth = async (req, res) => {
    try {
        const {fullName, email, mobileNumber, role} = req.body;
        const user = await User.findOne({email})
        if(!user){
            user = await User.create({
                fullName,
                email,
                mobileNumber,
                role
            })
        }
        const token = await genToken(user._id)
        res.cookie("token", token, {
            secure: false,
            sameSite: "strict",
            maxAge: 7*24*60*60*1000,
            httpOnly: true
        })
        return res.status(200).json(user)

    } catch (error) {
        return res.status(500).json(`google auth error ${error}`)
    }
}