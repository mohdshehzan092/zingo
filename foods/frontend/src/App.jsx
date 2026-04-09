import React from 'react'
import { Route, Routes } from 'react-router-dom'
import SignUp from './pages/Signup.jsx'
import SignIn from './pages/Signin.jsx'
import Home from './pages/Home.jsx'
import ForgotPassword from './pages/ForgotPassword.jsx'
import useCurrentUser from './hooks/useCurrentUser.jsx'
import { useDispatch, useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'
import useGetCity from './hooks/useGetCity.jsx'
import useGetMyShop from './hooks/useGetMyShop.jsx'
import AddItems from './pages/AddItems.jsx'
import EditItem from './pages/EditItem.jsx'
import CreateEditShop from './pages/CreateEditShop.jsx'
import useGetShopByCity from './hooks/useGetShopByCity.jsx'
import useGetItemByCity from './hooks/useGetItemByCity.jsx'
import CartPage from './pages/CartPage.jsx'
import CheckOut from './pages/CheckOut.jsx'
import OrderPlaced from './pages/OrderPlaced.jsx'
import MyOrders from './pages/MyOrders.jsx'
import useGetMyOrders from './hooks/useGetMyOrders.jsx'
import useUpdateLocation from './hooks/useUpdateLocation.jsx'
import TrackOrder from './pages/TrackOrder.jsx'
import Shop from './pages/Shop.jsx'
import { useEffect } from 'react'
import { io } from 'socket.io-client'
import { setSocket } from './redux/userSlice.js'
import { useRef } from 'react'
export const serverUrl= "https://zingo-backend-mgyk.onrender.com"

const App = () => {
  useCurrentUser();
  useGetCity();
  useGetMyShop();
  useGetShopByCity();
  useGetItemByCity();
  useGetMyOrders();
  useUpdateLocation();
  const {userData} = useSelector(state=>state.user)

  

  return (
    <Routes>
      <Route path='/signup' element={!userData?<SignUp/>:<Navigate to={"/"}/>}/>
      <Route path='/signin' element={!userData?<SignIn/>:<Navigate to={"/"}/>}/>
      <Route path='/forgot-password' element={!userData?<ForgotPassword/>:<Navigate to={"/"}/>}/>
      <Route path='/' element={userData?<Home/>:<Navigate to={"/signin"}/>}/>
      <Route path='/create-edit-shop' element={userData?<CreateEditShop/>:<Navigate to={"/signin"}/>}/>
      <Route path='/add-items' element={userData?<AddItems/>:<Navigate to={"/signin"}/>}/>
      <Route path='/edit-item/:itemId' element={userData?<EditItem/>:<Navigate to={"/signin"}/>}/>
      <Route path='/cart' element={userData?<CartPage/>:<Navigate to={"/signin"}/>}/>
      <Route path='/checkout' element={userData?<CheckOut/>:<Navigate to={"/signin"}/>}/>
      <Route path='/order-placed' element={userData?<OrderPlaced/>:<Navigate to={"/signin"}/>}/>
      <Route path='/my-orders' element={userData?<MyOrders/>:<Navigate to={"/signin"}/>}/>
      <Route path='/shop/:shopId' element={userData?<Shop/>:<Navigate to={"/signin"}/>}/>
      <Route path='/track-order/:orderId' element={userData?<TrackOrder/>:<Navigate to={"/signin"}/>}/>
    </Routes>
  )
}

export default App
