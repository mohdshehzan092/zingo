import express from 'express';
import { signup, signin, signout, sentOtp, verifyOtp,resetPassword, googleAuth } from '../controllers/authControllers.js';

const authRouter = express.Router();

authRouter.post('/signup', signup)
authRouter.post('/signin', signin)
authRouter.get('/signout', signout)
authRouter.post('/sent-otp', sentOtp)
authRouter.post('/verify-otp', verifyOtp)
authRouter.post('/reset-password', resetPassword)
authRouter.post('/google-auth', googleAuth)


export default authRouter;