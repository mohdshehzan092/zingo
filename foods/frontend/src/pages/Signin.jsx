import axios from 'axios';
import React, { useState } from 'react'
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from 'react-router-dom';
import { serverUrl } from '../App';
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from '../../firebase.js';
import { ClipLoader } from 'react-spinners';
import { useDispatch } from 'react-redux';
import { setUserData } from '../redux/userSlice.js';


const SignIn = () => {
    const primaryColor = '#ff4d2d';
    const hoverColor = '#e64323';
    const bgColor = '#fff9f6';
    const borderColor = '#ddd';

    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    ;
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const [err, setErr] = useState('');
    const dispatch = useDispatch();
    const handleSignIn = async () => {
        setLoading(true);
        try{
            const result = await axios.post(`${serverUrl}/api/auth/signin`, {
                email, password
            }, {withCredentials: true});
            dispatch(setUserData(result.data))
            setErr("")
            setLoading(false);
        }catch(error){
            setErr(error?.response?.data?.message)
            setLoading(false);
        }
    }
     const handleGoogleAuth = async () => {
        
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider);
        console.log(result);
        
        try{
            const {data} = await axios.post(`${serverUrl}/api/auth/google-auth`, {                
                email: result.user.email,
            }, {withCredentials: true});
            dispatch(setUserData(data))            
        }catch(error){
            console.log(error);
        }
    }
    
  return (
    <div className='min-h-screen w-full flex items-center justify-center p-4' style={{backgroundColor: bgColor}}>
        <div className={`bg-white rounded-xl shadow-lg w-full max-w-md p-8`} style={{border: `1px solid ${borderColor}`}}>
            <h1 className={`text-3xl font-bold mb-2`} style={{color: primaryColor}}>Zingo</h1>
            <p className='text-gray-800 mb-8'>Sign In to your account to get started with delicious food deliveries</p>
            

            <div className='mb-4'>
                <label className='block text-gray-700 font-medium mb-1' htmlFor="email">Email</label>
                <input required onChange={(e)=>setEmail(e.target.value)} value={email} className='w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-orange-500' placeholder='Enter your email' type="email" style={{border: `1px solid ${borderColor}`}}/>
            </div>

           

            <div className='mb-4'>
                <label className='block text-gray-700 font-medium mb-1' htmlFor="password">Password</label>
                <div className='relative'>
                    <input required onChange={(e)=>setPassword(e.target.value)} value={password} className='w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-orange-500' placeholder='Enter your password' type={`${showPassword? "text" : "password"}`} style={{border: `1px solid ${borderColor}`}}/>
                <button className='absolute right-3 cursor-pointer top-3 text-gray-500' onClick={()=>setShowPassword(prev=>!prev)}>{!showPassword?<FaEye />:<FaEyeSlash />}</button>
                </div>
            </div>
            <div className='text-right mb-4 text-[#ff4d2d] cursor-pointer hover:underline' onClick={()=>navigate("/forgot-password")}>
              forgot password
            </div>
        
        <button disabled={loading} onClick={handleSignIn} className={`w-full mt-4 font-semibold py-2 rounded-lg transition duration-200 bg-[#ff4d2d] text-white hover:bg-[#e64323] cursor-pointer`}
        >{loading?<ClipLoader size={24} color='white' />:"Sign In"}
        </button>
        { err && <p className='text-red-500 text-center my-2'>{err}</p>}
        <h4 className='w-full mt-2 flex items-center justify-center'>or</h4>
        <button onClick={handleGoogleAuth} className='w-full mt-3 flex items-center justify-center gap-2 border rounded-lg px-4 py-2 transition duration-200 border-gray-400 hover:bg-gray-100 cursor-pointer'>
            <FcGoogle size={24} />
            <span>Sign In with Google</span>
        </button>
        <p className='text-center mt-5 cursor-pointer' onClick={()=>navigate("/signup")}>Want to create a new account? <span className='text-[#ff4d2d]'>Sign up</span></p>
        </div>
    </div>
  )
}

export default SignIn