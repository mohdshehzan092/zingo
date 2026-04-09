import React, { useState } from 'react'
import { IoIosArrowBack } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import { serverUrl } from '../App';
import axios from 'axios';
import { ClipLoader } from 'react-spinners';
const ForgotPassword = () => {

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('')
  const navigate = useNavigate()
  const [otp, setOtp] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [err,setErr] = useState('')
  const [loading, setLoading] = useState(false);

  const handleSendOtp = async() => {
    setLoading(true);
    try {
      const result = await axios.post(`${serverUrl}/api/auth/sent-otp`, {email},
        { withCredentials: true }
      )
      console.log(result);
      setErr("")
      setLoading(false);
      setStep(2)
    }catch (error){
      console.log(error);
      setErr(error?.response?.data?.message);
      setLoading(false);
    }
  }
  const handleVerifyOtp = async() => {
    setLoading(true);
    try {
      const result = await axios.post(`${serverUrl}/api/auth/verify-otp`, {email, otp},
        { withCredentials: true }
      )
      console.log(result);
      setErr("")
      setLoading(false);
      setStep(3)
    }catch (error){
      console.log(error);
      setErr(error?.response?.data?.message);
      setLoading(false);
    }
  }

  const handleResetPassword = async() => {
    setLoading(true)
    if(newPassword != confirmPassword){
      return null;
    }
    try {
      const result = await axios.post(`${serverUrl}/api/auth/reset-password`, {email, newPassword},
        { withCredentials: true }
      )
      console.log(result);
      setErr("")
      navigate("/signin")
      setLoading(false);
    }catch (error){
      setErr(error?.response?.data?.message)
      setLoading(false);
    }
  }

  return (
    <div className='flex w-full items-center justify-center min-h-screen p-4 bg-[#fff9f6]'>
      <div className='bg-white rounded-xl shadow-lg w-full max-w-md p-8'>
        <div className='flex items-center gap-5 mb-4'>
          <IoIosArrowBack size={25} className='text-[#ff4d2d] cursor-pointer' onClick={()=> navigate("/signin")} />
          <h1 className='text-2xl font-bold text-center text-[#ff4d2d]'>Forgot Password</h1>
        </div>
        {step ==1 && <div>
            <div className='mb-6'>
                <label className='block text-gray-700 font-medium mb-1' htmlFor="email">Email</label>
                <input required onChange={(e)=>setEmail(e.target.value)} value={email} className='w-full border-1px rounded-lg px-3 py-2 border-gray-200 focus:outline-none focus:border-orange-500' placeholder='Enter your email' type="email" />
            </div>
            <button disabled={loading} onClick={handleSendOtp} className={`w-full mt-4 font-semibold py-2 rounded-lg transition duration-200 bg-[#ff4d2d] text-white hover:bg-[#e64323] cursor-pointer`}
        >
            {loading?<ClipLoader size={20} color='white' />:"Send Otp"}
        </button>
          { err && <p className='text-red-500 text-center my-2'>{err}</p>}

          </div>
          }
          {step ==2 && <div>
            <div className='mb-6'>
                <label className='block text-gray-700 font-medium mb-1' htmlFor="email">Otp</label>
                <input required onChange={(e)=>setOtp(e.target.value)} value={otp} className='w-full border-1px rounded-lg px-3 py-2 border-gray-200 focus:outline-none focus:border-orange-500' placeholder='Enter your Otp' type="email" />
            </div>
            <button disabled={loading} onClick={handleVerifyOtp} className={`w-full mt-4 font-semibold py-2 rounded-lg transition duration-200 bg-[#ff4d2d] text-white hover:bg-[#e64323] cursor-pointer`}
        >
            {loading?<ClipLoader size={20} color='white' />:"Verify Otp"}
        </button>
        { err && <p className='text-red-500 text-center my-2'>{err}</p>}
          </div>
          }
          {step ==3 && <div>
            <div className='mb-6'>
                <label className='block text-gray-700 font-medium mb-1' htmlFor="New Password">New Password</label>
                <input required onChange={(e)=>setNewPassword(e.target.value)} value={newPassword} className='w-full border-1px rounded-lg px-3 py-2 border-gray-200 focus:outline-none focus:border-orange-500' placeholder='Enter your New Password' type="email" />
            </div>
            <div className='mb-6'>
                <label className='block text-gray-700 font-medium mb-1' htmlFor="Confirm Password">Confirm Password</label>
                <input required onChange={(e)=>setConfirmPassword(e.target.value)} value={confirmPassword} className='w-full border-1px rounded-lg px-3 py-2 border-gray-200 focus:outline-none focus:border-orange-500' placeholder='Enter your Confirm Password' type="email" />
            </div>
            <button disabled={loading} onClick={handleResetPassword} className={`w-full mt-4 font-semibold py-2 rounded-lg transition duration-200 bg-[#ff4d2d] text-white hover:bg-[#e64323] cursor-pointer`}
        >
            {loading?<ClipLoader size={20} color='white' />:"Reset Password"}
        </button>
        { err && <p className='text-red-500 text-center my-2'>{err}</p>}
          </div>
          }
        
      </div>
    </div>
  )
}

export default ForgotPassword