import api from "../../lib/api";

const fetchUserListings = async ({ queryKey }) => {
    const userId = queryKey[1]
    try {
        const response = await api.get(`/user/listings/${userId}`)
        return response.data?.userListings
    } catch (error) {
        throw error?.response
    }
}

const clearUserWishlist = async (user) => {
    user.wishlist = []
    try {
        const response = await api.put(`/user/update/${user._id}`, user)
        return response.data.updatedUser
    } catch (error) {
        throw error
    }
}

const updateUser = async (user) => {
    try {
        const response = await api.put(`/user/update/${user._id}`, user, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        return response.data.updatedUser
    } catch (error) {
        throw error
    }
}


export { fetchUserListings, clearUserWishlist, updateUser }