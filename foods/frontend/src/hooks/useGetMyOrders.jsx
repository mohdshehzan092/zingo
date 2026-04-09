import React from 'react'
import { useEffect } from 'react'
import axios from 'axios'
import { serverUrl } from '../App.jsx'
import { useDispatch, useSelector } from 'react-redux'
import { setMyShopData } from '../redux/ownerSlice.js'
import { setMyOrders } from '../redux/userSlice.js'
const useGetMyOrders = () => {
  const dispatch = useDispatch();
  const {userData} = useSelector(state=>state.user)
  useEffect(() => {
    const fetchOrders = async () => {
        try{
          const result = await axios.get(`${serverUrl}/api/order/my-orders`, {withCredentials: true})
          dispatch(setMyOrders(result.data));
          
        }catch(error){
          console.log(error)
        }                    
    }
    fetchOrders(); 
  },[userData])
}

export default useGetMyOrders