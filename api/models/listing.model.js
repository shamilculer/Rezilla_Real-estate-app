import mongoose from "mongoose";

const listingSchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        cityname: {
            type: String,
            required: true
        },
        type: {
            type: String,
            required: true
        },
        address: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        images: {
            type: [String],
            required: true
        },
        description: {
            type: String,
            required: true
        },
        bedrooms: {
            type: Number,
            required: true
        },
        totalSize: {
            type: Number,
            required: true
        },
        bathrooms: {
            type: Number,
            required: true
        },
        lat: {
            type: Number,
            required: true
        },
        long: {
            type: Number,
            required: true
        },
        amenities: {
            type: [String],
            required: true
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    },

    {
        timestamps: true
    }

)


const Listing = mongoose.model('Listing', listingSchema)

export default Listing