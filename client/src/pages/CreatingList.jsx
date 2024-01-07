import  app  from "../services/firebase";
import { getDownloadURL, getStorage,ref, uploadBytesResumable } from "firebase/storage";
import { useState } from "react"
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';


const CreatingList = () =>{
    const [imagesFiles, setImagesFiles] = useState([])
    const navigate =useNavigate()
    const [imageUploading, setImageUploading] = useState(false)
    const [formData, setFormData] = useState({
        housetype:"rent",
        name:'',
        description:'',
        address:'',
        offer:false,
        parkingspot:false,
        furnished:false,
        regularprice:0,
        beds:0,
        baths:0,
        images:[]
    })
    const {currentUser} = useSelector((state)=>state.user)

    const onHandleInput =(e)=>{
        if(e.target.id === "sell" || e.target.id==="rent"){
            setFormData({
                ...formData,
                housetype: e.target.id
            })
        }

        if(e.target.id === "description" || e.target.id === "name" || e.target.id === "address" ){
            setFormData({
                ...formData,
                [e.target.id] :  e.target.value
            })
        }
        
        if(e.target.id === "offer" || e.target.id === "parkingspot" || e.target.id === "furnished"){
            setFormData({
                ...formData,
                [e.target.id] : e.target.checked
            })
        }

        if(e.target.id === "beds" || e.target.id === "baths" || e.target.id === "regularprice"){
            setFormData({
                ...formData,
                [e.target.id] : parseInt(e.target.value)
            })
        }
        }


        const onHandleCreate = async(e)=>{
            e.preventDefault()
            // alert(formData)

            try {

                if(formData.name.length === 0){
                    toast.error(`please enter name`)
                    return;
                }
                if(formData.address.length === 0){
                    toast.error('please enter address')
                    return
                }
                if(formData.description.length === 0){
                    toast.error('Please enter description')
                    return
                }

                if(formData.regularprice === 0){
                    toast.error('Please enter regular price')
                    return
                }

                if(formData.images.length === 0){
                    toast.error('please upload atleast one image')
                    return 
                }
                const newData = {
                    method:"POST",
                    headers:{
                        'Content-Type':'application/json'
                    },
                    body:JSON.stringify({
                        ...formData,
                        userRef:currentUser._id
                    })
                }
                const creatingNewList = await fetch('/listing/datas/create-listing', newData)
                const responseCreatingList = await creatingNewList.json()

                if(responseCreatingList.success === false){
                    toast.error(responseCreatingList.message)
                    return
                }
                // console.log(responseCreatingList)
                navigate(`/list-data/${responseCreatingList._id}`)

                
            } catch (error) {
                toast.error(error)
            }

        }

        const onHandleUploadImages = async () => {
            setImageUploading(true)
            try {
                if (imagesFiles.length === 0) {
                    toast.error('Please upload an image');
                    setImageUploading(false)
                    return;
                }
        
                if (imagesFiles.length > 0 && imagesFiles.length + formData.images.length < 7) {
                    const promises = []
                    for(let i =0; i < imagesFiles.length; i++){
                        promises.push(storageImage(imagesFiles[i]))
                    }
                    Promise.all(promises).then((urls)=>{
                        setFormData({ ...formData, images: formData.images.concat(urls) });
                        setImageUploading(false)
                    })
                    .catch((error)=>{
                        setImageUploading(false)
                        toast.error('Please Upload image less than 2 MB')
                        return
                    });

                } else {
                    setImageUploading(false)
                    toast.error('You can upload a maximum of 6 images per listing.');
                    return;
                }
            } catch (error) {
                setImageUploading(false)
                toast.error(error.message);
                return
            }
        };
        
        const storageImage = async(imagefile) => {
            // console.log(imagefile.name,'datas getting')
            return new Promise((resolve, reject) => {
                const storage = getStorage(app);
                const fileName = new Date().getTime() + imagefile.name;
                const storageRef = ref(storage, `createListing/${fileName}`);
                const uploadImages = uploadBytesResumable(storageRef, imagefile);
        
                uploadImages.on('state_changed', (snapshot) => {
                    // You can handle progress if needed
                }, (error) => {
                    reject(error);
                }, () => {
                    getDownloadURL(uploadImages.snapshot.ref)
                        .then((downloadURL) => {
                            resolve(downloadURL);
                        })
                        .catch((error) => {
                            reject(error);
                        });
                });
            });
        };

        const onHandleDelete = (indexNo) =>{
            const filterData = formData.images.filter((_,i)=> i !== indexNo)
            setFormData({
                ...formData,
                images: filterData
            })
        }
        
    return (
        <div className="px-10 py-10 md:px-10 lg:px-20 xl:px-32">
            <h1 className="text-center font-semibold text-lg">Create a Listing</h1>
            <form className="grid grid-cols-1 gap-6 sm:grid-cols-1 md:grid-cols-2" onSubmit={onHandleCreate}>
                <div className="flex justify-center">
                    <div className="flex flex-col gap-4 md:w-[430px] w-[300px]">
                    <input type="text" name="name" id="name" className="p-2 rounded-md border border-2 border-blue-200 outline-blue-400" placeholder="Name" onChange={onHandleInput}/>
                    <textarea placeholder="Description" id="description" className="rounded-md p-2 border border-2 border-blue-200 outline-blue-400" cols={50} rows={3} onChange={onHandleInput}/>
                    <input type="text" placeholder="address" className="p-2 rounded-md border border-2 border-blue-200 outline-blue-400" id="address" onChange={onHandleInput}/>
                    <div className="flex gap-6 flex-wrap">
                    <div className="flex gap-1 items-center">
                        <input type="checkbox" className="h-5 w-4" id="sell" onChange={onHandleInput} checked={formData.housetype === "sell"}/>
                        <label className="font-semibold text-sm" htmlFor="sell">Sell</label>
                    </div>
                    <div className="flex gap-1 items-center">
                        <input type="checkbox" className="h-5 w-4" id="rent" onChange={onHandleInput}  checked={formData.housetype === "rent"}/>
                        <label className="font-semibold text-sm" htmlFor="rent">Rent</label>
                    </div>
                    <div className="flex gap-1 items-center">
                        <input type="checkbox" className="h-5 w-4" id="offer"  onChange={onHandleInput}/>
                        <label className="font-semibold text-sm" htmlFor="offer">Offer</label>
                    </div>
                    <div className="flex gap-1 items-center">
                        <input type="checkbox" className="h-5 w-4" id="parkingspot"  onChange={onHandleInput}/>
                        <label className="font-semibold text-sm whitespace-nowrap" htmlFor="parkingspot">Parking Spot</label>
                    </div>
                    <div className="flex gap-1 items-center">
                        <input type="checkbox" className="h-5 w-4" id="furnished" onChange={onHandleInput}/>
                        <label className="font-semibold text-sm" htmlFor="furnished">Furnished</label>
                    </div>
                    </div>
                    <div className="flex gap-4">
                        <div className="flex items-center gap-1">
                        <input type="number" min={0} max={10} className="rounded-md h-9 w-12 p-2 font-semibold text-slate-800  border border-2 border-blue-200 outline-blue-400" id="beds" value={setFormData.beds} onChange={onHandleInput}/>
                        <label htmlFor="bedrooms" className="font-semibold text-sm">Beds</label>
                        </div>
                        <div className="flex items-center gap-1">
                        <input type="number" min={0} max={10} className="rounded-md h-9 w-12 p-2 font-semibold text-slate-800  border border-2 border-blue-200 outline-blue-400" id="baths" value={setFormData.baths} onChange={onHandleInput}/>
                        <label htmlFor="bedrooms" className="font-semibold text-sm">Baths</label>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <input type="number" className="w-[120px] h-9 rounded-md p-2 font-semibold text-slate-800 border border-2 border-blue-200 outline-blue-400" value={setFormData.regularprice} id="regularprice" onChange={onHandleInput}/>
                        <div>
                            <h1 className="font-semibold text-sm text-slate-800">Regular Price</h1>
                            <h3 className="text-sm text-center text-slate-700">( $/Month )</h3>
                        </div>
                    </div>
                    </div>
                </div>
                <div className="flex justify-center">
                <div className="mt-10 sm:mt-0 md:w-[430px] w-[300px] sm:w-[350px]">
                <div className="mb-3">
                    <span className="font-semibold text-md text-slate-900">Images : <span className="text-gray-600 text-sm">The first image will be the cover (max-6)</span></span>
                </div>
                <div className="pt-1 flex gap-2 justify-between">
                    <input type="file" accept="image/*" className="font-semibold text-sm border border-green-500 p-2 rounded-md" id="images" multiple  onChange={(e)=> setImagesFiles(e.target.files)}/>
                    <button type="button"  onClick={onHandleUploadImages} className="border border-green-500 p-2 rounded-md text-md text-gray-800 font-semibold hover:bg-green-600 hover:text-white hover:scale-105 duration-300" disabled={imageUploading}>{imageUploading ? 'Loading...': 'Upload'}</button>
                </div>
                <div className="flex flex-col gap-3 my-2">
                {formData.images.length > 0 && formData.images.map((imageUrl, i) => (
                    <div key={i} className="flex justify-between items-center border border-2 border-gray-300 p-2 rounded-md hover:scale-105 cursor-pointer duration-300 bg-gray-100">
                        <img src={imageUrl} alt={`Image ${i}`} className="h-[50px] w-[50px] rounded-md"/>
                        <div>
                        <button type="button" className="bg-red-600 rounded-md p-2 duration-300 hover:scale-105 hover:opacity-90 hover:text-white font-semibold" onClick={()=>onHandleDelete(i)}>Delete</button>
                        </div>
                    </div>
                ))}
                </div>
                <button type="submit" className="text-center w-full p-2 bg-slate-600 text-white font-semibold rounded-md mt-2 hover:scale-105 hover:opacity-90 hover:duration-500">Create List</button>
                </div>
                </div>
                <ToastContainer />
            </form>
        </div>
    )
}

export default CreatingList