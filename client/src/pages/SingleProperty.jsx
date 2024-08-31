import { useParams } from "react-router-dom"
import { format } from "timeago.js"
import { ErrorComponent, ImageSlider, Loader } from "../components"
import { FaBath, FaBed } from "react-icons/fa6"
import { LuParkingCircle } from "react-icons/lu";
import { MdLocationPin, MdOutlineFireplace, MdOutlineOutdoorGrill, MdOutlinePool, MdOutlinePets } from "react-icons/md";
import { TbAirConditioning } from "react-icons/tb";
import { RiHomeOfficeLine, RiAlarmWarningLine } from "react-icons/ri";
import { FaRegHeart, FaRulerCombined } from "react-icons/fa";
import { Map } from "../components"
import clsx from "clsx";
import DOMPurify from "dompurify"
import { useEffect, useState } from "react";
import useGlobalStateStore from "../store/store";
import { useNavigate } from "react-router-dom";

import { useMutation, useQuery } from "@tanstack/react-query";
import { deleteLilsting, fetchListing } from "../utils/api/listingsApi";
import { updateUser } from "../utils/api/userApi";
import { toast } from "react-toastify";
import { findOrCreateChat } from "../utils/api/inboxApi";
import queryClient from "../lib/queryClient";


const SingleProperty = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, setUser } = useGlobalStateStore((state) => ({
    user: state.user,
    setUser: state.setUser
  }))
  const [onWishlist, setOnWishlist] = useState(null)

  const { data: listing, isLoading, isError, error, isSuccess, refetch } = useQuery({
    queryKey: ["listing", id],
    queryFn: fetchListing,
  })

  if (isError && error?.status === 404) {
    if (error?.status === 404) {
      window.location = "/404"
      return
    }
  }

  useEffect(() => {
    if (isSuccess && user && listing) {
      const isOnWishlist = user.wishlist?.some(wishlistItem => wishlistItem._id === listing._id);
      setOnWishlist(isOnWishlist);
    }
  }, [isSuccess, user, listing]);


  const userUpdateMutation = useMutation({
    mutationFn: () => updateUser(user),
    onSuccess: (user) => {
      setUser(user)
      setOnWishlist(!onWishlist)
    },
    onError: (error) => {
      console.log(error)
      toast.error("Error updating the wishlist")
    }
  })

  const findChatMutation = useMutation({
    mutationFn: ({ user, listingUser }) => findOrCreateChat({
      user,
      listingUser
    }),
    onSuccess: (chatId) => {
      toast.success("Wishlist updated successfully")
      navigate(`/inbox?chat=${chatId}`)
    },
    onError: (error) => {
      toast.error("Error finding or creating chat")
    }
  })

  const deleteListingMutations = useMutation({
    mutationFn : (listingId) => deleteLilsting(listingId),
    onSuccess : (response) => {
      if(response === 200){
        queryClient.invalidateQueries(["useruserListings"])
        navigate(-1)
      }
    },
    onError : (error) => {
      toast.error("Failed to delete listing")
    }
  })

  const handleWishlistChange = async () => {

    if (!user) {
      navigate('/login')
      return
    } else {

      if (onWishlist) {
        user.wishlist = user.wishlist.filter(item => item._id !== listing._id)
      } else {
        user.wishlist.push(listing._id)
      }

    }

    userUpdateMutation.mutate(user)
  }


  const handleContactOwner = async () => {
    if (!user) {
      navigate('/login')
      return
    }

    findChatMutation.mutate({
      user: user._id,
      listingUser: listing?.user?._id
    })
  }


  if (isLoading) return <Loader />
  if(isError && error?.status !== 404) return <ErrorComponent retryFn={refetch} />

  return (
    <section className="mt-12 sm:mt-20">
      <div className="container">
        <div className="py-9">
          <div className="flex max-md:flex-col gap-4 xl:gap-10">

            <div className="w-full md:w-[62%] lg:w-4/6">
              <ImageSlider images={listing?.images} />

              <div className="mt-0 sm:mt-4 lg:mt-9 py-5 border-b">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-medium">{listing.title}</h1>
                <div className="flex max-sm:flex-col-reverse sm:items-center gap-4 sm:gap-7 mt-2 sm:mt-3">
                  <span className="text-text-color-3 flex items-center"><MdLocationPin className="text-lg" /> {listing.address}</span>

                  <span className="text-text-color-3 max-sm:text-xs">Listed {format(listing.createdAt)}</span>
                </div>

                <div className="sm:hidden flex items-center mt-4 gap-2 flex-wrap">

                  <div className="flex items-center gap-x-1 bg-gray-200 p-1 rounded min-w-max">
                    <FaBed className="text-text-color-1 text-sm" />
                    <span className="text-text-color-1 text-xs">{listing.bedrooms} Bedrooms</span>
                  </div>
                  <div className="flex items-center gap-x-1 bg-gray-200 p-1 rounded min-w-max">
                    <FaBath className="text-text-color-1 text-sm" />
                    <span className="text-text-color-1 text-xs">{listing.bathrooms} Bathrooms</span>
                  </div>
                  <div className="flex items-center gap-x-1 bg-gray-200 p-1 rounded min-w-max">
                    <FaRulerCombined className="text-text-color-1 text-sm" />
                    <span className="text-text-color-1 text-xs">{listing.totalSize} sqft</span>
                  </div>

                </div>
              </div>



              <div className="py-5 border-b">
                <h3 className="font-medium text-base sm:text-xl mb-3">Listed By</h3>
                <div className="flex items-center gap-5 pl-5">
                  <div className="size-12 sm:size-20 border flex items-center justify-center rounded-full overflow-hidden">
                    <img src={listing.user?.profileImage} alt={listing.user?.username} className="w-full" />
                  </div>
                  <div>
                    <h4 className="text-lg sm:text-xl">{listing.user?.username}</h4>
                    <span className="text-xs sm:text-sm text-text-color-3 ">Total {listing?.user?.listingsCount} properties listed.</span>
                  </div>
                </div>
              </div>


              <div className="py-5 border-b">
                <h3 className="font-medium text-base sm:text-xl mb-3">About This Place</h3>
                <p className="desc text-xs lg:text-base text-text-color-3" dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(listing.description),
                }}></p>
              </div>

              <div className="pt-5 pb-3">
                <h3 className="font-medium text-base sm:text-xl mb-4">Amenities</h3>
                <div className="sm:pl-5 grid grid-cols-2 gap-5">
                  <span className={`flex items-center gap-3 text-sm md:text-lg ${!listing.amenities?.includes('parking') ? "line-through text-gray-400" : ""}`}><LuParkingCircle className="text-lg sm:text-2xl" /> Garage/Parking </span>
                  <span className={`flex items-center gap-3 text-sm md:text-lg ${!listing.amenities?.includes('outdoor-space') ? "line-through text-gray-400" : ""}`}><MdOutlineOutdoorGrill className="text-lg sm:text-2xl" /> Yard/Outdoor Space </span>
                  <span className={`flex items-center gap-3 text-sm md:text-lg ${!listing.amenities?.includes('pool') ? "line-through text-gray-400" : ""}`}><MdOutlinePool className="text-lg sm:text-2xl" /> Pool </span>
                  <span className={`flex items-center gap-3 text-sm md:text-lg ${!listing.amenities?.includes('fireplace') ? "line-through text-gray-400" : ""}`}><MdOutlineFireplace className="text-lg sm:text-2xl" /> Fireplace </span>
                  <span className={`flex items-center gap-3 text-sm md:text-lg ${!listing.amenities?.includes('heating-cooling') ? "line-through text-gray-400" : ""}`}><TbAirConditioning className="text-lg sm:text-2xl" /> Heating/cooling system </span>
                  <span className={`flex items-center gap-3 text-sm md:text-lg ${!listing.amenities?.includes('pet-friendly') ? "line-through text-gray-400" : ""}`}><MdOutlinePets className="text-lg sm:text-2xl" /> Pet-friendly </span>
                  <span className={`flex items-center gap-3 text-sm md:text-lg ${!listing.amenities?.includes('office-space') ? "line-through text-gray-400" : ""}`}><RiHomeOfficeLine className="text-lg sm:text-2xl" /> Home office/study space</span>
                  <span className={`flex items-center gap-3 text-sm md:text-lg ${!listing.amenities?.includes('alarm-system') ? "line-through text-gray-400" : ""}`}><RiAlarmWarningLine className="text-lg sm:text-2xl" /> Smoke alarm </span>
                </div>
              </div>


            </div>

            <div className="w-full md:w-[38%] lg:w-2/6">
              <div className="w-full rounded-lg bg-[#2739ff0d] p-3 xl:p-5">
                <Map listings={[listing]} />
                <div className="mt-7 px-0">
                  <div className="hidden sm:flex items-center gap-2 flex-wrap">

                    <div className="flex items-center gap-x-1 bg-gray-200 p-1 rounded min-w-max">
                      <FaBed className="text-text-color-1 text-md" />
                      <span className="text-text-color-1 text-sm">{listing.bedrooms} Bedrooms</span>
                    </div>
                    <div className="flex items-center gap-x-1 bg-gray-200 p-1 rounded min-w-max">
                      <FaBath className="text-text-color-1 text-md" />
                      <span className="text-text-color-1 text-sm">{listing.bathrooms} Bathrooms</span>
                    </div>
                    <div className="flex items-center gap-x-1 bg-gray-200 p-1 rounded min-w-max">
                      <FaRulerCombined className="text-text-color-1 text-md" />
                      <span className="text-text-color-1 text-sm">{listing.totalSize} sqft</span>
                    </div>

                  </div>
                  <h5 className="mt-7 font-semibold text-3xl text-color1" >$ {listing.price}
                    {listing && listing.type === "rent" ? (

                      <span>/<span className="text-sm font-medium text-text-color-3" >Month</span></span>

                    ) : (
                      ""
                    )}

                  </h5>
                  <div className="mt-7 flex items-center justify-between flex-wrap gap-4">
                    {user?._id !== listing?.user?._id ? (
                      <>
                        <button
                          onClick={handleWishlistChange}
                          disabled={userUpdateMutation.isPending}
                          className={clsx(
                            "flex justify-center py-2 px-3 items-center gap-x-1 text-sm rounded-3xl hover:bg-red-600 hover:text-white ring-1 max-xl:w-full disabled:bg-gray-300 disabled:text-white",
                            onWishlist ? "bg-red-600 text-white" : "bg-white text-black"
                          )}
                        >
                          <FaRegHeart className="text-xl" />
                          {onWishlist ? "Remove from wishlist" : "Save to wishlist"}
                        </button>

                        <button onClick={handleContactOwner} className="btn-primary min-w-max max-xl:w-full">
                          Contact Owner
                        </button>
                      </>
                    ) : (
                      <button onClick={() => deleteListingMutations.mutate(listing._id)} className="bg-red-600 py-2 px-6 rounded-lg text-white font-medium">Delete listing</button>
                    )}

                  </div>
                </div>
              </div>
            </div>


            <div className="md:hidden fixed bottom-0 left-0 bg-white w-full p-4 border-t border-gray-300 z-[100000]">

              <div className="flex items-center gap-5 justify-between">

                <h5 className="font-semibold text-2xl text-color1" >$ {listing.price}
                  {listing && listing.type === "rent" ? (

                    <span>/<span className="text-sm font-medium text-text-color-3" >Month</span></span>

                  ) : (
                    ""
                  )}

                </h5>

                <button className="btn-primary min-w-max">Contact Owner</button>

              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default SingleProperty