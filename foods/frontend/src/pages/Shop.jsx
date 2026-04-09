import axios from 'axios'
import React from 'react'
import { serverUrl } from '../App'
import { useNavigate, useParams } from 'react-router-dom'
import { useEffect } from 'react'
import { useState } from 'react'
import { IoStorefrontSharp } from "react-icons/io5";
import { FaLocationDot } from "react-icons/fa6";
import { TbBowlSpoonFilled } from "react-icons/tb";
import FoodCard from '../components/FoodCard'
import { FaArrowLeft } from "react-icons/fa";

const Shop = () => {
    const {shopId} = useParams()
    const [items, setItems] = useState([])
    const [shop, setShop] = useState([])
    const navigate = useNavigate()
    const handleShop = async ()=>{
         
        try {
            const result = await axios.get(`${serverUrl}/api/item/get-by-shop/${shopId}`, {withCredentials:true})
            setShop(result.data.shop)
            setItems(result.data.items)
            console.log(result.data)
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(()=>{
        handleShop()
    }, [shopId])
  return (
    <div className='min-h-screen bg-gray-100'>
        <button className='absolute top-4 left-4 z-20 flex items-center gap-3 bg-black/50 hover:bg-black/70 text-white
        px-3 py-2 rounded-full shadow transition' onClick={()=>navigate("/")}>
            <FaArrowLeft />

            <span>Back</span>
        </button>
        {shop && <div className='relative w-full h-64 md:h-80 lg:h-96'>
            <img src={shop?.image?.url} alt='' className='w-full h-full object-contain' />
            <div className='absolute inset-0 bg-linear-to-b from-black/70 to-black/30 flex flex-col items-center justify-center text-center px-4'>
                <IoStorefrontSharp  className='text-white text-5xl mb-3 drop-shadow-md'/>
                <h1 className='text-3xl md:text-5xl font-extrabold text-white drop-shadow-lg'>{shop?.name}</h1>
                <div className='flex items-center justify-center gap-2'>
                    <FaLocationDot size={24} color='red'/>
                    <p className='text-lg font-medium text-gray-200 mb-1'>{shop.address}</p>
                </div>
            </div>
            </div>}

            <div className='max-w-7xl mx-auto px-6 py-10'>
                <h2 className='flex items-center justify-center gap-3 text-3xl font-bold
                mb-11 text-gray-800'>
                   <TbBowlSpoonFilled color='red'/>
 Our Menu
                </h2>
                {items.length > 0?(
                    <div className='flex flex-wrap justify-center gap-8'>
                        {items.map((item)=>(
                            <FoodCard data={item}/>
                        ))}
                    </div>
                ):<p className='text-center text-gray-500 text-lg'>No items available</p>}

            </div>
        
    </div>
  )
}

export default Shop