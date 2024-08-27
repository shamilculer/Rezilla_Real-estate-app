import { useGoogleLogin } from "@react-oauth/google"
import { useNavigate } from "react-router-dom"
import { toast } from 'react-toastify';
import useGlobalStateStore from "../store/store";
import { useMutation } from "@tanstack/react-query";
import { googleLogin } from "../utils/api/authApi";

const GoogleLogin = () => {

    const navigate = useNavigate()
    const setUser = useGlobalStateStore((state) => state.setUser)

    const googleAuthMutation = useMutation({
        mutationFn : (googleResponse) => googleLogin(googleResponse),
        onSuccess : (data) => {
            setUser(data?.userInfo)
            navigate('/')
        },
        onError : (error) => {
            toast.error(error.message)
        }
    })

    const googleSignup = useGoogleLogin({
        onSuccess: (codeResponse) => googleAuthMutation.mutate(codeResponse),
        onError: (error) => (
            toast.error("Login failed! Please try again.")
        )
    })

    return (
        <>
            <button onClick={googleSignup} className="px-4 py-2 border border-text-color-4 flex justify-center gap-2 rounded-lg text-slate-700 w-full">
                <img className="w-5 h-5" src="https://www.svgrepo.com/show/475656/google-color.svg" loading="lazy" alt="google logo" />
                <span>SignUp with Google</span>
            </button>
        </>

    )
}

export default GoogleLogin