import React, { useEffect, useState } from 'react'
import { IoMdArrowRoundBack } from "react-icons/io";
import { useDispatch, useSelector } from 'react-redux';
import { GiForkKnifeSpoon } from "react-icons/gi";
import {useNavigate, useParams} from 'react-router-dom';
import { serverUrl } from '../App';
import { setMyShopData } from '../redux/ownerSlice';
import axios from 'axios';
import { ClipLoader } from 'react-spinners';
const EditItem = () => {
    const navigate = useNavigate();
    const [currentItem, setCurrentItem] = useState(null)
    const {myShopData} = useSelector(state=>state.owner)
    const [name, setName] = useState("")
    const {itemId} = useParams();
    const [price, setPrice] = useState("")
    const [frontendImage, setFrontendImage] = useState( "");
    const [backendImage, setBackendImage] = useState(null);
    const [category, setCategory] = useState("")
    const [foodType, setFoodType] = useState("")
    const [Loading, setLoading] = useState(false)
    
    const categories = ["Snacks",
            "Main Course",
            "Beverages",
            "Pizza",
            "Desserts",
            "Burgers",
            "Sandwiches",
            "South Indian",
            "North Indian",
            "Chinese",
            "Fast Food",
            "Others"]
    const dispatch = useDispatch();
    const handleImage = (e)=>{
        const file = e.target.files[0];
        setBackendImage(file);
        setFrontendImage(URL.createObjectURL(file));
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true)

        try {
            const formData = new FormData();
            formData.append("name", name);
            formData.append("category", category);
            formData.append("price", price);
            formData.append("foodType", foodType);

            
            if(backendImage){
                formData.append("image", backendImage);
            }
            const result = await axios.put(`${serverUrl}/api/item/edit-item/${itemId}`, formData, {withCredentials: true})
            dispatch(setMyShopData(result.data))
            setLoading(false)
            navigate('/')
        } catch (error) {
            console.log(error);
            setLoading(false)
        }
    }
    useEffect(()=>{
        const handleGetItemById = async() => {
            try {
                const result = await axios.get(`${serverUrl}/api/item/get-item/${itemId}`, {withCredentials: true})
                setCurrentItem(result.data)
            } catch (error) {
                console.log(error)
            }
        }
        handleGetItemById()
    },[itemId])

    useEffect(()=> {
       setName(currentItem?.name || "");
       setPrice(currentItem?.price ||"")
       setFrontendImage(currentItem?.image || "");
       setCategory(currentItem?.category || "")
       setFoodType(currentItem?.foodType ||"")
    },[currentItem])
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
                <div className='text-3xl font-extrabold text-gray-900'>Edit food</div>
            </div>
            <form className='space-y-6' onSubmit={handleSubmit}>
                <div>
                    <label className='block text-sm font-extrabold text-gray-700 mb-1'>Food Name</label>
                    <input 
                    onChange={(e)=>setName(e.target.value)}
                    value={name}
                    type="text" placeholder='Enter food Name' className='w-full px-4 py-2 border
                    rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500'/>
                </div>
                <div>
                    <label className='block text-sm font-extrabold text-gray-700 mb-1'>Price</label>
                    <input 
                    onChange={(e)=>setPrice(e.target.value)}
                    value={price}
                    type="Number" placeholder='Enter Price' className='w-full px-4 py-2 border
                    rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500'/>
                </div>
                <div>
                    <label className='block text-sm font-extrabold text-gray-700 mb-1'>Select Category</label>
                    <select
                      onChange={(e)=>setCategory(e.target.value)}
                      value={category}
                      className='w-full px-4 py-2 border
                      rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500'>
                      <option value="">select Category</option>
                      {categories.map((cat, index)=>(
                      <option value={cat} key={index}>{cat}</option>
                      ))}
                    </select>
                </div>
                <div>
                    <label className='block text-sm font-extrabold text-gray-700 mb-1'>Select Food Type</label>
                    <select
                      onChange={(e)=>setFoodType(e.target.value)}
                      value={foodType}
                      className='w-full px-4 py-2 border
                      rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500'>
                      
                      
                      <option value="Veg">Veg</option>
                      <option value="Non-Veg">Non-Veg</option>
                      
                    </select>
                </div>
                <div>
                    <label className='block text-sm font-extrabold text-gray-700 mb-1'>Food Image</label>
                    <input 
                    onChange={handleImage}
                    type="file" accept='image/*' placeholder='Enter shop Image' className='w-full px-4 py-2 border
                    rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500'/>
                    {frontendImage && <div className='mt-4'>
                        <img src={frontendImage} alt="image" className='w-full h-48 object-cover rounded-lg border'/>
                    </div>}
                </div>
                
                <button className='w-full bg-[#ff4d2d] text-white px-6 py-3 rounded-lg font-semibold shadow-md hover:bg-orange-600 hover:shadow-lg transition-all duration-200 cursor-pointer' onClick={() => navigate('/')} disabled={Loading}>
                    {Loading ? <ClipLoader size={20} color='white'/>: "save"}
                </button>
            </form>
        </div>
    </div>
  )
}

export default EditItem