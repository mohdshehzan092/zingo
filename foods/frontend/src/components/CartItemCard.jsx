import React from 'react'
import { FaMinus } from "react-icons/fa";
import { FaPlus } from "react-icons/fa";
import { FaRegTrashAlt } from "react-icons/fa";
import { useDispatch } from 'react-redux';
import { removeCartItem, updateQuantity } from '../redux/userSlice';

const CartItemCard = ({data}) => {
    const dispatch = useDispatch()
    const handleIncrease = (id, currnetQty) =>{
        dispatch(updateQuantity({id, quantity:currnetQty+1}))
    }
    const handleDecrease = (id, currnetQty) =>{
        if(currnetQty>1){
          dispatch(updateQuantity({id, quantity:currnetQty-1}))
        }
    }
  return (
    <div className='flex items-center justify-between bg-white
    p-4 rounded-xl shadow border'>
        <div className='flex items-center gap-5'>
            <img src={data.image} alt="" className='w-24 h-24 object-cover rounded-lg border'/>
            <div>
                <h1 className='font-bold text-lg text-gray-800'>{data.name}</h1>
                <p className='text-sm font-bold text-gray-500'>₹ {data.price} x {data.quantity}</p>
                <p className='text-medium font-bold text-gray-900'>₹{data.price*data.quantity}</p>
            </div>
        </div>
        <div className='flex items-center gap-4'>
            <button onClick={()=>handleDecrease(data.id, data.quantity)} className='bg-gray-100 rounded-full hover:bg-gray-300 cursor-pointer'>
              <FaMinus size={14}/>
            </button>
                <span>{data.quantity}</span>
            <button 
            onClick={()=>handleIncrease(data.id, data.quantity)}
            className='bg-gray-100 rounded-full hover:bg-gray-300 cursor-pointer'>
              <FaPlus size={14}/>
            </button>
            <button 
            onClick={()=>dispatch(removeCartItem(data.id))}
            className='p-2 text-red-600 bg-red-200 rounded-full hover:bg-red-300 cursor-pointer'>
                <FaRegTrashAlt size={18}/>
            </button>
        </div>
    </div>
  )
}

export default CartItemCard