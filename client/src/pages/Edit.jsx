import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { ToastContainer, toast } from "react-toastify"
import app from '../services/firebase'
import { getDownloadURL, getStorage, uploadBytesResumable,ref } from "firebase/storage"

const Edit = () =>{
    const {id} = useParams()
    const [gettingFormData, setGettingFormData] = useState({})
    const [imagesUpload,setUploadImages] = useState([])
    const [uploadPorcess, setUploadProcess] = useState(false)

    useEffect(()=>{
        gettingEditData()
    },[id])

    const gettingEditData = async() =>{
        const editListGet = {
            method:"GET",
            headers:{
                'Content-Type':'application/json'
            }
        }
        const editDataGet = await fetch(`/listing/datas/getEditData/${id}`, editListGet)
        const editGetResponse = await editDataGet.json()

        if(editGetResponse.success === false){
            toast.error(editGetResponse.message)
            return;
        }
        setGettingFormData(editGetResponse)
    }

    const deleteImage = (index)=>{
        const filterImages = gettingFormData.images.filter((image, i) => i !== index)
        setGettingFormData({
            ...gettingFormData,
            images:filterImages
        })
    }

    const uploadImages = () =>{
        setUploadProcess(true)
        try{
            if (imagesUpload.length === 0) {
                setUploadProcess(false)
                toast.error('Please upload an images');
                return;
            }
            if(imagesUpload.length > 0 && imagesUpload.length + gettingFormData.images.length < 7){
                const promises = []
                for(let i=0; i<imagesUpload.length;i++){
                    promises.push(fireStorage(imagesUpload[i]))
                }
                Promise.all(promises).then((urls)=>{
                    setGettingFormData({
                        ...gettingFormData,
                        images:gettingFormData.images.concat(urls)
                    })
                    setUploadProcess(false)
                })
                .catch((error)=>{
                    // toast.error(error.message)
                    setUploadProcess(false)
                    toast.error('Please upload less than 2 MB')
                    return
                })
            }else{
                setUploadProcess(false)
                toast.error('You have only upload max 6 images only')
                return
            }
        }catch(error){
            setUploadProcess(false)
            toast.error(error.message)
            return
        }
    }

    const fireStorage = async (image) =>{
        return new Promise((resolve, reject)=>{
            const storage = getStorage(app)
            const fileName = new Date().getTime() + image.fileName;
            const storageRef = ref(storage, `creatingListing/${fileName}`)
            const uploadImage = uploadBytesResumable(storageRef, image)

            uploadImage.on('state_changed',(snapshot)=>{

            },(error)=>{
                reject(error)
            },()=>{
                getDownloadURL(uploadImage.snapshot.ref)
                .then((downloadUrl)=>{
                    resolve(downloadUrl)
                })
                .catch((error)=>{
                    reject(error)
                })
            })
        })
    }

    const onHandleInput = (e) =>{
    if(e.target.id === 'sell' || e.target.id === "rent"){
        setGettingFormData({
            ...gettingFormData,
            housetype:e.target.id
        })
    }
    if(e.target.id === "offer" || e.target.id ==="parkingspot" || e.target.id === "furnished"){
        setGettingFormData({
            ...gettingFormData,
            [e.target.id]:e.target.checked
        })
    }
    if(e.target.id === "beds" || e.target.id === "baths" || e.target.id === "regularprice"){
        setGettingFormData({
            ...gettingFormData,
            [e.target.id] : parseInt(e.target.value)
        })
    }
    }

    const onHandleUpdate = async (e)=>{
        e.preventDefault()
        if(gettingFormData.images.length === 0){
            toast.error('please upload atleast one image')
            return
        }

        const editUpdateData = {
            method:"POST",
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify(gettingFormData)
        }

        const editDataupdate = await fetch(`/listing/datas/getUpdateData/${id}`,editUpdateData)
        const responseEditData = await editDataupdate.json()

        if(responseEditData.success === false){
            toast.error(responseEditData.message)
            return
        }
        toast.success('Updated successfully')
        setGettingFormData(responseEditData)

    }
    console.log(gettingFormData)

    return (
        <div className="py-10 px-10">
            <h1 className="text-center font-semibold text-lg">Create a Listing</h1>
            <form className="grid lg:grid-cols-2 grid-cols-1 mt-10" onSubmit={onHandleUpdate}>
                <div className="flex justify-center">
                    <div className="flex flex-col gap-4 w-[430px]">
                        <input type="text" id="name" name="name" placeholder="Name" className="p-2 rounded-md border border-2 border-blue-300 outline-blue-500" value={gettingFormData.name} onChange={onHandleInput}/>
                        <textarea type="text" id="description" name="description" placeholder="Description" rows={3} cols={50} className="p-2 rounded-md border border-2 border-blue-300 outline-blue-500 text-semibold text-slate-600"  value={gettingFormData.description} onChange={onHandleInput}/>
                        <input type="text" id="address" name="address" placeholder="address" className="p-2 rounded-md border border-2 border-blue-300 outline-blue-500" value={gettingFormData.address} onChange={onHandleInput}/> 
                        <div className="flex gap-3 flex-wrap">
                            <div className="flex items-center gap-2">
                                <input type="checkbox" className="h-4 w-4" id="sell" name="sell" checked={gettingFormData.housetype === "sell"} onChange={onHandleInput}/>
                                <label className="text-md font-semibold text-slate-800">Sell</label>
                            </div>
                            <div className="flex items-center gap-2">
                                <input type="checkbox" className="h-4 w-4" id="rent" name="rent" checked={gettingFormData.housetype === "rent"} onChange={onHandleInput}/>
                                <label className="text-md font-semibold text-slate-800">Rent</label>
                            </div>
                            <div className="flex items-center gap-2">
                                <input type="checkbox" className="h-4 w-4" id="offer" checked={gettingFormData.offer} onChange={onHandleInput}/>
                                <label className="text-md font-semibold text-slate-800">Offer</label>
                            </div>
                            <div className="flex items-center gap-2">
                                <input type="checkbox" className="h-4 w-4" id="parkingspot" checked={gettingFormData.parkingspot} onChange={onHandleInput}/>
                                <label className="text-md font-semibold text-slate-800">Parking Spot</label>
                            </div>
                            <div className="flex items-center gap-2">
                                <input type="checkbox" className="h-4 w-4" id="furnished" checked={gettingFormData.furnished} onChange={onHandleInput}/>
                                <label className="text-md font-semibold text-slate-800">Furnished</label>
                            </div>
                            <div className="flex items-center gap-2">
                                <input type="number" className="border rounded-md border-2 border-blue-300 outline-blue-500 p-2 font-semibold w-[60px]" value={gettingFormData.beds} id="beds" onChange={onHandleInput}/>
                                <label className="font-semibold text-md text-slate-800">{gettingFormData.beds ==0 ? 'Bed':'Beds'}</label>
                            </div>
                            <div className="flex items-center gap-2">
                                <input type="number" className="border rounded-md border-2 border-blue-300 outline-blue-500 p-2 font-semibold w-[60px]" id="baths"  value={gettingFormData.baths} onChange={onHandleInput}/>
                                <label className="font-semibold text-md text-slate-800">{gettingFormData.baths === 0 ? 'Bath': 'Baths'}</label>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <input type="number" id="regularprice" className="border border-blue-300 border-2 rounded-md p-2 w-[130px] outline-blue-500 font-semibold" value={gettingFormData.regularprice} onChange={onHandleInput}/>
                            <div className="flex flex-col items-center">
                                <h1 className="text-md font-semibold text-slate-800">Regular Price</h1>
                                <p className="text-sm font-semibold text-slate-600">$(Year/ Month)</p>
                            </div>
                            </div>
                    </div>
                </div>
                <div className="flex justify-center mt-10 lg:mt-0">
                <div className="flex flex-col gap-3">
                    <div>
                        <h1 className="text-md font-semibold">Images : <span className="text-slate-700 text-sm font-semibold">The first image will be the cover (max-6)</span></h1>
                    </div>
                    <div className="flex items-center mt-2 gap-3">
                        <input type="file" className="border border-2 border-yellow-400 p-2 rounded-md font-semibold text-slate-500 h-12 outline-none" accept="image/*" multiple onChange={(e)=>setUploadImages(e.target.files)}/>
                        <button type="button" name="Upload" className="border border-2 border-yellow-400 p-2 rounded-md font-semibold text-slate-500 hover:bg-blue-500 hover:text-slate-600 hover:border-gray-100 cursor-pointer h-12 hover:text-gray-100 truncate w-[100px]" onClick={uploadImages} disabled={uploadPorcess}>{uploadPorcess ? 'Uploading...': 'Upload'}</button>
                    </div>
                    <div className="flex flex-col gap-2">
                    {gettingFormData && gettingFormData.images && gettingFormData.images.map((image, index) => (
                        <div key={index} className="border border-2 border-blue-300 p-2 rounded-md flex justify-between items-center hover:scale-105 duration-300 hover:shadow-md hover:shadow-slate-400">
                            <img src={image} alt={`${index}`} className="h-10 w-14"/>
                            <button type="button" className="bg-red-600 p-2 rounded-md font-semibold text-slate-100 hover:opacity-90 hover:scale-105 duration-300" onClick={()=> deleteImage(index)}>Delete</button>
                        </div>
                    ))}
                    </div>

                    <div>
                        <button type="sumbmit" className="bg-gray-500 hover:opacity-90 text-center w-[410px] p-2 rounded-md text-gray-100 font-semibold">Update List</button>
                    </div>
                </div>
                </div>
                <ToastContainer />
            </form>
        </div>
    )
}

export default Edit