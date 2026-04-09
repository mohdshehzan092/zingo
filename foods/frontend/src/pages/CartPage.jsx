import React from "react";
import { IoMdArrowRoundBack } from "react-icons/io";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import CartItemCard from "../components/CartItemCard";


const CartPage = () => {
  const navigate = useNavigate()
  const {cartItems, totalAmount} = useSelector(state=>state.user)
  return (
    <div className="min-h-screen bg-[#fff9f6] flex justify-center p-6">
      <div className="w-full max-w-[800px]">
        <div className="">
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
          <h1 className="text-2xl font-bold text-start">Your Cart</h1>
        </div>
        {cartItems?.length==0 ? (
          <p className="text-red-500 text-5xl text-center font-bold">Your Cart is Empty....</p>
        ):(<>
          <div className="space-y-4">
            {cartItems?.map((item, index)=>(
              <CartItemCard data={item} key={index}/>
            ))}
          </div>
          <div className="mt-6 bg-white p-4 rounded-xl shadow flex justify-between items-center border">
            <h1 className="text-lg font-semibold">Total Amount</h1>
            <span className="text-xl font-bold text-[#ff4d2d]">₹{totalAmount}</span>
          </div>
          <div className="mt-4 flex justify-end">
            <button 
            onClick={()=>navigate("/checkout")}
            className="bg-[#ff4d2d] text-white px-6 py-3 rounded-lg 
            text-lg font-medium hover:bg-[#e64526] transition cursor-pointer">Proceed Check Out</button>
          </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CartPage;
