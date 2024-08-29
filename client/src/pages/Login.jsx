import { Link } from "react-router-dom"
import { AuthForm, GoogleLogin } from "../components"
import useGlobalStateStore from "../store/store"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { BiHome } from "react-icons/bi"

const Login = () => {
  const user = useGlobalStateStore((state) => state.user)
  const navigate = useNavigate()

  useEffect(() => {
    user && navigate('/')
  },[])

  return (
    <>
      <div className="h-screen w-full flex">

      <div className="w-0 lg:w-1/2 h-full flex flex-col justify-center items-centerbg-primary-colour bg-[url(/assets/login-bg.jpg)] bg-cover bg-center bg-no-repeat"></div>

        <Link to="/" className="flex items-center gap-1 absolute right-8 top-8 text-sm font font-medium text-color1" ><BiHome className="text-lg" /> <span>Back to home</span></Link>

        <div className="w-full lg:w-1/2 h-full flex flex-col justify-center items-center">
          <div className='w-10/12 lg:w-3/5'>
            <div className='mb-6'>
              <h3 className='font-semibold text-text-color-1'>Welcome Back!</h3>
              <p className='text-text-color-3 text-sm'>Login to receive personalized property listings.</p>
            </div>

            <AuthForm isRegister={false} />
            <span className=' text-sm text-text-color-3'>Dont have an account? <Link to="/register" className='text-color1 underline' >Register</Link></span>

            <span className='flex justify-center my-8 text-text-color-3 relative text-divider text-sm'>OR</span>

              <GoogleLogin />

          </div>        
        </div>


        

      </div>
    </>
  )
}

export default Login