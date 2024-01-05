import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { ToastContainer, toast } from 'react-toastify';
import OAuth from "../components/OAuth";
import {signInFailed, signInSuccess, signInStart} from '../redux/user/userSlice'
import { useDispatch, useSelector } from "react-redux";


const Login = () =>{
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const {loading} = useSelector((state)=>state.user)
    // const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        email:"",
        password:""
    })

    const onInputHandle = (e) =>{
        setFormData({
            ...formData,
            [e.target.id] : e.target.value
        })
    }

    const onHandleSumbit = async (e) =>{
        e.preventDefault()
        // setLoading(true)
        dispatch(signInStart())
        if(formData.email.length === 0 || formData.password.length === 0){
            toast.error('Please fill the all fields')
            // setLoading(false)
            dispatch(signInFailed(false))
            return;
        }

        const LoginData = {
            method:"POST",
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify(formData)
        }

        const postLogin = await fetch('/auth/user/signin', LoginData)
        const responseLogin = await postLogin.json()

        if(responseLogin.success === false){
            toast.error(responseLogin.message)
            // setLoading(false)
            dispatch(signInFailed(false))
            return;
        }
        // console.log(responseLogin)
        // setLoading(false)
        dispatch(signInFailed(false))
        toast.success('Login Successfully')
        dispatch(signInSuccess(responseLogin))
        navigate('/')
    }

    return(
        <div className="flex justify-center items-center flex-col">
            <div className="p-4 w-96 rounded-md">
            <form className="flex flex-col gap-4" onSubmit={onHandleSumbit}>
                <div className="flex p-1 items-center justify-center flex-col gap-1">
                    <img src="https://cdn-icons-png.flaticon.com/512/3564/3564120.png" alt="logo" className="h-10 border border-slate-500 p-1 rounded-full items-center"/>
                    <h1 className="font-bold text-xxl text-blue-500">Login</h1>
                </div>
                <div className="flex flex-col gap-1">
                    <label className="text-xxl font-semibold text-slate-600 uppercase" htmlFor="email">Email</label>
                    <input type="email" value={formData.email} placeholder="Email" className="p-2 rounded-md outline-slate-500" id="email" name="email" onChange={onInputHandle}/>
                </div>
                <div className="flex flex-col gap-1">
                    <label className="text-xxl font-semibold text-slate-600 uppercase" htmlFor="password">Password</label>
                    <input type="password" value={formData.password} placeholder="Password" className="p-2 rounded-md outline-slate-500" id="password" name="password" onChange={onInputHandle}/>
                </div>
                <div>
                    <button type="sumbit" className="w-full text-center bg-blue-500 p-2 rounded-md text-xxl font-semibold text-white hover:opacity-90 uppercase flex justify-center">{loading ?  <img src="https://media.tenor.com/_62bXB8gnzoAAAAj/loading.gif" alt="loading" className="h-5 text-center"/> : 'Login' } </button>
                   <OAuth />
                </div> 
                <div>
                    <p className="text-sm font-semibold text-slate-700">Don't have an account? <Link to={"/sign-up"} className="text-slate-500 underline">Create an account</Link></p>
                </div>
                <ToastContainer />
            </form>
            </div>
        </div>
    )
}

export default Login