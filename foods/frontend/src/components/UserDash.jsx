import React, { useEffect } from 'react'
import Nav from './Nav'
import { categories } from '../category'
import CategoryCard from './CategoryCard'
import {useRef, useState} from 'react'
import { FaChevronCircleLeft } from "react-icons/fa";
import { FaChevronCircleRight } from "react-icons/fa";
import { useSelector } from 'react-redux'
import FoodCard from './FoodCard.jsx'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const UserDash = () => {
  const catScrollRef = useRef()
  const shopScrollRef = useRef();
  const {currentCity, shopInMyCity, itemsInMyCity, searchItems} = useSelector(state=>state.user)
  const navigate = useNavigate()

  const [showCatLeftButton, setShowLeftCatButton] = useState(false)
  const [showCatRightButton, setShowRightCatButton] = useState(false)
  const [showShopLeftButton, setShowShopLeftButton] = useState(false)
  const [showShopRightButton, setShowRightShopButton] = useState(false)
  const [updatedItemList, setUpdatedItemList] = useState([])

  const handleFilterByCategory = (category)=>{
    if(category=="All"){
      setUpdatedItemList(itemsInMyCity)
    }
    else{
      const filteredList = itemsInMyCity.filter(i=>i.category===category)
      setUpdatedItemList(filteredList)
    }
  }
useEffect(()=>{
setUpdatedItemList(itemsInMyCity)
}, [itemsInMyCity])
  const updateButton=(ref, setLeftButton, setRightButton)=>{
    const element = ref.current
    if(element){
      setLeftButton(element.scrollLeft>0)
      setRightButton(element.scrollLeft+element.clientWidth<element.scrollWidth)
    }
  }
  const scrollHandler=(ref, direction)=>{
    if(ref.current){
      ref.current.scrollBy({
        left:direction=="left"?-200:200,
        behavior: "smooth"
      })
    }
  }

  useEffect(() => {
  const catEl = catScrollRef.current;
  const shopEl = shopScrollRef.current;

  if (!catEl || !shopEl) return;

  const handleCatScroll = () => {
    updateButton(catScrollRef, setShowLeftCatButton, setShowRightCatButton);
  };

  const handleShopScroll = () => {
    updateButton(shopScrollRef, setShowShopLeftButton, setShowRightShopButton);
  };

  

  // initial check
  handleCatScroll();
  handleShopScroll();

  catEl.addEventListener("scroll", handleCatScroll);
  shopEl.addEventListener("scroll", handleShopScroll);

  return () => {
    catEl.removeEventListener("scroll", handleCatScroll);
    shopEl.removeEventListener("scroll", handleShopScroll);
  };
}, [categories]);

  return (
    <div className='w-screen min-h-screen flex flex-col gap-5 items-center bg-[#fff9f6] overflow-y-auto '>
      <Nav />

      {searchItems && searchItems.length > 0 && <div className='w-full max-w-5xl flex flex-col gap-5 items-start
      p-5 bg-white shadow-md rounded-2xl mt-4'>
        <h1 className='text-gray-900 text-2xl sm:text-3xl font-bold border-b border-gray-200 pb-2'>Search Result</h1>
        <div className='w-full h-auto flex flex-wrap gap-6 justify-center'>
          {searchItems.map((item)=>(
            <FoodCard key={item._id} data={item}/>
          ))}
        </div>
        </div>}

      <div className='w-full max-w-6xl flex flex-col gap-5 items-start p-2.5'>
      <h1 className='text-gray-800 text-2xl sm:text-3xl'>Inspritation for your first order</h1>
      <div className='w-full relative'>
        {showCatLeftButton && <button className='absolute left-0 top-1/2 -translate-y-1/2 bg-[#ff4d2d] text-white
        p-2 rounded-full shadow-lg hover:bg-[#e64528] z-10' onClick={()=>scrollHandler(catScrollRef, "left")}>
          <FaChevronCircleLeft />

        </button>}
        
        <div className='w-full flex overflow-x-auto gap-4 pb-2' ref={catScrollRef}>
        {categories.map((cat, index)=> (
          <CategoryCard
          onClick={()=>handleFilterByCategory(cat.category)}
          name={cat.category} image={cat.image} key={index}/>
        ))}
        </div>
        {showCatRightButton && <button className='absolute right-0 top-1/2 -translate-y-1/2 bg-[#ff4d2d] text-white
        p-2 rounded-full shadow-lg hover:bg-[#e64528] z-10' onClick={()=>scrollHandler(catScrollRef, "right")}>
          <FaChevronCircleRight />
        </button>}
        
      </div>
      </div>
      <div className='w-full max-w-6xl flex flex-col gap-5 items-start p-2.5'>
      <h1 className='text-gray-800 text-2xl sm:text-3xl'>Best Shop in {currentCity}</h1>
        <div className='w-full relative'>
        {showShopLeftButton && <button className='absolute left-0 top-1/2 -translate-y-1/2 bg-[#ff4d2d] text-white
        p-2 rounded-full shadow-lg hover:bg-[#e64528] z-10' onClick={()=>scrollHandler(shopScrollRef, "left")}>
          <FaChevronCircleLeft />

        </button>}
        
        <div className='w-full flex overflow-x-auto gap-4 pb-2' ref={shopScrollRef}>
        {shopInMyCity?.map((shop, index)=> (
          <CategoryCard 
          onClick={()=>navigate(`/shop/${shop._id}`)}
          name={shop.name} image={shop.image?.url} key={index}/>
        ))}
        </div>
        {showShopRightButton && <button className='absolute right-0 top-1/2 -translate-y-1/2 bg-[#ff4d2d] text-white
        p-2 rounded-full shadow-lg hover:bg-[#e64528] z-10' onClick={()=>scrollHandler(catScrollRef, "right")}>
          <FaChevronCircleRight />
        </button>}
        
      </div>
      </div>
      <div className='w-full max-w-6xl flex flex-col gap-5 items-start p-2.5'>
          <h1 className='text-gray-800 text-2xl sm:text-3xl'>
            Suggested Food Items
          </h1>
          <div className='w-full h-auto flex flex-wrap gap-5 justify-center'>
            {updatedItemList?.map((item, index)=>(
              <FoodCard key={index} data={item}/>
            ))}
          </div>
      </div>
    </div>
  )
}

export default UserDash