import app from "../services/firebase";
import { GoogleAuthProvider,getAuth,signInWithPopup } from "firebase/auth";
import { signInFailed, signInSuccess } from "../redux/user/userSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const OAuth = ()=>{
    const dispatch = useDispatch()
    const navigate = useNavigate()
const onHandleGoogle = async ()=>{
    try{
    const googleProvider = new GoogleAuthProvider()
    const auth = getAuth(app)
    const googleSignInResult = await signInWithPopup(auth, googleProvider)
    // console.log('google provider', googleSignInResult)
    const googleDatas = {name:googleSignInResult.user.displayName, email:googleSignInResult.user.email, avatar:googleSignInResult.user.photoURL}

    const newGoogleData = {
        method:"POST",
        headers:{
            'Content-Type':'application/json'
        },
        body:JSON.stringify(googleDatas)
    }

    const googleLogin = await fetch('/auth/user/googlesignin', newGoogleData)
    const responseResults = await googleLogin.json()

    dispatch(signInSuccess(responseResults))
    navigate('/')
}
catch(error){
    dispatch(signInFailed())
}

}

return(<button type="button" className="w-full text-center bg-red-500 p-2 rounded-md text-xxl font-semibold text-white hover:opacity-90 mt-1 uppercase" onClick={onHandleGoogle}> Google </button>)
}
export default OAuth