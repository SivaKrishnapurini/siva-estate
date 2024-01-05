import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { ToastContainer, toast } from 'react-toastify';
import OAuth from "../components/OAuth";

const SignUp = () =>{
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        name:'',
        email:'',
        password:'',
        confirmPassword:''
    })

    const [name, setName] = useState(false)
    const [email, setEmail] = useState(false)
    const [password, setPassword] = useState(false)
    const [confirmPassword, setConfirmPassword] = useState(false)

    const onHandle = (e)=>{
        setFormData({
            ...formData,
            [e.target.id]:e.target.value
        })
    }

    const onInputHandleName = () =>{
        if(formData.name.length === 0){
            setName(true)
            return;
        }else{
            setName(false)
        }
    }

    const onInputHandleEmail = ()=>{
        if(formData.email.length === 0){
            setEmail(true)
            return;
        }else{
            setEmail(false)
        }
    }

    const onInputHandlePassword = () =>{
        if(formData.password.length < 7 ){
            setPassword(true)
            return;
        }else{
            setPassword(false)
        }
    }

    const onInputHandleConfiPassword = () =>{
        if(formData.password !== formData.confirmPassword){
            setConfirmPassword(true)
            return;
        }else{
            setConfirmPassword(false)
        }
    }

    const onFormSubmit = async (e) =>{
        e.preventDefault()
        setLoading(true)
        if(formData.name.length === 0){
            setLoading(false)
            setName(true)
            return;
        }else{
            setName(false)
        }

        if(formData.email.length === 0){
            setEmail(true)
            setLoading(false)
            return;
        }else{
            setEmail(false)
        }

        if(formData.password.length < 7 ){
            setPassword(true)
            setLoading(false)
            return;
        }else{
            setPassword(false)
        }

        if(formData.password !== formData.confirmPassword){
            setConfirmPassword(true)
            setLoading(false)
            return;
        }else{
            setConfirmPassword(false)
        }

        const newRegisterData = {
            method:"POST",
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify(formData)
        }

        const newPostData = await fetch('/auth/user/signup', newRegisterData)
        const responseData = await newPostData.json()

        if(responseData.success === false){
            setLoading(false)
            toast.error(responseData.message)
            return;
        }
        setLoading(false)
        toast.success(responseData)
        navigate('/login')
    }

    return(
        <div className="flex justify-center items-center flex-col">
            <div className="p-4 w-96 rounded-md shadow-md">
            <form className="flex flex-col gap-4" onSubmit={onFormSubmit}>
                <div className="flex flex-col gap-1">
                    <label className="text-xxl font-semibold text-slate-600 uppercase" htmlFor="name">User Name</label>
                    <input type="text" placeholder="Name" className="p-2 rounded-md outline-slate-500" id="name" name="name" onChange={onHandle} value={formData.name} onKeyUp={onInputHandleName}/>
                    {name && <span className="text-sm font-semibold text-red-500">Please Enter Name *</span> }
                </div>
                <div className="flex flex-col gap-1">
                    <label className="text-xxl font-semibold text-slate-600 uppercase" htmlFor="email">Email</label>
                    <input type="email" placeholder="Email" className="p-2 rounded-md outline-slate-500" id="email" name="email" onChange={onHandle} value={formData.email} onKeyUp={onInputHandleEmail}/>
                    {email && <span className="text-sm font-semibold text-red-500">Please Enter Email *</span> }
                </div>
                <div className="flex flex-col gap-1">
                    <label className="text-xxl font-semibold text-slate-600 uppercase" htmlFor="password">Password</label>
                    <input type="password" placeholder="Password" className="p-2 rounded-md outline-slate-500" id="password" name="password" onChange={onHandle} value={formData.password} onKeyUp={onInputHandlePassword}/>
                    {password && <span className="text-sm font-semibold text-red-500">Please Enter password greater 7</span> }
                </div>
                <div className="flex flex-col gap-1">
                    <label className="text-xxl font-semibold text-slate-600 uppercase" htmlFor="confirmPassword">Confirm Password</label>
                    <input type="password" placeholder="Confirm Password" className="p-2 rounded-md outline-slate-500" id="confirmPassword" name="confirmPassword" onChange={onHandle} value={formData.confirmPassword} onKeyUp={onInputHandleConfiPassword}/>
                    {confirmPassword && <span className="text-sm font-semibold text-red-500">Password doesn't matched</span>}
                </div>
                <div>
                    <button type="sumbit" className="w-full text-center bg-blue-500 p-2 rounded-md text-xxl font-semibold text-white hover:opacity-90 uppercase flex justify-center"> {loading ? <img src="https://media.tenor.com/_62bXB8gnzoAAAAj/loading.gif" alt="loading" className="h-5 text-center"/> : 'Sign Up' }</button>
                    <OAuth />
                </div> 
                <div>
                    <p className="text-sm font-semibold text-slate-700">Have an account? <Link to={"/login"} className="text-slate-500 underline">Login</Link></p>
                </div>
                <ToastContainer />
            </form>
            </div>
        </div>
    )
}

export default SignUp