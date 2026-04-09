import axios from 'axios'
import React, { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { serverUrl } from '../App'
import { useState } from 'react'
import { IoMdArrowRoundBack } from "react-icons/io";
import DeliveryBoyTracking from '../components/DeliveryBoyTracking'
import { useSocket } from '../context/SocketContext'


const TrackOrder = () => {
    const {orderId} = useParams()
    const [currentOrder, setCurrentOrder] = useState()
    const navigate = useNavigate()
    const [liveLocation, setLiveLocation] = useState({})
    const socket = useSocket();
    const handleGetOrder=async()=>{
        try {
            const result = await axios.get(`${serverUrl}/api/order/get-order-by-id/${orderId}`,
                {withCredentials:true}
              
            )
              setCurrentOrder(result.data)
        } catch (error) {
            console.log(error)
        }
    }   

    useEffect(()=>{
        socket?.on('updateDeliveryLocation', ({deliveryBoyId, latitude, longitude})=>{
            setLiveLocation(prev=>({
                ...prev,
                [deliveryBoyId]:{
                    lat:latitude,
                    lon:longitude
                }
            }))
        })
    }, [socket])

    useEffect(()=>{
        handleGetOrder()
    },[orderId])
  return (
    <div className='max-w-4xl mx-auto p-4 flex flex-col gap-6'>
        <div className='relative flex items-center gap-4 top-2 z-10 mb-2.5' onClick={()=>navigate("/")}>
        <IoMdArrowRoundBack size={35} className='  text-[#ff4d2d]
            transition-all
            duration-300
            hover:text-orange-600
            hover:drop-shadow-[0_0_20px_#ff4d2a]
            hover:scale-125'/>
            <h1 className='text-2xl font-bold md:text-center'>Track Order</h1>
        </div>
        {currentOrder?.shopOrders?.map((shopOrder, index)=>(
            <div className='bg-white p-4 rounded-2xl shadow-md border
             border-order-200 space-y-5' key={index}>
                <div>
                    <p className='text-lg font-bold mb-2 text-[#ff4d2d]'>{shopOrder.shop.name}</p>
                <p className='font-semibold'><span>Items:</span> {shopOrder?.shopOrderItems?.map(i=>i.name).join(",")}</p>
                <p><span className='font-semibold'>Subtotal:</span>{shopOrder.subTotal}</p>
                <p className='mt-6'><span className='font-semibold'>Delivery address:</span> {currentOrder.deliveryAddress.text}</p>
                </div>
                <div>
                    {shopOrder.status!="delivered"?<>
                    
                    {shopOrder.assignedDeliveryBoy? 
                    <div className='text-sm text-gray-700'>
                        <p className='font-semibold'><span>Delivery Boy Name:</span> {shopOrder.assignedDeliveryBoy.fullName}</p>
                        <p className='font-semibold'><span>Delivery Boy Mobile Number:</span> {shopOrder.assignedDeliveryBoy.mobileNumber}</p>
                    </div>:<p className='font-semibold'>Delivery Boy is not assigned yet</p>}
                    </>:<p className='text-green-600 font-semibold text-lg'>Delivered</p>}
                    {(shopOrder.assignedDeliveryBoy && shopOrder.status !== "delivered") &&
                    <div className='h-[400px] w-full rounded-2xl overflow-hidden shadow-md'>
                    <DeliveryBoyTracking data={
                        {deliveryBoyLocation:liveLocation[shopOrder.assignedDeliveryBoy._id] || {
                            
                            lat:shopOrder.assignedDeliveryBoy.location.coordinates[1],
                            lon:shopOrder.assignedDeliveryBoy.location.coordinates[0]
                        },
                    customerLocation:{
                        lat:currentOrder.deliveryAddress.latitude,
                        lon:currentOrder.deliveryAddress.longitude
                    }
                    }
                    }/></div>}
                </div>
            </div>
            
        ))}
        
    </div>
  )
}

export default TrackOrder