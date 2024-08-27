import * as Dialog from '@radix-ui/react-dialog';
import { IoCloseCircleOutline } from "react-icons/io5";
import { MdOutlinePassword } from "react-icons/md";
import { useState } from 'react';
import useGlobalStateStore from '../store/store';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import passwordUpdateSchema from '../utils/passwordSchema';
import { useMutation } from '@tanstack/react-query';
import { updateUser } from '../utils/api/userApi';
import { toast } from 'react-toastify';

const UpdatePasswordModal = () => {

    const [modalOpen, setModalOpen] = useState(false);
    const { user, setUser } = useGlobalStateStore((state) => ({
        user: state.user,
        setUser: state.setUser,
    }));

    const {register, setError, formState : {errors}, handleSubmit } = useForm({resolver : yupResolver(passwordUpdateSchema)})

    const passwordUpdateMutation = useMutation({
        mutationFn : (data) => updateUser(data),
        onSuccess : (updatedUser) => {
            setUser(updatedUser)
            setModalOpen(false)
            toast.success("Password updated successfully")
        },
        onError : (error) => {
            console.log(error)
            setError("root", {
                message : error.response.data.message
            })
        }
    })

    const updateUserPassword =  (data) => {

        passwordUpdateMutation.mutate({
            ...data,
            _id : user._id,
            email : user.email
        })
    
    }


    return (
    <Dialog.Root open={modalOpen} onOpenChange={setModalOpen}>
        <Dialog.Trigger asChild>
            <button className="bg-primary-colour text-white py-2 px-7 rounded-md text-sm flex items-center gap-2 max-sm:w-full max-sm:justify-center"><MdOutlinePassword className="text-2xl" /> Update Password</button>
        </Dialog.Trigger>
        <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-[rgba(0,0,0,.3)] z-[40000] animate-opacity" />
            <Dialog.Content className="bg-white rounded-lg fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] md:w-[65vw] max-w-[750px] z-[50000] shadow-2xl animate-contentShow focus:outline-none">

                <div className='p-3 md:p-5 border-b'>
                    <Dialog.Title className="text-sm md:text-lg text-center font-medium">Update Password</Dialog.Title>
                </div>


                <div className="px-8 sm:px-14 overflow-y-scroll">

                    <div className='sm:px-10 pb-16 pt-12 flex flex-col items-center justify-center'>

                        <form className='mt-3 sm:mt-7 sm:w-80' onSubmit={handleSubmit(updateUserPassword)}>
                            <div className='mb-4'>
                                <label className='max-sm:text-xs' htmlFor="password">New password</label>
                                <input type='password' {...register('password')} autoComplete='on' className='border border-text-color-4 w-full p-2 rounded-md outline-none text-text-color-1 max-sm:h-8' />
                                {errors.confirmedPassword && <span className="text-sm text-red-600">{errors.password?.message}</span>}
                            </div>

                            <div className='mb-4'>
                                <label className='max-sm:text-xs' htmlFor="email">Confirm password</label>
                                <input type='password' {...register('confirmedPassword')} autoComplete='on' className='border border-text-color-4 w-full p-2 rounded-md outline-none text-text-color-1 max-sm:h-8' />
                                {errors.confirmedPassword && <span className="text-sm text-red-600">{errors.confirmedPassword?.message}</span>}
                            </div>

                            {errors.root && <span className="text-sm text-red-600 mb-2">{errors.root?.message}</span>}
                            <button disabled={passwordUpdateMutation.isPending} className='btn-primary w-full flex justify-center mt-5 disabled:bg-color2' type="submit">{passwordUpdateMutation.isPending ? "Submiting..." : "Submit"}</button>
                        </form>
                    </div>

                </div>


                <Dialog.Close asChild>
                    <button className="IconButton size-8 inline-flex items-center justify-center absolute top-2 ms:top-4 right-4" aria-label="Close">
                        <IoCloseCircleOutline className='text-3xl' />
                    </button>
                </Dialog.Close>


            </Dialog.Content>
        </Dialog.Portal>
    </Dialog.Root>
    )
};

export default UpdatePasswordModal;