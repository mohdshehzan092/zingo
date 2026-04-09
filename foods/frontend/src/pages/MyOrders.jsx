import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { IoMdArrowRoundBack } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import UserOrderCard from '../components/UserOrderCard';
import OwnerOrderCard from '../components/OwnerOrderCard';
import { useEffect } from 'react';
import { setMyOrders, updateRealtimeOrderStatus } from '../redux/userSlice';
import { useSocket } from '../context/SocketContext';
 

const MyOrders = () => {
    // 1. Context se socket nikalo (Redux se nahi!)
    const socket = useSocket(); 
    
    const { userData, MyOrders } = useSelector(state => state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
      if (!socket) return; // Agar socket abhi connect nahi hua toh wait karein

      const handleNewOrder = (data) => {
        // Aapka logic: Check karo agar naya order iss shop owner ka hai
        if (data.shopOrders?.owner?._id == userData?._id) {
          // Redux mein sirf SERIALIZABLE data bhej rahe ho (ye sahi hai)
          dispatch(setMyOrders([data, ...MyOrders])); // Naya order ko existing orders ke saath add karo
        }
      };

      socket?.on('newOrder', handleNewOrder);

      socket?.on('update-status', ({orderId, shopId, status, userId})=>{
        if(userId == userData._id){
          dispatch(updateRealtimeOrderStatus({orderId, shopId, status}))
        }
      })

      return () => {
        socket?.off('newOrder', handleNewOrder);
        socket?.off('update-status')
      };
    }, [socket]);



  return (
    <div className='w-full min-h-screen bg-[#fff9f6] flex justify-center px-4'>
        <div className='w-full max-w-[800px] p-4'>
        <div className="flex items-center gap-4 mb-4">
                  <div
                    className="relative top-2 z-10 mb-2.5"
                    onClick={() => navigate("/")}
                  >
                    <IoMdArrowRoundBack
                      size={35}
                      className="  text-[#ff4d2d]
                        transition-all
                        duration-300
                        hover:text-orange-600
                        hover:drop-shadow-[0_0_20px_#ff4d2a]
                        hover:scale-125"
                    />
                  </div>
                  <h1 className="text-3xl font-bold text-start">My Orders</h1>
                </div>
                <div className='space-y-6'>
                  {MyOrders.map((order, index) => (
                    userData.role=="user" ? (
                      <UserOrderCard data={order} key={index}/>
                    ): userData.role=="owner"? (
                      <OwnerOrderCard data={order} key={index}/>
                    ):
                  null))}
                </div>
        </div>
    </div>
  )
}

export default MyOrders