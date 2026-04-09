import React, { useState } from "react";
import { FaLocationDot } from "react-icons/fa6";
import { FaSearch } from "react-icons/fa";
import { FaShoppingCart } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { ImCross } from "react-icons/im";
import { setSearchItems, setUserData } from "../redux/userSlice";
import axios from "axios";
import { serverUrl } from "../App.jsx";
import { FaPlus } from "react-icons/fa";
import { IoReceiptOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import MyOrders from '../pages/MyOrders';


const Nav = () => {
  const { userData, currentCity, cartItems } = useSelector((state) => state.user);
  const { myShopData } = useSelector((state) => state.owner);
  const [showInfo, setShowInfo] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [query, setQuery] = useState("")
  const handleLogOut = async () => {
    try{
        const result =await axios.get(`${serverUrl}/api/auth/signout`, { withCredentitals: true}) 
        dispatch(setUserData(null));
    }catch(error){
        console.log("Error logging out:", error);
    }
  }

    const handleSearchItems = async () =>{
      try {
        const result = await axios.get(`${serverUrl}/api/item/search-items?query=${query}&city=${currentCity}`, {withCredentials:true})
        dispatch(setSearchItems(result.data))
      } catch (error) {
        console.log(error)
      }
    }
    useEffect(()=>{
      if(query){
        handleSearchItems()
      }else{
        dispatch(setSearchItems(null))
      }
      
    })
  
  return (
    <div className="w-full h-[80px] flex items-center justify-between md:justify-center gap-[30px] px-[20px] fixed top-0 z-9999 bg-[#fff9f6] overflow-visible">
      {showSearch && userData.role == "user" && (
        <div className="w-[90%] h-[70px] bg-white shadow-xl rounded-lg items-center gap-[15px] flex fixed top-[80px] left-[5%] md:hidden">
          <div className="flex items-center [w-30%] overflow-hidden gap-[10px] px-[10px] border-r-[2px] border-gray-400">
            <FaLocationDot size={22} className="text-[#ff4d2d]" />
            <div className="[w-80%] truncate text-gray-600 gap-[10px]">
              {currentCity}
            </div>
          </div>
          <div className="w-[80%] flex items-center gap-[14px]">
            <FaSearch size={22} className="text-[#ff4d2d]" />
            <input
              type="text"
              onChange={(e)=>setQuery(e.target.value)} value={query}
              placeholder="Search delicious food...."
              className="px-[10px] text-gray-700 outline-0 w-full"
            />
          </div>
        </div>
      )}
      <h1 className="text-3xl font-bold mb-2 text-[#ff4d2d]">Zingo</h1>
      {userData.role == "user" && 
      <div className="md:w-[60%] lg:w-[40%] h-[70px] bg-white shadow-xl rounded-lg items-center gap-[15px] hidden md:flex">
        <div className="flex items-center [w-30%] overflow-hidden gap-[10px] px-[10px] border-r-[2px] border-gray-400">
          <FaLocationDot size={22} className="text-[#ff4d2d]" />
          <div className="[w-80%] truncate text-gray-600 gap-[10px]">{currentCity}</div>
        </div>
        <div className="w-[80%] flex items-center gap-[14px]">
          <FaSearch size={22} className="text-[#ff4d2d]" />
          <input
            type="text"
            onChange={(e)=>setQuery(e.target.value)} value={query}
            placeholder="Search delicious food...."
            className="px-[10px] text-gray-700 outline-0 w-full"
          />
        </div>
      </div>}
      <div className="flex items-center gap-4">
        {userData.role == "user" && (showSearch?<ImCross size={22} className="text-[#ff4d2d] md:hidden" onClick={()=>setShowSearch(false)}/>:<FaSearch size={22} className="text-[#ff4d2d] md:hidden" onClick={()=>setShowSearch(true)}/>)} 
        
        {userData.role == "owner"? <>
        {myShopData && <>
        <button className="hidden md:flex items-center gap-2 p-2 cursor-pointer rounded-full bg-[#ff4d2d]/10 text-[#ff4d2d]">
          <FaPlus size={18} onClick={()=>navigate("/add-items")}/>
          <span className="font-normal">Add Food Item</span>
          </button>
          <button className="md:hidden flex items-center p-2 cursor-pointer rounded-full bg-[#ff4d2d]/10 text-[#ff4d2d]">
          <FaPlus size={18} onClick={()=>navigate("/add-items")} />
          </button>
        </>}
          
          <div className="hidden md:flex items-center gap-2 cursor-pointer relative px-3 py-1 rounded-lg bg-[#ff4d2d]/10 text-[#ff4d2d] font-medium" onClick={()=>navigate("/my-orders")}>
            <IoReceiptOutline size={18}/>
            <span>My Orders</span>
            
          </div>
          <div className="md:hidden flex items-center gap-2 cursor-pointer relative px-3 py-1 rounded-lg bg-[#ff4d2d]/10 text-[#ff4d2d] font-medium" onClick={()=>navigate("/my-orders")}>
            <IoReceiptOutline size={18}/>
            
            
          </div>
        </>: (
          <>
          {userData.role == "user" && <div className="relative cursor-pointer"
          onClick={()=>navigate("/cart")}>
          <FaShoppingCart size={22} className="text-[#ff4d2d]" />
          <span className="absolute right-[-9px] top-[-12px] text-[#ff4d2d]">
            {cartItems.length}
          </span>
        </div>}
          
        
        <button onClick={()=>navigate("/my-orders")} className="hidden md:block px-3 py-1 bg-[#ff4f2d]/10 text-[#ff4d2d] text-sm font-medium]">
          My Orders
        </button>
          </>
        )}

        
        <div
          className="w-[40px] h-[40px] rounded-full flex items-center justify-center bg-[#ff4d2d] text-white text-[18px] shadow-xl font-semibold cursor-pointer"
          onClick={() => setShowInfo((prev) => !prev)}
        >
          {userData?.fullName.slice(0, 1).toUpperCase()}
        </div>
        {showInfo && (
          <div className={`fixed top-[80px] right-[10px] ${userData.role=="deliveryBoy"?"md:right-[20%] lg:right-[60%]":"md:right-[10%] lg:right-[25%] "}w-[180px] bg-white shadow-2xl rounded-xl p-[20px] flex flex-col gap-[10px] z-[9999]`}>
            <div className="text-[17px] font-semibold">{userData.fullName}</div>
            <div className="md:hidden text-[#ff4d2d] font-semibold cursor-pointer" onClick={()=>navigate("/my-orders")}>
              My Orders
            </div>
            <div className="text-[#ff4d2d] font-semibold cursor-pointer" onClick={handleLogOut}>
              Log Out
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Nav;
