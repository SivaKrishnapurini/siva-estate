import React, { useEffect, useState } from 'react'
import { FaSearch } from "react-icons/fa";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { VscThreeBars } from "react-icons/vsc";
import { RxCross2 } from "react-icons/rx";
import { useSelector } from 'react-redux';

const Header = ()=>{
    const [mobileView, setMobileView] = useState(false)
    const navigate = useNavigate()
    const [searchData,setSearchData] = useState('')
    const {currentUser} = useSelector((state)=>state.user)

    const mobileViewTab = () =>{
        setMobileView(!mobileView)
    }


    const searchFilter = (e)=>{
        e.preventDefault()
        const searchUrl = new URLSearchParams(window.location.search)
        searchUrl.set('searchTerm',searchData)
        const searchQuery = searchUrl.toString()
        navigate(`/search?${searchQuery}`)
    }

    useEffect(()=>{
        const searchData = new URLSearchParams(location.search)
        const searchTermUrl = searchData.get('searchTerm')
        
        if(searchTermUrl){
            setSearchData(searchTermUrl)
        }

    },[location.search])

    return(
        <>
        <div className='bg-blue-100 p-3 shadow-md flex items-center justify-between sm:pl-20 pr-5 top-0 w-full'>
            <h1 className='text-xxl font-bold'>Siva <span className='text-slate-500 text-xxl font-bold'>Estate</span></h1>
            <div className='flex justify-center'>
            <form className='flex items-center bg-slate-100 p-2 rounded-md shadow-sm search_bar' onSubmit={searchFilter}>
                <input type="search" placeholder='Search...' className='bg-slate-100 outline-none' value={searchData} onChange={(e)=>setSearchData(e.target.value)}/>
                <button type="submit">
                    <FaSearch className='text-slate-500 pl-1 text-xxl'/>
                </button>
            </form>
            </div>
            <ul className='gap-4 hidden sm:flex'>
               <Link to={"/"}><li className='font-semibold text-md text-slate-700 p-2 hover:bg-gray-100 hover:rounded-md hover:shadow-md duration-300 hover:scale-105'>Home</li></Link>
               <Link to={"/about"}><li className='font-semibold text-md text-slate-700 p-2 hover:rounded-md hover:bg-gray-100 hover:shadow-md duration-300 hover:scale-105'>About</li></Link>
               <Link to={"/contact"}><li className='font-semibold text-md text-slate-700 p-2 hover:rounded-md hover:bg-gray-100 hover:shadow-md duration-300 hover:scale-105'>Contact</li></Link>
              {/* {currentUser ? <Link to={"/profile"}><li className='font-semibold text-md text-slate-700 p-2 hover:rounded-md hover:bg-blue-100 hover:shadow-md'>Profile</li></Link>: <Link to={"/login"}><li className='font-semibold text-md text-slate-700 p-2 hover:rounded-md hover:bg-blue-100 hover:shadow-md'>Sing In</li></Link> } */}
              {currentUser ? <Link to={"/profile"} className='flex flex-col justify-center duration-300 hover:scale-105'><img src={currentUser.avatar} alt="profile" className='h-8 w-8 rounded-full spin'/></Link>: <Link to={"/login"}><li className='font-semibold text-md text-slate-700 p-2 hover:rounded-md hover:bg-blue-100 hover:shadow-md duration-300 hover:scale-105'>Sing In</li></Link> }
            </ul>
        <div className='sm:hidden cursor-pointer'>
           {mobileView ?  
            <RxCross2 className='text-3xl transition-transform duration-400 hover:scale-200 rotate-6 hover:border hover:border-gray-400 hover:rounded-full hover:border-blue-400 text-blue-500 hover:p-1' onClick={mobileViewTab} /> :
            <VscThreeBars className='text-3xl transition-transform duration-400 hover:scale-200 rotate-6 hover:border hover:border-gray-400 hover:rounded-full hover:border-blue-400 text-blue-500 hover:p-1' onClick={mobileViewTab} />
            }
            </div>
        </div>
       {mobileView && 
       <div className='flex justify-center w-full'>
       <div className='flex flex-col sm:hidden scale-105 duration-400 w-full m-3 relative'>
        <ul className='p-3 w-full bg-blue-100 relative rounded-md'>
        <Link to={"/"} onClick={mobileViewTab}><li className='font-semibold text-md text-slate-700 p-2 hover:bg-gray-100 hover:rounded-md text-center hover:shadow-md hover:rotate-1 duration-300 hover:scale-105'>Home</li></Link>
        <Link to={"/about"} onClick={mobileViewTab}><li className='font-semibold text-md text-slate-700 p-2 hover:bg-gray-100 hover:rounded-md text-center hover:shadow-md hover:-rotate-1 duration-300 hover:scale-105'>About</li></Link>
        <Link to={"/contact"} onClick={mobileViewTab}><li className='font-semibold text-md text-slate-700 p-2 hover:bg-gray-100 hover:rounded-md text-center hover:shadow-md hover:rotate-1 duration-300 hover:scale-105'>Contact</li></Link>
        {/* {currentUser ? <Link to={"/profile"} onClick={mobileViewTab}><li className='font-semibold text-md text-slate-700 p-2 hover:bg-blue-200 hover:rounded-md text-center hover:shadow-md'>Profile</li></Link>: <Link to={"/login"} onClick={mobileViewTab}><li className='font-semibold text-md text-slate-700 p-2 hover:bg-blue-200 hover:rounded-md text-center hover:shadow-md'>Sign In</li></Link> } */}
        {currentUser ? <Link to={"/profile"} className='flex justify-center duration-300 hover:scale-105' onClick={mobileViewTab}><img src={currentUser.avatar} alt="profile" className='h-8 w-8 rounded-full'/></Link>: <Link to={"/login"} onClick={mobileViewTab}><li className='font-semibold text-md text-slate-700 p-2 hover:bg-blue-200 hover:rounded-md text-center hover:shadow-md duration-300 hover:scale-105'>Sign In</li></Link> }
        </ul>
        </div>
        </div> }
        </>
    )
}

export default Header