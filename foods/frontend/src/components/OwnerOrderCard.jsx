import axios from 'axios';
import React from 'react'
import { FaPhone } from "react-icons/fa6";
import { serverUrl } from '../App';
import { updateOrderStatus } from '../redux/userSlice';
import { useDispatch } from 'react-redux';


const OwnerOrderCard = ({data}) => {
  const [availableBoys, setAvailableBoys] = React.useState([])
const dispatch = useDispatch();
const handleUpdateStatus = async (orderId, shopId, status)=>{
  try {
    const result = await axios.post(
      `${serverUrl}/api/order/update-status/${orderId}/${shopId}`,
      { status },
      { withCredentials: true },
      
    )
    dispatch(updateOrderStatus({orderId,shopId, status}))
    setAvailableBoys(result.data.availableBoys)
    console.log(result.data)
  } catch (error) {
    console.log(error)
  }
}
               
  return (
    <div className='bg-white rounded-lg shadow p-4 space-y-4'>
      <div>
        <h2 className='text-lg font-semibold text-gray-800'>{data.user.fullName}</h2>
        <p className='text-sm text-gray-500'>{data.user.email}</p>
        <p
        className='flex items-center gap-2 text-sm text-gray-600 mt-1'
        ><FaPhone /><span>{data.user.mobileNumber}</span></p>
        {data.paymentMethod=="online"? <p className='gap-2 text-sm text-gray-600'>Payment: {data.payment? "true": "false"}</p>:<p className='gap-2 text-sm text-gray-600'>Payment Method : {data.paymentMethod}</p>}
       
      </div>
      <div className='flex flex-col items-start gap-2 text-gray-600 text-sm'>
        <p>{data?.deliveryAddress?.text}</p>
        <p className='text-xs text-gray-500'>Lat: {data?.deliveryAddress?.latitude}, Lon: {data?.deliveryAddress?.longitude}</p>
      </div>
      <div className='flex space-x-4 overflow-x-auto pb-2'>
                    {data.shopOrders[0]?.shopOrderItems.map((item, index)=>(
                        <div className='shrink-0 w-40 border rounded-lg p-2 bg-white' 
                        key={index}>
                            <img src={item.item.image} alt="" className='w-full h-24 object-cover rounded'/>
                            <p className='text-sm font-semibold mt-1'>{item.name}</p>
                            <p className='text-sm text-gray-800'>Qty: {item.quantity} x ₹ {item.price}</p>
                        </div>
                    ))}
                </div>
      <div className='flex justify-between items-center mt-auto pt-3 border-t border-gray-100'>
        <span className='text-sm'>status: <span className='font-semibold capitalize text-[#ff4d2d]'>{data.shopOrders[0]?.status}</span></span>

        <select onChange={(e)=>handleUpdateStatus(data._id, data.shopOrders[0]?.shop._id, e.target.value)} className='rounded-md border px-3 py-1 text-sm focus:outline-none focus:ring-2 border-[#ff4d2d] text-[#ff4d2d]'>
          <option value="">Change</option>
          <option value="pending">Pending</option>
          <option value="preparing">Preparing</option>
          <option value="out of delivery">Out of Delivery</option>
        </select>
      </div>
      {data.shopOrders[0]?.status=="out of delivery" && 
        <div className='mt-3 p-2 border rounded-lg text-sm bg-orange-50'>
          {data.shopOrders.assignedDeliveryBoy?<p>Assigned Delivery Boy:</p>:<p>Available Delivery Boys:</p>}
          {Array.isArray(availableBoys) && availableBoys.length > 0 ? (
  availableBoys.map((b, index)=>(
    <div key={index} className='text-gray-600'>
      {b.fullName}-{b.mobileNumber}
    </div>
  ))
):data.shopOrders.assignedDeliveryBoy?<div>{data.shopOrders.assignedDeliveryBoy.fullName}-{data.shopOrders.assignedDeliveryBoy.mobileNumber}</div>:<div>Waiting for delivery boys to accept</div>}
        </div>}
      <div className='text-right font-bold text-gray-800 text-sm'>
        Total: {data.shopOrders[0]?.subTotal}
      </div>
    </div>
  )
}

export default OwnerOrderCard