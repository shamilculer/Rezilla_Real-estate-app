import { Link } from "react-router-dom"
import { FaBed, FaBath, FaHeart } from "react-icons/fa6";
import { MdLocationPin } from "react-icons/md";
import useGlobalStateStore from "../store/store";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { updateUser } from "../utils/api/userApi";
import { toast } from "react-toastify";

const PropertyCardList = ({listings}) => {
  const navigate = useNavigate()
  const {user, setUser} = useGlobalStateStore((state) => ({
    user : state.user,
    setUser : state.setUser
  }))

  const userUpdateMutation = useMutation({
    mutationFn: () => updateUser(user),
    onSuccess: (user) => {
      setUser(user)
      toast.success("Wishlist updated successfully")
    },
    onError: (error) => {
      toast.error("Error updating the wishlist")
    }
  })

  const handleWishlist = (listing) => {
    
    if(!user){
      navigate('/login')
      return
    } else {

      let isOnWishlist = user.wishlist.some(item => item._id === listing._id);

      if(isOnWishlist){
        user.wishlist = user.wishlist.filter(item => item._id !== listing._id)
      }else{
        user.wishlist.push(listing)
      }

    }   

    userUpdateMutation.mutate(user)
  }


  return ( 
    
      <div className={`py-7 grid gap-y-12 gap-x-8 lg:gap-x-12 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-auto-fit-card`}  >
        {listings?.map(listing => (
          
          <div className="flex max-xl:flex-col gap-y-2 relative max-w-[626px]" key={listing._id} >
            <Link to={`/listing/${listing._id}`} >
              <div className="min-h-60 sm:min-h-72 lg:min-h-[200px] w-full lg:w-[280px] rounded-xl bg-center bg-cover bg-no-repeat" style={{backgroundImage : `url(${listing.images[0]})`}} ></div>
            </Link>  
      
            <Link to={`/listing/${listing._id}`} className="p-2 sm:p-4 w-full xl:w-[calc(100%-280px)] flex flex-col justify-between" >
              <div>
              <h3 className="font-medium capitalize text-lg overflow-hidden line-clamp-2" style={{display : "-webkit-box", WebkitBoxOrient : "vertical"}}>{listing.title}</h3>

              <h5 className="text-sm text-text-color-3 flex items-center"><MdLocationPin className="text-lg" /> {listing.address}</h5>

              <h5 className="mt-4 font-semibold text-[22px] text-color1" >$ {listing.price}
                      {listing && listing.type === "rent" ? (

                        <span>/<span className="text-sm font-medium text-text-color-3" >Month</span></span>

                      ) : (
                        ""
                      )}</h5>   
                
              <div className="mt-4 flex items-center gap-x-5 w-full ">
                <div className="flex items-center gap-x-2 bg-gray-200 p-1 rounded">
                  <FaBed className="text-text-color-1 text-xl" />
                  <span className="text-text-color-1 text-xs">{listing.bedrooms} Bedrooms</span>
                </div>
                <div className="flex items-center gap-x-2 bg-gray-200 p-1 rounded">
                  <FaBath className="text-text-color-1 text-xl" />
                  <span className="text-text-color-1 text-xs">{listing.bathrooms} Bathrooms</span>
                </div>
              </div>
              </div>
              </Link>

              <button className="absolute right-4 bottom-3 sm:bottom-5" onClick={() => handleWishlist(listing)}>
                <svg xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns="http://www.w3.org/2000/svg" height="24" width="24" version="1.1" xmlns:cc="http://creativecommons.org/ns#" xmlns:dc="http://purl.org/dc/elements/1.1/">
                <g transform="translate(0 -1028.4)">
                  <path d="m7 1031.4c-1.5355 0-3.0784 0.5-4.25 1.7-2.3431 2.4-2.2788 6.1 0 8.5l9.25 9.8 9.25-9.8c2.279-2.4 2.343-6.1 0-8.5-2.343-2.3-6.157-2.3-8.5 0l-0.75 0.8-0.75-0.8c-1.172-1.2-2.7145-1.7-4.25-1.7z" stroke="#b5b5b5" strokeWidth="2" fill={user?.wishlist.some(item => item._id === listing._id) ? '#ff0019' : "#474747"}></path>
                </g>
                </svg>
                </button>
          </div>
        ))}  
      </div>
    
  )
}

export default PropertyCardList