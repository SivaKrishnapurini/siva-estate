import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { CiLocationOn } from "react-icons/ci";
const Search = () =>{
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [serachFetchData, setSearchFetchData] = useState([])
    const [showMore, setShowMore] = useState(false)
    const [searchDatas, setSearchData] = useState({
        searchTerm:'',
        housetype:'all',
        offer:false,
        parking:false,
        furnished:false,
        sort:'createdAt',
        order:'desc'
    })

console.log(serachFetchData)
    const onHandleSearch = (e) =>{

        if(e.target.id === 'searchTerm'){
        setSearchData({
            ...searchDatas,
            searchTerm : e.target.value
        })
    }
    if(e.target.id === 'offer' ||  e.target.id === 'parking' || e.target.id === "furnished"){
        setSearchData({
            ...searchDatas,
            [e.target.id] : e.target.checked || e.target.checked === 'true' ? true: false
        })
    }
    if(e.target.id === 'all' || e.target.id === 'sell' || e.target.id === 'rent'){
        setSearchData({
            ...searchDatas,
            housetype : e.target.id
        })
    }
    if(e.target.id === 'sort_order'){
        const sortValue = e.target.value.split('_')[0] || 'createdAt'
        const orderValue = e.target.value.split('_')[1] || 'desc'
        setSearchData({
            ...searchDatas,
            sort : sortValue,
            order: orderValue

        })
    }
    }

    const onSearchHandle = (e) =>{
        e.preventDefault()
        const urlParams = new URLSearchParams()
        urlParams.set('searchTerm', searchDatas.searchTerm)
        urlParams.set('housetype', searchDatas.housetype)
        urlParams.set('parking', searchDatas.parking)
        urlParams.set('furnished', searchDatas.furnished)
        urlParams.set('offer', searchDatas.offer)
        urlParams.set('sort', searchDatas.sort)
        urlParams.set('order', searchDatas.order)

        const searchQuery = urlParams.toString()
        navigate(`/search?${searchQuery}`)
    }

    useEffect(()=>{
        setLoading(true)
        const urlParams = new URLSearchParams(window.location.search)
        const searchTermFromUrl = urlParams.get('searchTerm')
        const houseTypeFromUrl = urlParams.get('housetype')
        const parkingFromUrl = urlParams.get('parking')
        const furnishedFromUrl = urlParams.get('furnished')
        const offerFromUrl = urlParams.get('offer')
        const sortFromUrl = urlParams.get('sort')
        const orderFromUrl = urlParams.get('order')
        // console.log(gettingUrl.toString())

        if(
            searchTermFromUrl ||
            houseTypeFromUrl ||
            parkingFromUrl ||
            furnishedFromUrl ||
            offerFromUrl ||
            sortFromUrl ||
            orderFromUrl
        ){
           setSearchData({ 
            searchTerm:searchTermFromUrl,
            housetype:houseTypeFromUrl || 'all',
            offer:offerFromUrl === 'true' ? true : false,
            parking:parkingFromUrl === 'true' ? true : false,
            furnished:furnishedFromUrl === 'true' ? true : false,
            sort:sortFromUrl || 'createdAt',
            order:orderFromUrl || 'desc'
        })
        }
        const fetchingSearchResult = async() =>{
            setShowMore(false)
            const searchQuery = urlParams.toString()
            const fetchSearchData = await fetch(`/listing/datas/search?${searchQuery}`)
            const resultsFetch= await fetchSearchData.json()
            
            if(resultsFetch.length > 8){
                setShowMore(true)
            }else{
                setShowMore(false)
            }
            setLoading(false)
            setSearchFetchData(resultsFetch)
        }
        
        fetchingSearchResult()

    },[location.search])

const loadMoreData = async() =>{
    const numberOfListing = serachFetchData.length
    const startIndex = numberOfListing
    const urlSearchData = new URLSearchParams(window.location.search)
    urlSearchData.set("startIndex",startIndex)

    const urlSearchQuery = urlSearchData.toString()
    const res = await fetch(`/listing/datas/search?${urlSearchQuery}`)
    const data = await res.json()

    if(data.length < 9){
        setShowMore(false)
    }
    setSearchFetchData([...serachFetchData,...data])
}

    return(
        <div className="flex flex-col md:flex-row items-center md:items-start">
            <div className="p-7 border-b-2 md:border-r-2 md:h-screen md:w-[450px] w-[500px]">
                <form className="flex flex-col gap-3" onSubmit={onSearchHandle}>
                    <div className="flex items-center gap-3">
                        <label className="whitespace-nowrap font-semibold">Search Term:</label>
                        <input type="text" id="searchTerm" value={searchDatas.searchTerm} placeholder="Search..." className="border outline-none border-1 w-full p-2 rounded-md" onChange={onHandleSearch}/>
                    </div>
                    <div className="flex gap-3 items-center py-2 flex-wrap">
                        <label className="font-semibold whitespace-nowrap">Type :</label>
                        <div className="flex items-center gap-2">
                            <input type="checkbox" id="all" name="all" className="w-4 h-4 mt-1 cursor-pointer" checked={searchDatas.housetype === 'all'} onChange={onHandleSearch} />
                            <span className="text-md">Rent & Sell</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <input type="checkbox" id="sell" name="sell" className="w-4 h-4 mt-1 cursor-pointer" checked={searchDatas.housetype === "sell"}  onChange={onHandleSearch} />
                            <span className="text-md">Sell</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <input type="checkbox" id="rent" name="rent" className="w-4 h-4 mt-1 cursor-pointer" checked={searchDatas.housetype === "rent"} onChange={onHandleSearch} />
                            <span className="text-md">Rent </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <input type="checkbox" id="offer" className="w-4 h-4 mt-1 cursor-pointer" checked={searchDatas.offer} onChange={onHandleSearch} />
                            <span className="text-md">Offer</span>
                        </div>
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <label className="font-semibold text-md">Amemities:</label>
                            <div className="flex items-center gap-1">
                                <input type="checkbox" id="parking" className="h-4 w-4 cursor-pointer" checked={searchDatas.parking} onChange={onHandleSearch}/>
                                <label>Parking</label>
                            </div>
                            <div className="flex items-center gap-1">
                                <input type="checkbox" id="furnished" className="w-4 h-4 cursor-pointer" checked={searchDatas.furnished} onChange={onHandleSearch}/>
                                <label>Furnished</label>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <label className="font-semibold text-md">Sort :</label>
                        <select className="p-2 border-2 border rounded-md font-semibold text-slate-700 w-48 text-sm outline-none" id="sort_order" onChange={onHandleSearch} defaultValue={searchDatas.sort+'_'+searchDatas.order}>
                            <option className="font-semibold text-slate-700 text-sm" value="createdAt_desc">Latest</option>
                            <option className="font-semibold text-slate-700 text-sm" value="createdAt_asc">Old Data</option>
                            <option className="font-semibold text-slate-700 text-sm" value="regularprice_asc">Price Low to High</option>
                            <option className="font-semibold text-slate-700 text-sm" value="regularprice_desc">Price High to low</option>
                        </select>
                    </div>
                        <button type="sumbit"  className="bg-slate-600 p-2 rounded-md font-semibold text-center text-slate-100">Search</button> 
                </form>
            </div>
            <div className="md:w-[850px] w-[500px] p-3 md:p-0">
                <h1 className="font-semibold text-2xl mt-4 text-slate-500">Listing Results Data:</h1>
                <div className="md:h-96 flex flex-col items-center justify-center hidden">
                    <img src="https://i.stack.imgur.com/IA7jp.gif" alt="loading gif" className="h-28 w-28 rounded-full"/>
                </div>
                <div className="flex gap-4 m-2 flex-wrap rounded-md overflow-y-auto h-[500px]">
                    {loading ? (<div className="md:h-80 flex flex-col items-center justify-center w-[430px] lg:w-screen">
                        <img src="https://www.icegif.com/wp-content/uploads/2023/07/icegif-1265.gif" alt="load gif" className="h-32 w-32" />
                    </div>) : (serachFetchData && serachFetchData.length > 0 ? serachFetchData.map((searchData, index) => (
                                      <div className="shadow-md rounded-md w-52 h-72 m-3" key={index}>
                                      <img src={searchData.images[0]} alt="image name" className="h-28 w-52 rounded-md hover:scale-95 duration-300 cursor-pointer tranisiton-scale"/>
                                      <div className="bg-slate-100 p-2 flex flex-col gap-1">
                                          <h1 className="font-semibold text-sm text-slate-400 truncate">{searchData.name}</h1>
                                          <div className="flex items-center gap-1">
                                              <CiLocationOn className="text-green-900"/>
                                              <p className="text-sm truncate">{searchData.address}</p>
                                          </div>
                                          <div className="">
                                              <p className="h-[4.5em] line-clamp-3 text-sm">{searchData.description}</p>
                                          </div>
                                          <div>
                                              <span className="font-semibold text-md text-slate-800">Cost : <span className="text-sm text-slate-500"> $ {searchData.regularprice}</span></span>
                                          </div>
                                          <Link to={`/list-data/${searchData._id}`}><div className="bg-slate-700 p-1 rounded-md text-center hover:scale-105 duration-300 transition-scale">
                                              <h1 className="text-md font-semibold text-slate-100">Check Details</h1>
                                          </div></Link>
                                      </div>
                                  </div>              
                )): <div><h1>Data Not Found</h1></div>) }
                {showMore && <div>
                    <button className="text-center w-full hover:underline" onClick={loadMoreData}>
                    <span className="font-semibold text-green-400">Show more</span>
                    </button> 
                </div>}
                </div>
            </div>

        </div>
    )
}

export default Search