import mongoose from "mongoose";

const userSchema = mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        profileImage: {
            type: String,
        },
        wishlist: {
            type: [mongoose.Schema.Types.ObjectId],
            ref: "Listing"
        },
        listingsCount : {
            type: Number,
            default: 0
        }
    },

    {
        timestamps: true
    })

const User = mongoose.model('User', userSchema)

export default User