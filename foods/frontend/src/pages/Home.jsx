import React from 'react'
import UserDash from '../components/UserDash'
import OwnerDash from '../components/OwnerDash'
import DeliveryBoy from '../components/DeliveryBoy'
import { useSelector } from 'react-redux' 

const Home = () => {
  const {userData} = useSelector(state=>state.user)
  return (
    <div className='w-100vw min-h-100vh pt-[100px] flex flex-col items-center bg-[#fff9f6]'>
      {userData.role == "user" && <UserDash />}
      {userData.role == "owner" && <OwnerDash />}
      {userData.role == "deliveryBoy" && <DeliveryBoy />}
    </div>
  )
}

export default Home