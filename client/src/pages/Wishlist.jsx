import { PropertyCardList } from "../components"
import { FaTrash } from "react-icons/fa6"
import { Link } from "react-router-dom"
import useGlobalStateStore from "../store/store"
import { useMutation } from "@tanstack/react-query"
import { clearUserWishlist } from "../utils/api/userApi"
import { toast } from "react-toastify"

const Wishlist = () => {
    const { user, setUser } = useGlobalStateStore((state) => ({
        user: state.user,
        setUser: state.setUser
    }))

    const clarWishlistMutation = useMutation({
        mutationFn: (user) => clearUserWishlist(user),
        onSuccess: (updateduser) => {
            setUser(updateduser)
            toast.success("Cleared wishlist successfuly")
        },
        onError: (error) => {
            console.log(error)
            toast.error("Failed to clear wishlist!")
        }
    })

    const clearWishlist = () => {
        clarWishlistMutation.mutate(user)
    }


    return (
        <section className="mt-14 md:mt-20">
            <div className="container">
                <div className="py-12">
                    <div className="pb-5 border-b flex max-md:flex-col max-md:gap-8 justify-between items-center">
                        <h2 className="font-medium">My Wishlist</h2>

                    </div>
                    {user?.wishlist.length > 0 && (
                        <div className="flex items-center gap-5 w-full justify-end mt-6">
                            {user?.wishlist.length > 0 &&
                                <button onClick={clearWishlist} className="flex items-center gap-2 underline p-1 rounded hover:bg-red-500 hover:text-white transition-all max-sm:text-sm"><FaTrash /> Clear Wishlist</button>}

                            <Link to="/listing" className="btn-primary">View More Properties</Link>
                        </div>
                    )}

                    {user?.wishlist?.length < 1 ? (
                        <div className="h-72 w-full flex flex-col items-center justify-center gap-5">
                            <h3 className="text-center">Your wishlist is empty</h3>
                            <Link to="/listing" className="btn-primary">View More Properties</Link>
                        </div>
                    ) : (
                        <PropertyCardList listings={user.wishlist} />
                    )}
                </div>
            </div>
        </section>
    )
}

export default Wishlist