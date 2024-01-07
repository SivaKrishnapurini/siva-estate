import { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { ToastContainer, toast } from 'react-toastify';
import { signInSuccess,logOutSuccess,uploadDataLoading, uploaDataSuccess } from "../redux/user/userSlice";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import app from "../services/firebase";
import {Link, useNavigate} from 'react-router-dom'


const Profile = () =>{
    const dispatch = useDispatch()
    const fileRef = useRef()
    const navigate = useNavigate()
    const [fileProfile, setFileProfile] = useState(undefined)
    const [uploadProgress,setUploadProgress] =useState(0)
    const {currentUser,updateLoading} = useSelector((state)=>state.user)
    const [formData, setFormData] = useState({})
    const [createdListData, setCreatedListData] = useState({})
    const [showList, setShowList] = useState(false)
    const [deleteLoading, setDeleteLoading] = useState(false)

    const onHandleInputs = (e)=>{
        setFormData({
            ...formData,
            [e.target.id] :e.target.value
        })
    }


    useEffect(()=>{
        if(fileProfile){
            handleFileUpload()
        }

    },[fileProfile])

    const handleFileUpload = () => {
        const storage = getStorage(app);
        const fileName = new Date().getTime() + fileProfile.name;
        const storageRef = ref(storage, `profiles/${fileName}`);
        const uploadTask = uploadBytesResumable(storageRef, fileProfile);
      
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            const gettingProgress = Math.round(progress);
            // console.log(gettingProgress)
            setUploadProgress(gettingProgress);
          },
          (error) => {
            // console.error('Error uploading file:', error);
            setUploadProgress(0)
            toast.error('Please upload image lessthan 2 MB')
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref)
            .then((downloadUrl)=>{
                setFormData({
                    ...formData,
                    avatar:downloadUrl
                })
                setTimeout(()=>{
                setUploadProgress(0)
                },3000)

            })
            .catch((error)=>{
                toast.error(error.messgae)
            })
          }
        );
      };
      
    //   console.log(formData.avatar)
    const onHandleSumbit = async(e) =>{
        e.preventDefault()
        dispatch(uploadDataLoading())
        try{
        if(formData.password !== undefined && formData.password.length < 8){
            toast.error('Please password greater than 7 characters')
            return;
        }

        const updateExistData = {
            method:"POST",
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify(formData)
        }

        const updateUserData = await fetch(`/auth/user/updateuser/${currentUser._id}`,updateExistData)

        const responseUpdateData = await updateUserData.json()
        if(responseUpdateData.success === false){
            toast.error(responseUpdateData.message)
            dispatch(uploaDataSuccess())
            return;
        }

        toast.success('details updated successfully')
        // dispatch(logOutSuccess(responseUpdateData))
        dispatch(signInSuccess(responseUpdateData))
        dispatch(uploaDataSuccess())

    }catch(error){
        toast.error(error.messgae)       
        dispatch(uploaDataSuccess())
    }
}

const onHandleLogOut = async() =>{
    try{
        const logOutData = {
            method:"POST",
            headers:{
                'Content-Type':'application/json'
            },
        }

        const existUserLogout = await fetch(`/auth/user/logout/${currentUser._id}`,logOutData)
        const existUserResponse = await existUserLogout.json()

        if(existUserResponse.success === false){
            toast.error(existUserResponse.messgae)
        }
        dispatch(logOutSuccess())
        navigate('/login')
        
    }catch(error){
        toast.error(error.messgae)
    }
}

const onHandleShowList = () =>{
    setShowList(!showList)
    ListingData()
}

const ListingData =  async() =>{
    try{
        const currentUsrId = currentUser._id
        const currentDataGet = {
            method:"GET",
            headers:{
                'Content-Type':'application/json'
            }
        }
        const gettingListData = await fetch(`/listing/datas/createdData/${currentUsrId}`,currentDataGet)
        const responseGettingListData = await gettingListData.json()

        if(responseGettingListData.success === false){
            toast.error(responseGettingListData.message)
            return;
        }

        setCreatedListData(responseGettingListData)

    }catch(error){
        toast.error(error.message)
    }
}

const onHandleDelete = async(deleteId)=>{
    try{
        setDeleteLoading(true)
        const deleteCurrentData = {
            method:"GET",
            headers:{
                'Content-Type':'application/json'
            }
        }

        const deleteData = await fetch(`/listing/datas/deleteData/${deleteId}`,deleteCurrentData)
        const deleteDataResponse = await deleteData.json()

        if(deleteDataResponse.success === false){
            toast.error(deleteDataResponse.message)
            setDeleteLoading(false)
            return;
        }

        // console.log(deleteDataResponse)
        toast.success(deleteDataResponse)
        setDeleteLoading(false)
        ListingData()

    }catch(error){
        toast.error(error.message)
        setDeleteLoading(false)
    }

}


    return (
        <>
        <div className="flex flex-col justify-center items-center overflow-hidden">
            <form className="p-4 flex flex-col gap-4 w-96 rounded-md" onSubmit={onHandleSumbit}>
                <h1 className="text-lg font-bold text-slate-600 text-center uppercase">Profile</h1>
                <div className="flex justify-center">
                    <input type="file" accept="image/*" ref={fileRef} hidden onChange={(e)=>setFileProfile(e.target.files[0])}/>
                    <img src={formData.avatar||currentUser.avatar} alt="proifle image" className="rounded-full h-[65px] w-[65px] cursor-pointer" id="avatar" name="avatar" onClick={()=>fileRef.current.click()}/>
                </div>
              {uploadProgress > 0 && uploadProgress < 100  ? <span className="font-semibold text-center text-lg text-gray-600">Image Uploading <span className="text-slate-500">{uploadProgress}</span></span> : uploadProgress === 100 && <span className="text-green-700 text-center font-semibold">Image Upload successfully</span> }
                <div className="flex flex-col gap-1">
                <label className="text-xxl font-semibold" htmlFor="name">Name</label>
                <input type="text" placeholder="Name" id="name" value={currentUser.name||formData.name} className="p-2 rounded-md outline-slate-400 border border-slate-400 border-1 font-semibold"  onChange={onHandleInputs} />
                </div>
                <div className="flex flex-col gap-1">
                    <label className="text-xxl font-semibold" htmlFor="email">Email</label>
                    <input type="email" placeholder="email" id="email" value={currentUser.email||formData.email} className="p-2 rounded-md outline-slate-400 border border-slate-400 border-1 font-semibold"  onChange={onHandleInputs} />
                </div>
                <div className="flex flex-col gap-1">
                    <label className="text-xxl font-semibold" htmlFor="password">Change Password</label>
                    <input type="password" placeholder="password" value={formData.password} id="password" className="p-2 rounded-md outline-slate-400 border border-slate-400 border-1 font-semibold" onChange={onHandleInputs} />
                </div>
                <div className="flex flex-col gap-2">
                    <button type="submit" className="bg-slate-700 w-full p-2 rounded-md text-white text-xxl uppercase font-semibold hover:opacity-90 hover:scale-105 duration-300" disabled={updateLoading}>{updateLoading? 'Loading...': 'Update Details'}</button>
                    <Link to={"/CreatingList"}><button type="button" className="border border-2 broder-gray-200 w-full p-2 rounded-md text-slate-800 text-xxl uppercase font-semibold hover:opacity-90 hover:scale-105 duration-300">Creating List</button></Link>
                </div>
                <ToastContainer />
            </form>
            <div className="w-96 flex justify-end">
            <button
                type="button"
                className="bg-red-500 p-2 rounded-md text-white font-semibold text-xxl hover:opacity-90 text-end duration-300 hover:scale-105 mr-4 -mt-5"
            onClick={onHandleLogOut}>
                LogOut
            </button>
            </div>
            <div className="bg-gray-400 w-[360px] flex justify-center rounded-md mt-2 mb-2 hover:scale-105 duration-300 cursor-pointer" onClick={onHandleShowList}>
                <button type="button" className="p-2 font-semibold text-slate-200">{showList ? 'Hide' :'Show List'}</button>
            </div>
        </div>
       { showList && createdListData && createdListData.length > 0 && 
       <div className="flex flex-wrap justify-center">
        {createdListData.map((data)=>(
            <div className="p-2 border border-2 border-gray-300 w-[390px] m-3 rounded-md" key={data._id}>
            <div className="flex items-center gap-3 justify-center">
                <Link to={`/list-data/${data._id}`}><img src={data.images[0]} alt='logoimages' className="h-10 w-10 z-0 rounded-md" /></Link>
                <Link to={`/list-data/${data._id}`}><h1 className="truncate font-semibold text-slate-700 w-40 hover:scale-105 duration-300 animate-pulse">{data.name}</h1></Link>
                <div className="flex items-center gap-2">
                    <Link to={`/edit/${data._id}`}><button type="button" className="p-2 bg-green-400 rounded-md w-16 font-semibold text-gray-100 hover:scale-105 duration border border-2 border-green-400">Edit</button></Link>
                    <button type="button" className="p-2 border border-2 border-red-500 rounded-md w-16 text-red-500 font-semibold hover:scale-105 duration-200" onClick={()=>onHandleDelete(data._id)}>{deleteLoading ? 'Deleting...':'Delete'}</button>
                </div>
            </div>
            </div>
        ))}    
    </div> 
    }
        {showList && createdListData.length === 0 && 
        <div className="flex justify-center mt-1 font-semibold text-red-600 hover:opacity-90">
            <h1>You are not created any estate list</h1>
        </div>
        }
        </>
    )
}

export default Profile