import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import getValidationSchema from "../utils/userSchema"
import { useNavigate } from "react-router-dom"
import useGlobalStateStore from "../store/store"
import { useMutation } from "@tanstack/react-query"
import { signupOrLoginUser } from "../utils/api/authApi"

const AuthForm = ({ isRegister }) => {

  const setUser = useGlobalStateStore((state) => state.setUser)
  const navigate = useNavigate()
  const { register, handleSubmit, formState: { errors }, setError } = useForm({ resolver: yupResolver(getValidationSchema(isRegister ? "registration" : "login")) })

  const authMutation = useMutation({
    mutationFn: (data) => signupOrLoginUser(isRegister, data),
    onSuccess: (data) => {
      if (isRegister) {
        navigate("/login");
      } else {
        setUser(data?.userInfo)
        navigate('/')
      }
    },
    onError: (error) => {
      console.log(error)
      setError("root", {
        message: error.response?.data?.message || "An unexpected error occurred"
      });
    }
  })

  const onAuthFormSubmit = (data) => {
    authMutation.mutate(data)
  };

  return (
    <>

      <form className='w-full text-[#505050] text-sm mb-3' onSubmit={handleSubmit(onAuthFormSubmit)} >

        {isRegister ? (
          <div className='mb-4'>
            <label htmlFor="username">Username</label>
            <input {...register("username")} className='border border-text-color-4 w-full p-2 rounded-md outline-none text-text-color-1' />
            {errors.username && <span className="text-sm text-red-600">{errors.username?.message}</span>}
          </div>
        ) : ""}


        <div className='mb-4'>
          <label htmlFor="email">E mail</label>
          <input  {...register("email")} className='border border-text-color-4 w-full p-2 rounded-md outline-none text-text-color-1' />
          {errors.email && <span className="text-sm text-red-600">{errors.email?.message}</span>}
        </div>

        <div className='mb-4'>
          <label htmlFor="password">Password</label>
          <input type="password" autoComplete="true" {...register("password")} className='border border-text-color-4 w-full p-2 rounded-md outline-none text-text-color-1' />
          {errors.password && <span className="text-sm text-red-600">{errors.password?.message}</span>}
        </div>

        {errors.root && <span className="text-sm text-red-600 mb-2">{errors.root?.message}</span>}
        <button disabled={authMutation.isPending} className='btn-primary w-full flex justify-center mt-5 disabled:bg-color2' type="submit">{authMutation.isPending ? "Submiting..." : "Submit"}</button>

      </form>
    </>

  )
}

export default AuthForm