import React from 'react'
import Nav from './Nav.jsx'
import { GiKnifeFork } from "react-icons/gi";
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux'
import { ImSpoonKnife } from "react-icons/im";
import { BsPenFill } from "react-icons/bs";
import OwnerItemCard from './OwnerItemCard.jsx';

const OwnerDash = () => {
  const {myShopData} = useSelector(state=>state.owner)
  const navigate = useNavigate();

  
  return (
    <div className='w-full min-h-screen bg-[#fff9f6] flex flex-col items-center'>
      <Nav />
      {!myShopData && 
        <div className='flex justify-center items-center p-4 sm:p-6'>
          <div className='w-full max-w-md bg-white shadow-lg rounded-2xl p-6 border
          border-gray-100 hover:shadow-xl transition-shadow duration-300'>
            <div className='flex flex-col items-center text-center'>
              <GiKnifeFork className='text-[#ff4d2d] w-16 h-20 sm:w-20 sm:h-20 mb-4'/>
              <h2 className='text-xl sm:text-2xl font-bold text-gray-800 mb-2'>Add Your Restaurant</h2>
              <p
              className='text-gray-600 mb-4 text-sm sm:text-base'
              >Join our food delivery platform and reach thousands of hungry customers every day.</p>
              <button 
              onClick={()=>navigate('/create-edit-shop')}
              className='bg-[#ff4d2d] w-35 h-10 text-white px-5 sm:px-6 rounded-full font-medium shadow-md hover:bg-orange-600 transition-colors duration-200'>Get Started</button>
            </div>
          </div>
        </div>
      }

      {myShopData && 
        <div className='w-full flex flex-col items-center gap-6 px-4 sm:px-6'>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-orange-600 flex items-center gap-3 mt-8 text-center animate-pulse drop-shadow-[0_0_10px_rgba(88,101,242,0.8)] drop-shadow-[0_0_20px_rgba(168,85,247,0.7)] ">
            <ImSpoonKnife className='text-[#ff4d2d] w-16 h-20'/>
            Welcome To {myShopData.name}
            <GiKnifeFork className='text-[#ff4d2d] w-16 h-20'/>
          </h1>
          <div className='bg-white shadow-lg rounded-xl overflow-hidden border
           border-orange-100 hover:shadow-2xl transition-all duration-300 w-full max-w-3xl relative'>
            <div className='absolute top-4 right-4 bg-[#ff4d2d] text-white p-2 rounded-full shadow-md hover:bg-orange-600 transition-colors cursor-pointer hover:shadow-[0_0_18px_rgba(255,77,45,0.9)] hover:scale-110'
            onClick={()=> navigate("/create-edit-shop")}>
              <BsPenFill size={25}/>
            </div>
            <img src={myShopData.image?.url} alt={myShopData.name} className='w-full h-48 sm:h-64 object-cover'/>
            <div className='p-4 sm:p-6'>
            <h1 className='text-3xl font-extrabold text-gray-800 mb-2'>{myShopData.name}</h1>
            <p className='text-gray-500 font-bold'>{myShopData.city}, {myShopData.state} </p>
            <p className='text-gray-500 mb-4 font-bold'>{myShopData.address}</p>
          </div>
          </div>

          {myShopData.items.length == 0 && 
          
            <div className='flex justify-center items-center p-4 sm:p-6'>
          <div className='w-full max-w-md bg-white shadow-lg rounded-2xl p-6 border
          border-gray-100 hover:shadow-xl transition-shadow duration-300'>
            <div className='flex flex-col items-center text-center'>
              <GiKnifeFork className='text-[#ff4d2d] w-16 h-20 sm:w-20 sm:h-20 mb-4'/>
              <h2 className='text-xl sm:text-2xl font-bold text-gray-800 mb-2'>Add Your Food Items</h2>
              <p
              className='text-gray-600 mb-4 text-sm sm:text-base'
              >Share your delicious dishes with our customers by adding them to the menu.</p>
              <button 
              onClick={()=>navigate('/add-items')}
              className='bg-[#ff4d2d] w-35 h-10 text-white px-5 sm:px-6 rounded-full font-medium shadow-md hover:bg-orange-600 transition-colors duration-200'>Add Food</button>
            </div>
          </div>
        </div>
            }

            {myShopData.items.length > 0 && 
              <div className='flex flex-col items-center gap-4 w-full max-w-3xl'>
                {myShopData.items.map((item, index)=> (
                  <OwnerItemCard data={item} key={index}/>
                ))}
                </div>}
          
        </div>}
        

    </div>
  )
}

export default OwnerDash