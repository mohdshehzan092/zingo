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

const Signup = () => {
    const primaryColor = '#ff4d2d';
    const hoverColor = '#e64323';
    const bgColor = '#fff9f6';
    const borderColor = '#ddd';

    const [showPassword, setShowPassword] = useState(false);
    const [role, setRole] = useState('user');
    const navigate = useNavigate();
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [mobile, setMobile] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();

    const handleSignup = async () => {
        setLoading(true);
        try{
            const result = await axios.post(`${serverUrl}/api/auth/signup`, {
                fullName, email, mobileNumber: mobile, password, role
            }, {withCredentials: true});
            dispatch(setUserData(result.data))
            setError('')
            setLoading(false);
        }catch(error){
            setError(error?.response?.data?.message)
            setLoading(false);
        }
    }

    const handleGoogleAuth = async () => {
        if(!mobile){
           return setError("mobile number is required");
        }
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider);
        console.log(result);
        
        try{
            const {data} = await axios.post(`${serverUrl}/api/auth/google-auth`, {
                fullName: result.user.displayName,
                email: result.user.email,
                role,
                mobileNumber: mobile
            }, {withCredentials: true});
            dispatch(setUserData(data))
            console.log(data);
            
        }catch(error){
            console.log(error);
        }
    }

  return (
    <div className='min-h-screen w-full flex items-center justify-center p-4' style={{backgroundColor: bgColor}}>
        <div className={`bg-white rounded-xl shadow-lg w-full max-w-md p-8`} style={{border: `1px solid ${borderColor}`}}>
            <h1 className={`text-3xl font-bold mb-2`} style={{color: primaryColor}}>Zingo</h1>
            <p className='text-gray-800 mb-8'>Create your account to get started with delicious food deliveries</p>
            
            <div className='mb-4'>
                <label className='block text-gray-700 font-medium mb-1' htmlFor="full name">Full Name</label>
                <input required onChange={(e)=>setFullName(e.target.value)} value={fullName} className='w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-orange-500' placeholder='Enter your name' type="text" style={{border: `1px solid ${borderColor}`}}/>
            </div>

            <div className='mb-4'>
                <label className='block text-gray-700 font-medium mb-1' htmlFor="email">Email</label>
                <input required onChange={(e)=>setEmail(e.target.value)} value={email} className='w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-orange-500' placeholder='Enter your email' type="email" style={{border: `1px solid ${borderColor}`}}/>
            </div>

            <div className='mb-4'>
                <label className='block text-gray-700 font-medium mb-1' htmlFor="mobile">Mobile</label>
                <input required onChange={(e)=>setMobile(e.target.value)} value={mobile} className='w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-orange-500' placeholder='Enter your mobile number' type="text" style={{border: `1px solid ${borderColor}`}}/>
            </div>

            <div className='mb-4'>
                <label className='block text-gray-700 font-medium mb-1' htmlFor="password">Password</label>
                <div className='relative'>
                    <input onChange={(e)=>setPassword(e.target.value)} value={password} className='w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-orange-500' placeholder='Enter your password' type={`${showPassword? "text" : "password"}`} style={{border: `1px solid ${borderColor}`}}/>
                <button className='absolute right-3 cursor-pointer top-3 text-gray-500' onClick={()=>setShowPassword(prev=>!prev)}>{!showPassword?<FaEye />:<FaEyeSlash />}</button>
                </div>
            </div>

            <div className='mb-4'>
                <label className='block text-gray-700 font-medium mb-1' htmlFor="role">Role</label>
                <div className='flex gap-3'>
                    {['user', 'owner', 'deliveryBoy'].map((r)=>(
                        <button onClick={()=>setRole(r)} className='flex-1 border cursor-pointer rounded-lg px-3 py-2 text-center font-medium transition-colors' style={
                            role==r?
                            {backgroundColor:primaryColor,color:'white'}:{border:`1px solid ${primaryColor}`, color:primaryColor}
                        }>{r}</button>
                    ))}    
                </div>
            </div>

        <button onClick={handleSignup} className={`w-full mt-4 font-semibold py-2 rounded-lg transition duration-200 bg-[#ff4d2d] text-white hover:bg-[#e64323] cursor-pointer`} disabled={loading}>
            {loading?<ClipLoader size={24} color='white' />:"Sign Up"}
        </button>
        {error && <p className='text-red-500 text-center my-2'>{error}</p>}
        <h4 className='w-full mt-2 flex items-center justify-center'>or</h4>
        <button onClick={handleGoogleAuth} className='w-full mt-3 flex items-center justify-center gap-2 border rounded-lg px-4 py-2 transition duration-200 border-gray-400 hover:bg-gray-100 cursor-pointer'>
            <FcGoogle size={24} />
            <span>Sign up with Google</span>
        </button>
        <p className='text-center mt-5 cursor-pointer' onClick={()=>navigate("/signin")}>Already have an account? <span className='text-[#ff4d2d]'>Sign In</span></p>
        </div>
    </div>
  )
}

export default Signup