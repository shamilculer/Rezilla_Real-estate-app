import { logo } from "../assets";
import { FaRegCircleUser, FaHeart, FaEnvelope } from "react-icons/fa6";
import { Link } from "react-router-dom"
import { IoIosLogIn, IoMdAddCircleOutline } from "react-icons/io";
import { CiBoxList } from "react-icons/ci";
import useGlobalStateStore from "../store/store";
import SidebarMenu from "./SidebarMenu";

const Header = () => {

    const user = useGlobalStateStore((state) => state.user)

    return (
        <header className="bg-white fixed top-0 w-full z-[1001] border-b border-b-gray-300">
            <div className="w-full sticky top-0">
                <div style={{minHeight : "0"}} className="container">
                    <div className="w-full h-16 sm:h-20 flex items-center justify-between">
                        <div >
                            <Link to="/" className="flex items-center gap-2 justify-center max-lg:justify-start">
                                <img src={logo} alt="Rezilla" className="w-9 sm:w-12" />
                                <span className="text-[#1E1E1E] sm:text-lg font-semibold">Rezilla</span>
                            </Link>
                        </div>


                        {!user ? (
                            <div className="sm:w-2/3">
                                <div className="hidden sm:block" >
                                    <div className="flex items-center gap-x-6 justify-end">
                                        <Link to="/listing" className="py-1 px-3 rounded-[30px] font-medium text-sm flex items-center gap-x-2"><CiBoxList className="text-lg" />View Listing</Link>
                                        <Link to="/login" className="font-semibold text-sm flex items-center gap-x-2"><FaRegCircleUser className="text-base" /> Login</Link>
                                        <Link className="btn-primary" to="/register"  ><IoIosLogIn className="text-lg" /> Sign Up</Link>
                                    </div>
                                </div>
                                <div className="sm:hidden" >
                                    <SidebarMenu />
                                </div>
                            </div>


                        ) : (
                            <div className="lg:w-2/3" >
                                <div className="hidden lg:block">
                                    <div className="flex items-center gap-x-4 xl:gap-x-6 justify-end">
                                        <Link to="/listing" className="rounded-[30px] font-medium text-xs xl:text-sm flex items-center gap-x-2"><CiBoxList className="text-lg" />View Listing</Link>
                                        <Link to="/inbox" className="text-xs xl:text-sm flex items-center gap-x-2 font-medium"><FaEnvelope className="text-base" />View Messages</Link>
                                        <Link to="/wishlist" className="text-xs xl:text-sm flex items-center gap-x-2 font-medium"><FaHeart className="text-base" /> View Wishlist</Link>
                                        <Link className="btn-primary" to="/listing/new" ><IoMdAddCircleOutline className="text-lg" /> Add Listing</Link>
                                        <Link to="/profile">
                                            <img className="inline-block size-[46px] rounded-full border border-gray-500 object-cover" src={user.profileImage} alt={user.username} />
                                        </Link>
                                    </div>
                                </div>
                                <div className="lg:hidden" >
                                    <SidebarMenu />
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            </div>


        </header>
    )
}


export default Header