import React, { useEffect, useState } from "react";
import { IoMdArrowRoundBack } from "react-icons/io";
import { FaLocationArrow } from "react-icons/fa6";
import { FaSearch } from "react-icons/fa";
import { BiCurrentLocation } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { MapContainer, Marker, TileLayer, useMap } from "react-leaflet";
import { useDispatch, useSelector } from "react-redux";
import {setLocation, setAddress} from '../redux/mapSlice'
import "leaflet/dist/leaflet.css"
import axios from "axios";
import { FcMoneyTransfer } from "react-icons/fc";
import { CiMobile1 } from "react-icons/ci";
import { FaCreditCard } from "react-icons/fa";
import {serverUrl} from '../App'
import { addMyOrder } from "../redux/userSlice";

function RecenterMap({location}){
    if(location?.lat && location?.lon){
        const map=useMap()
        map.setView([location.lat, location.lon],16,{animate:true})
    }
    
    return null
}

const CheckOut = () => {
    const {location, address} = useSelector(state=>state.map)
    const {cartItems, totalAmount, userData} = useSelector(state=>state.user)
    const navigate = useNavigate();
    const apikey = import.meta.env.VITE_GEOAPIKEY
    const [addressInput, setAddressInput] = useState("")
    const [paymentMethod, setPaymentMethod] = useState("cod")
    const dispatch = useDispatch();
    const deliveryFee = totalAmount > 500?0:40
    const amountWithDeliveryFee = totalAmount + deliveryFee

    

    const onDragEnd=(e)=>{0
        
        const {lat,lng} = e.target._latlng 
        
        dispatch(setLocation({lat, lon:lng}))
        getAddressByLatLng(lat,lng)
    }

const getCurrentLocation=()=>{
            const latitude = userData.location.coordinates[1]
            const longitude = userData.location.coordinates[0]
            dispatch(setLocation({lat:latitude,lon:longitude}))
            getAddressByLatLng(latitude, longitude)
        
            
}
const getAddressByLatLng=async(lat,lng)=>{
    try {
          
          const result = await axios.get(`https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lng}&format=json&apiKey=${apikey}`)
          
          dispatch(setAddress(result?.data?.results[0].address_line1))
    } catch (error) {
        console.log(error);
        
    }
}

const getLatLngByAddress=async()=>{
    try{
        const result = await axios.get(`https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(addressInput)}&apiKey=${apikey}`)
        const {lat, lon} = result.data.features[0].properties
        dispatch(setLocation({lat, lon}))
    }catch(error){
        console.log(error);
    }
}

    const handlePlaceORder = async () => {
        try {
            const result = await axios.post(`${serverUrl}/api/order/place-order`,{
                paymentMethod,
                deliveryAddress:{
                    text:addressInput,
                    latitude: location.lat,
                    longitude: location.lon
                },
                totalAmount: amountWithDeliveryFee,
                cartItems
            }, {withCredentials:true})
            if(paymentMethod=="cod"){
                dispatch(addMyOrder(result.data))
                navigate("/order-placed")
            }else{
                const orderId = result.data.orderId
                const razorOrder = result.data.razorOrder
                openRazorpayWindow(orderId, razorOrder)
            }
            
        } catch (error) {
            console.log(error)
        }
    }

    const openRazorpayWindow=(orderId, razorOrder)=>{
        const options={
            key: import.meta.env.VITE_RAZORPAY_API_KEY,
            amount: razorOrder.amount,
            currency: 'INR',
            name : "Zingo",
            description: "Food Delivery Payment",
            order_id:razorOrder.id,
            method: {
            upi: true 
        },
            
            handler: async function (response) {
                try {
                    const result = await axios.post(`${serverUrl}/api/order/verify-payment`, {
                        razorpay_payment_id: response.razorpay_payment_id,
                        orderId
                    }, {withCredentials:true})
                    dispatch(addMyOrder(result.data))
                    navigate("/order-placed")
                } catch (error) {
                  console.log(error)  
                }
            }
        }
        const rzp = new window.Razorpay(options)
        rzp.open()
    }
useEffect(()=>{
setAddressInput(address)
}, [address])
  return (
    <div className="min-h-screen bg-[#fff9f6] flex items-center justify-center p-6">
      <div className="absolute top-4 z-10 mb-2.5" onClick={() => navigate("/")}>
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
      <div className="w-full max-w-[900px] bg-white rounded-2xl shadow-xl p-6 space-y-6">
        <h1 className="text-2xl font-bold text-gray-800">Checkout</h1>
        <section>
            <h2 className="text-lg font-semibold mb-2 flex items-center gap-2 text-gray-800">
                <FaLocationArrow size={24} className="text-[#ff4d2d]"/>
                Delivery Location</h2>
                <div className="flex gap-2 mb-3">
                    <input type="text" className="flex-1 border border-gray-400 rounded-lg p-2
                    text-sm focus:outline-none focus:ring-2 focus:ring-[#ff4d2d]" placeholder="Enter Your Delivery Address"
                     onChange={(e) => setAddressInput(e.target.value)}
                    value={addressInput}/>
                    <button className="bg-[#ff4d2d] hover:bg-[#e64526] text-white px-3 py-2 
                    rounded-lg flex items-center justify-center" onClick={getLatLngByAddress}><FaSearch /></button>
                    <button className="bg-blue-500 hover:bg-blue-700 text-white px-3 py-2 rounded-lg flex
                    items-center justify-center" onClick={getCurrentLocation}><BiCurrentLocation size={19}/></button>
                </div>
                <div className="rounded-xl border overflow-hidden">
                    <div className="h-64 w-full flex items-center justify-center">
                        <MapContainer className={"w-full h-full"}
                        zoom={18}
                        center={[location?.lat, location?.lon]}>
                             <TileLayer
    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
  />
  <RecenterMap location={location}/>
    <Marker position={[location?.lat, location?.lon]} draggable eventHandlers={{dragend:onDragEnd}}></Marker>
                            
                        </MapContainer>
                    </div>
                </div>
        </section>

        <section>
            <h2 className="text-lg font-bold mb-4 text-gray-800">Payment Method...</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className={`flex items-center gap-3 rounded-xl border p-4 text-left transition ${
                    paymentMethod === "cod" ? "border-[#ff4d2d] bg-orange-100 shadow" : "border-gray-200 hover:border-gray-400 cursor-pointer"
                }`} onClick={()=>setPaymentMethod("cod")}>
                    <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-green-100 cursor-pointer">
                        <FcMoneyTransfer className="text-green-300 text-xl"/>
                    </span>
                    <div>
                        <p className="font-medium text-gray-800 ">Cash On Delivery</p>
                        <p className="text-xs text-gray-700">Pay when you receive the food</p>
                    </div>
                </div>
                <div className={`flex items-center gap-3 rounded-xl border p-4 text-left transition ${
                    paymentMethod === "online" ? "border-[#ff4d2d] bg-orange-100 shadow" : "border-gray-200 hover:border-gray-400 cursor-pointer"
                }`} onClick={()=>setPaymentMethod("online")}>
                    <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 cursor-pointer">
                        <CiMobile1 className="text-purple-700 text-lg"/>
                    </span>
                    <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 cursor-pointer">
                        <FaCreditCard className="text-blue-700 text-lg"/>
                    </span>
                    <div>
                        <p className="font-medium text-gray-800">UPI / Credit / Debit Card</p>
                        <p className="text-xs text-gray-700">Pay Securely Online</p>
                    </div>
                </div>
            </div>
        </section>
        
        <section>
            <h2 className="text-lg font-semibold mb-3 text-gray-800">Order Summary</h2>
            <div className="rounded-xl border bg-gray-100 space-y-2 p-3">
                {cartItems.map((item, index)=>(
                    <div key={index} className="flex justify-between text-medium font-semibold text-gray-700">
                        <span>{item.name} x {item.quantity}</span>
                        <span>₹{item.price*item.quantity}</span>
                    </div>
                ))}
                <hr className="border-gray-500 my-2"/>
                <div className="flex justify-between font-medium text-gray-800">
                    <span>Subtotal</span>
                    <span>₹{totalAmount}</span>
                </div>
                <div className="flex justify-between font-medium text-gray-600">
                    <span>Delivery Fee</span>
                    <span>{deliveryFee==0?"Free":deliveryFee}</span>
                </div>
                <hr className="border-gray-500 my-2"/>
                <div className="flex justify-between text-lg font-bold text-[#ff4d2d] pt-2">
                    <span>Total</span>
                    <span>{amountWithDeliveryFee}</span>
                </div>
            </div>
        </section>
        <button
            onClick={handlePlaceORder}
            className="w-full bg-[#ff4d2d] hover:bg-[#e64526] text-white py-3 rounded-xl font-semibold">
            {paymentMethod=="cod"?"Place Order": "Pay Now"}</button>
      </div>
    </div>
  );
};

export default CheckOut;
