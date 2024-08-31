import {
    PropertyCardList,
    LoadingSkelton,
    EditProfileModal,
    LogoutAlertModal,
    UpdatePasswordModal,
    ErrorComponent
} from "../components";
import useGlobalStateStore from "../store/store";
import { useQuery } from "@tanstack/react-query";
import { fetchUserListings } from "../utils/api/userApi";
import { Link } from "react-router-dom";

const Profile = () => {

    const user = useGlobalStateStore((state) => state.user)

    const { data: userListings, isLoading, isError, error, isSuccess, refetch } = useQuery({
        queryKey: ["userListings", user._id],
        queryFn: fetchUserListings
    })

    return (
        <section className="mt-12 md:mt-20">
            <div className="container py-12 min-h-[80vh]">
                <div className="w-full">
                    <div className="w-full">
                        <div className="flex flex-col items-center gap-8 pb-12 border-b">
                            <div className="flex flex-col items-center gap-6">
                                <img className="inline-block size-20 sm:size-28 rounded-full border object-cover border-gray-500" src={user.profileImage} alt={user.username} />

                                <div className="text-center">
                                    <h4 className="font-medium text-3xl">{user.username}</h4>
                                    <h6 className="mt-3">{user.email}</h6>
                                </div>

                            </div>

                            <div className="flex max-sm:flex-wrap max-sm:justify-center items-center gap-8">
                                <EditProfileModal />
                                <UpdatePasswordModal />
                                <LogoutAlertModal />
                            </div>
                        </div>

                        <div className="flex max-xl:flex-col-reverse gap-4 xl:gap-16">
                            <div className="w-full xl:w-3/5 py-12">
                                <h3 className="font-medium">My Listings</h3>

                                {isLoading && (
                                    <div className="py-5">
                                        <LoadingSkelton count={8} />
                                    </div>
                                )}

                                {isError && <ErrorComponent retryFn={refetch} />}

                                {isSuccess && userListings.length > 0 ? (
                                    <PropertyCardList listings={userListings} />
                                ): (
                                    <div className="w-full h-[40vh] flex flex-col gap-4 items-center justify-center">
                                        <h4 className="text-center">No listings found</h4>
                                        <Link to="/listing/new" className="btn-primary">Add Listings</Link>
                                    </div>
                                )}

                            </div>
                            <div className="w-full xl:w-2/5 bg-[#f4f4f4] rounded-md py-12 px-8">
                                <h3 className="font-medium">New Messages</h3>
                                <div className="mt-6 flex flex-col gap-2">
                                    {/* <div className="bg-white p-3 rounded-lg">
                                        <div className="flex items-center gap-2">
                                            <img className="size-6 sm:size-8 rounded-full" src="https://via.placeholder.com/30" alt="user" />
                                            <h5 className="font-medium">John Doe</h5>
                                        </div>
                                        <p className="text-sm mt-1">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                                    </div> */}
                                    
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Profile