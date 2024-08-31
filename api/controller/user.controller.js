import User from "../models/user.model.js"
import Listing from "../models/listing.model.js"
import bcrypt from "bcrypt"
import uploadImages from "../utils/cloudinarySetup.js";

const updateUser = async (req, res) => {
    const { id } = req.params;
    const { password, confirmedPassword, _id, ...rest } = req.body;
    const newProfileImage = req.file
    try {
        // Check if the user is authorized to update
        if (id !== _id) {
            return res.status(403).json({ message: "Not authorized" });
        }

        // Check if the user with the new email already exists
        const doesUserExist = await User.exists({ email : rest.email });

        if (doesUserExist && doesUserExist._id.toString() !== id) {
            return res.status(409).json({ message: "User with the same email address already exists" });
        }

        // Prepare the update object
        const updateData = { ...rest };
        if (password && password === confirmedPassword) {
            updateData.password = bcrypt.hashSync(password, 10);
        }

        if(newProfileImage){
            const uploadedProfileImage = await uploadImages([newProfileImage])
            updateData.profileImage = uploadedProfileImage[0]
        }

        // Update user info
        const updatedUserInfo = await User.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true }
        ).populate('wishlist');

        if (!updatedUserInfo) {
            return res.status(404).json({ message: "User not found" });
        }

        // Exclude password from the response
        const { password: _, ...updatedUser } = updatedUserInfo._doc;
        res.status(200).json({ message: "User updated successfully", updatedUser });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Failed to update user" });
    }
};

const getUserListings = async(req, res) => {

    const { id } = req.params
    try {
        const doesUserExist = User.exists({_id : id})

        if(!doesUserExist){
            return res.status(404).json({ message : "User not found" })
        }
        
        const userListings = await Listing.find({ user : id})
        res.status(200).json({ message : "User listings found successfully", userListings })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message : "Failed to fetch user listings" })
    }
}



export {updateUser, getUserListings}