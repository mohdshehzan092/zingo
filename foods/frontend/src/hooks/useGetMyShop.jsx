import React from 'react'
import { useEffect } from 'react'
import axios from 'axios'
import { serverUrl } from '../App.jsx'
import { useDispatch, useSelector } from 'react-redux'
import { setMyShopData } from '../redux/ownerSlice.js'
const useGetMyShop = () => {
  const dispatch = useDispatch();
  const {userData} = useSelector(state=>state.user)
  useEffect(() => {
    const fetchShop = async () => {
        try{
          const result = await axios.get(`${serverUrl}/api/shop/get-my-shop`, {withCredentials: true})
          dispatch(setMyShopData(result.data));
        }catch(error){
          console.log(error)
        }
    }
    fetchShop(); 
  },[userData])
}

export default useGetMyShop