import * as Dialog from '@radix-ui/react-dialog';
import { IoCloseCircleOutline } from "react-icons/io5";
import { CiEdit } from "react-icons/ci";
import { useCallback, useState } from 'react';
import useGlobalStateStore from '../store/store';
import { useForm } from 'react-hook-form';
import { useDropzone } from 'react-dropzone';
import { yupResolver } from '@hookform/resolvers/yup';
import getValidationSchema from '../utils/userSchema';
import { useMutation } from '@tanstack/react-query';
import { updateUser } from '../utils/api/userApi';
import { toast } from 'react-toastify';

const EditProfileModal = () => {

    const [modalOpen, setModalOpen] = useState(false);
    const { user, setUser } = useGlobalStateStore((state) => ({
        user: state.user,
        setUser: state.setUser,
    }));
    const [imageFile, setImageFile] = useState(null)
    const [profileImage, setProfileImage] = useState(user.profileImage || "");

    const onDrop = useCallback((acceptedfiles) => {
        setImageFile(acceptedfiles)
        const imgUrl = URL.createObjectURL(acceptedfiles[0])
        setProfileImage(imgUrl)
    }, []);

    const { getRootProps, getInputProps, open } = useDropzone({
        onDrop,
        accept : { 'image/*': [] },
        maxFiles: 1,
    });

    const { register, setError, formState: { errors }, handleSubmit } = useForm({ resolver: yupResolver(getValidationSchema("updation")) })

    const profileUpdateMutation = useMutation({
        mutationFn : (data) => updateUser(data),
        onSuccess : (updatedUser) => {
            setUser(updatedUser)
            setImageFile(null)
            setModalOpen(false)
            toast.success("Profile updated successfully")
        },
        onError : (error) => {
            console.log(error)
            toast.error("An unexpected error occurred")
        }
    })

    const onUpdateUserProfile = async (data) => {
        
        if(imageFile && imageFile.length > 0){
            data.profileImage = imageFile[0]
        }

        data._id = user._id

        profileUpdateMutation.mutate(data)
    }


    return (
        <Dialog.Root open={modalOpen} onOpenChange={setModalOpen}>
            <Dialog.Trigger asChild>
                <button className="bg-primary-colour text-white py-2 px-7 rounded-md text-sm flex items-center gap-2 max-sm:w-full max-sm:justify-center"><CiEdit className="text-2xl" /> Edit Profile</button>
            </Dialog.Trigger>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-[rgba(0,0,0,.3)] z-[40000] animate-opacity" />
                <Dialog.Content className="bg-white rounded-lg fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] md:w-[60vw] max-w-[750px] z-[50000] shadow-2xl animate-contentShow focus:outline-none">

                    <div className='p-3 md:p-5 border-b'>
                        <Dialog.Title className="text-sm md:text-lg text-center font-medium">Edit Profile</Dialog.Title>
                    </div>


                    <div className="px-8 md:px-14 overflow-y-scroll">

                        <div className='px-0 md:px-10 pb-16 pt-12 flex flex-col items-center justify-center'>
                            <img className="inline-block size-16 md:size-20 rounded-full border border-gray-500 object-cover" src={profileImage} alt={user.username} />
                            <div {...getRootProps()}>
                                <input {...getInputProps()} />
                                <button onClick={open} className='mt-3 md:mt-5 text-color1 cursor-pointer'>Change profile picture</button>
                            </div>

                            <form className='mt-4 md:mt-7 md:w-80' onSubmit={handleSubmit(onUpdateUserProfile)}>
                                <div className='mb-4'>
                                    <label className='max-sm:text-xs' htmlFor="username">Username</label>
                                    <input {...register('username')} className='border border-text-color-4 w-full p-2 rounded-md outline-none max-sm:h-8 text-text-color-1' defaultValue={user.username} />
                                    {errors.username && <span className="text-sm text-red-600">{errors.username?.message}</span>}
                                </div>

                                <div className='mb-4'>
                                    <label className='max-sm:text-xs' htmlFor="email">E mail</label>
                                    <input {...register('email')} className='border border-text-color-4 w-full p-2 rounded-md outline-none max-sm:h-8 text-text-color-1' defaultValue={user.email} />
                                    {errors.email && <span className="text-sm text-red-600">{errors.email?.message}</span>}
                                </div>

                                {errors.root && <span className="text-sm text-red-600 mb-2">{errors.root?.message}</span>}
                                <button disabled={profileUpdateMutation.isPending} className='btn-primary w-full flex justify-center mt-5 disabled:bg-color2' type="submit">{profileUpdateMutation.isPending ? "Submiting..." : "Submit"}</button>
                            </form>
                        </div>

                    </div>


                    <Dialog.Close asChild>
                        <button onClick={() => setProfileImage(user.profileImage)} className="IconButton size-8 inline-flex items-center justify-center absolute top-2 sm:top-4 right-4" aria-label="Close">
                            <IoCloseCircleOutline className='text-3xl' />
                        </button>
                    </Dialog.Close>


                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    )
};

export default EditProfileModal;