import React, { useEffect, useState } from 'react'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { useParams } from 'react-router-dom';
import { MdOutlineRealEstateAgent } from "react-icons/md";
import { FaRegAddressCard } from "react-icons/fa";
import { FaBed } from "react-icons/fa";
import { FaBath } from "react-icons/fa";
import { LuParkingCircle } from "react-icons/lu";
import { IoIosPricetags } from "react-icons/io";
import { ToastContainer, toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { FaPrayingHands } from "react-icons/fa";
import { FaHeart } from "react-icons/fa6";
import ReactLoading from 'react-loading';

const ListData = ()=>{
    const [listingData, setListingData] = useState({})

    var settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: (listingData.images && listingData.images.length === 1 ? 1 : 2),
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        centerMode: true, 
        centerPadding: "60px", 
        responsive: [
        {
            breakpoint: 768, 
            settings: {
            slidesToShow: 1,
            centerPadding: "60px",
            },
        },
        ],
      };
    const {id} = useParams()
    const [loadingPage, setLoadingPage] = useState(false)
    const {currentUser} = useSelector((state)=>state.user)

    useEffect(()=>{
        gettingListData()
    },[id])

    const gettingListData = async () =>{
        setLoadingPage(true)
        try{
            const createdDataGet = {
                method:'GET',
                headers:{
                    'Content-Type' :'application/json'
                }
            }
            const createListData = await fetch(`/listing/datas/getListData/${id}`,createdDataGet)
            const responseData = await createListData.json()

            if(responseData.success === false){
                toast.error(responseData.message)
                setLoadingPage(false)
                return;
            }
            setListingData(responseData)
            setLoadingPage(false)


        }catch(error){
            toast.error(error)
            setLoadingPage(false)
        }

    }

    
    // console.log(listingData)

    return (
        <div>
            {loadingPage === true ?
             <div className='h-screen flex flex-col justify-center items-center'>
                <ReactLoading type='spinningBubbles' color={'#ADD8E8'} height={150} width={150} />
                <span className='font-bold mt-3 text-xl text-slate-800 duration-300 animate-pulse scale-105'>Loading...</span>
           </div>
            : 
            <div>
             <Slider {...settings}>
             {listingData && listingData.images && listingData.images.length > 0 && listingData.images.map((data, i) => {
                return (
                    <div key={i} className='flex justify-center p-2'>
                        <img src={data} alt={`image ${i}`} className='sm:h-[380px] h-190px] w-[560px] rounded-md border border-blue-500'/>
                    </div>
                )
            })}
            </Slider>
            <div className='p-5 mt-8 z-10'>
                <div className='flex items-center gap-3'>
                    <MdOutlineRealEstateAgent className='h-[30px] text-blue-400'/>
                    <div className='flex gap-3 items-center'>
                    <span className='font-bold text-md text-slate-800'>Name :</span>
                    <h1 className='font-semibold text-sm text-slate-700 not-italic'>{listingData.name}</h1>
                    </div>
                </div>
                <div className='flex items-center gap-3'>
                    <FaRegAddressCard className='h-[30px] text-blue-400'/>
                    <div className='flex gap-3 items-center'>
                    <span className='font-bold text-md text-slate-800'>Address :</span>
                    <h1 className='font-semibold text-sm text-blue-800 not-italic'>{listingData.address}</h1>
                    </div>
                </div>
                <div className='flex items-center sm:gap-2 md:gap-3 flex-wrap'>
                    <div className='flex items-center gap-3'>
                    <FaBed className='h-[30px] text-blue-400'/>
                    <div className='flex gap-3 items-center'>
                    <span className='font-bold text-sm text-slate-800'>Bed Rooms :</span>
                    <h1 className='font-semibold text-sm text-slate-700 not-italic'>{listingData.beds} {listingData.beds === 1 || listingData.baths === 0 ? ' Bed room' :' Bed rooms'}</h1>
                    </div>
                    </div>
                    <div className='flex items-center gap-3'>
                    <FaBath className='h-[30px] text-blue-400'/>
                    <div className='flex gap-3 items-center'>
                    <span className='font-bold text-sm text-slate-700'>Bath Rooms :</span>
                    <h1 className='font-semibold text-sm text-slate-700 not-italic'>{listingData.baths} {listingData.baths === 1 || listingData.baths === 0 ? ' Bath Room' :' Bath Rooms'}</h1>
                    </div>
                    </div>
                    {listingData.parkingspot && 
                    <div className='flex items-center gap-3'>
                    <LuParkingCircle className='h-[30px] text-blue-400'/>
                    <div className='flex gap-3 items-center'>
                    <span className='font-bold text-sm text-slate-700'>Parking Place</span>
                    </div>
                    </div>
                    }
                    <div className='flex items-center gap-3'>
                    <IoIosPricetags className='h-[30px] text-blue-400'/>
                    <div className='flex gap-3 items-center'>
                    <span className='font-bold text-sm text-slate-700'>Price/Rent :</span>
                    <h1 className='font-semibold text-sm text-slate-700 not-italic'>{listingData.regularprice}</h1>
                    </div>
                    </div>
                </div>
                <div className='mt-3'>
                    <h1 className='text-lg font-bold text-slate-800'>Description :</h1>
                    <div className='pt-1'>
                        <span className='pl-4 text-sm font-semibold text-slate-700'> {listingData.description}</span>
                    </div>
                </div>
            </div>
            <div className='w-full flex justify-center'>
                {currentUser._id === listingData.userRef ? 
                <div className='border border-blue-500 p-3 rounded-md duration-100 hover:scale-105 cursor-pointer border-2 flex items-center'>
                <FaPrayingHands className='w-[30px] text-green-900 scale-105 animate-pluse duration-300'/>
                <span className='font-semibold text-slate-800'>Thanks for upload estate pics and details</span>
                </div> :
                <div className='border border-blue-500 p-3 rounded-md duration-100 hover:scale-105 cursor-pointer border-2 flex items-center'>
                    <FaHeart className='w-[30px] text-red-900 scale-105 animate-pulse duration-300'/>
                    <span className='font-semibold text-slate-800'>Thanks for visiting</span>
                </div>
                    }
            </div>
            <ToastContainer />
            </div>
            }
            </div>
    )
}

export default ListData