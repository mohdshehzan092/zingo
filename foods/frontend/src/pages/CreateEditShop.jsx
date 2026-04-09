import React, { useState } from 'react'
import { IoMdArrowRoundBack } from "react-icons/io";
import { useDispatch, useSelector } from 'react-redux';
import { GiForkKnifeSpoon } from "react-icons/gi";
import {useNavigate} from 'react-router-dom';
import { serverUrl } from '../App';
import { setMyShopData } from '../redux/ownerSlice';
import axios from 'axios';
const CreateEditShop = () => {
    const navigate = useNavigate();
    const {myShopData} = useSelector(state=>state.owner)
    const {currentCity, currentState } = useSelector(state=>state.user)
    const [name, setName] = useState(myShopData?.name || "");
    const [address, setAddress] = useState(myShopData?.address || "");
    const [city, setCity] = useState(myShopData?.city || currentCity);
    const [state, setState] = useState(myShopData?.state || currentState);
    const [frontendImage, setFrontendImage] = useState(myShopData?.image.url || null);
    const [backendImage, setBackendImage] = useState(null);
    const [loading,setLoading] = useState(false);
    const dispatch = useDispatch();
    const handleImage = (e)=>{
        const file = e.target.files[0];
        setBackendImage(file);
        setFrontendImage(URL.createObjectURL(file));
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("name", name);
            formData.append("city", city);
            formData.append("state", state);
            formData.append("address", address);
            if(backendImage){
                formData.append("image", backendImage);
            }
            const result = await axios.post(`${serverUrl}/api/shop/create-edit-shop`, formData, {withCredentials: true})
            dispatch(setMyShopData(result.data))
            setLoading(false);
            navigate('/')
            
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    }
  return (
    <div
    className='flex justify-center flex-col items-center p-6 bg-linear-to-br from-orange-50 relative to-white min-h-screen'
    >
        <div className='absolute top-2 z-10 mb-2.5' onClick={()=>navigate("/")}>
            <IoMdArrowRoundBack size={35} className='  text-[#ff4d2d]
    transition-all
    duration-300
    hover:text-orange-600
    hover:drop-shadow-[0_0_20px_#ff4d2a]
    hover:scale-125'/>
        </div>
        <div className='max-w-lg w-full bg-white shadow-xl p-8 border border-orange-100'>
            <div className='flex flex-col items-center mb-8'>
                <div className='bg-orange-300 p-4 rounded-full mb-4 shadow-lg animate-pulse shadow-orange-600/80'>
                    <GiForkKnifeSpoon className='text-[#ff4d2d] w-16 h-16'/>
                </div>
                <div className='text-3xl font-extrabold text-gray-900'>{myShopData?"Edit Shop": "Add Shop"}</div>
            </div>
            <form className='space-y-6' onSubmit={handleSubmit}>
                <div>
                    <label className='block text-sm font-extrabold text-gray-700 mb-1'>Name</label>
                    <input 
                    onChange={(e)=>setName(e.target.value)}
                    value={name}
                    type="text" placeholder='Enter shop Name' className='w-full px-4 py-2 border
                    rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500'/>
                </div>
                <div>
                    <label className='block text-sm font-extrabold text-gray-700 mb-1'>Shop Image</label>
                    <input 
                    onChange={handleImage}
                    type="file" accept='image/*' placeholder='Enter shop Image' className='w-full px-4 py-2 border
                    rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500'/>
                    {frontendImage && <div className='mt-4'>
                        <img src={frontendImage} alt="image" className='w-full h-48 object-cover rounded-lg border'/>
                    </div>}
                </div>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div><label className='block text-sm font-extrabold text-gray-700 mb-1'>City</label>
                    <input 
                    onChange={(e)=>setCity(e.target.value)}
                    value={city}
                    type="text" placeholder='Enter shop City' className='w-full px-4 py-2 border
                    rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500'/></div>
                    <div><label className='block text-sm font-extrabold text-gray-700 mb-1'>State</label>
                    <input 
                    onChange={(e)=>setState(e.target.value)}
                    value={state}
                    type="text" placeholder='Enter shop State' className='w-full px-4 py-2 border
                    rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500'/></div>
                </div>
                <div>
                    <label className='block text-sm font-extrabold text-gray-700 mb-1'>Address</label>
                    <input 
                    onChange={(e)=>setAddress(e.target.value)}
                    value={address}
                    type="text" placeholder='Enter shop Address' className='w-full px-4 py-2 border
                    rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500'/>
                </div>
                <button className='w-full bg-[#ff4d2d] text-white px-6 py-3 rounded-lg font-semibold shadow-md hover:bg-orange-600 hover:shadow-lg transition-all duration-200 cursor-pointer' onClick={()=>navigate('/')} disabled={loading}>
                    {loading ? <ClipLoader size={20} color='white'/>: "Save"}
                </button>
            </form>
        </div>
    </div>
  )
}

export default CreateEditShop