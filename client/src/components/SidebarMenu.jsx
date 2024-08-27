import * as Dialog from "@radix-ui/react-dialog"
import { IoCloseCircleOutline } from "react-icons/io5";
import { logo } from "../assets";
import { IoIosMenu, IoIosLogIn, IoMdAddCircleOutline } from "react-icons/io";
import { FaRegCircleUser, FaHeart, FaEnvelope } from "react-icons/fa6";
import { Link } from "react-router-dom"
import { CiBoxList } from "react-icons/ci";
import useGlobalStateStore from "../store/store";


const SidebarMenu = () => {

    const user = useGlobalStateStore((state) => state.user)

    return (
        <Dialog.Root>
            <Dialog.Trigger asChild>
                <button><IoIosMenu className="text-3xl" /></button>
            </Dialog.Trigger>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-[rgba(0,0,0,.3)] z-[40000] animate-opacity" />
                <Dialog.Content className="bg-white fixed top-0 left-0 w-[80vw] max-w-[500px] z-[50000] animate-slideRight focus:outline-none min-h-screen flex flex-col">

                    <div className='p-3 border-b'>
                        <Dialog.Title>
                            <Link to="/" className="flex items-center gap-2">
                                <img src={logo} alt="Rezilla" className="w-9" />
                                <span className="text-[#1E1E1E] text-base font-semibold">Rezilla</span>
                            </Link>
                        </Dialog.Title>
                    </div>


                    <div className="px-6 mt-7" >

                        {!user ? (
                            <div className="flex flex-col gap-7 justify-between">
                                <Link to="/listing" className="font-medium flex items-center gap-x-2"><CiBoxList className="text-lg" />View Listing</Link>
                                <Link to="/login" className="font-semibold flex items-center gap-x-2"><FaRegCircleUser className="text-base" /> Login</Link>
                                <Link className="btn-primary" to="/register"  ><IoIosLogIn className="text-lg" /> Sign Up</Link>
                            </div>


                        ) : (
                                <div className="flex flex-col gap-7 justify-between">
                                    <Link to="/listing" className="font-medium flex items-center gap-x-2"><CiBoxList className="text-lg" />View Listing</Link>
                                    <Link to="/inbox" className="flex items-center gap-x-2 font-medium"><FaEnvelope className="text-base" /> View Messages</Link>
                                    <Link to="/wishlist" className="flex items-center gap-x-2 font-medium"><FaHeart className="text-base" /> View Wishlist</Link>
                                    <Link className="flex items-center gap-x-2 font-medium" to="/listing/new" ><IoMdAddCircleOutline className="text-base" /> Add Listing</Link>

                                    <Link to="/profile" className="font-medium flex items-center gap-x-3">
                                        <img className="inline-block size-8 rounded-full border border-gray-500" src={user.profileImage} alt={user.username} />
                                        Profile
                                    </Link>
                            </div>
                        )}

                    </div>

                    <div>

                    </div>


                    <Dialog.Close asChild>
                        <button className="IconButton h-8 w-8 inline-flex items-center justify-center absolute top-4 right-4" aria-label="Close">
                            <IoCloseCircleOutline className='text-3xl' />
                        </button>
                    </Dialog.Close>


                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    )
}

export default SidebarMenu