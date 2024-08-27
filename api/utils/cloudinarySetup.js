import { v2 as cloudinary } from "cloudinary"
import dotenv from "dotenv"

dotenv.config()

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

  const uploadImages = async (newListingImages) => {
    try {
      const uploadedImages = await Promise.all(newListingImages.map(async (imgFile) => {
        const b64 = Buffer.from(imgFile.buffer).toString("base64");
        const dataURI = "data:" + imgFile.mimetype + ";base64," + b64;

        const cloudinaryRes = await cloudinary.uploader.upload(dataURI, {
          resource_type : "image"
        }); 
        
        return cloudinaryRes.secure_url; 
      }));

      return uploadedImages
    } catch (error) {
      console.log(error)
      return Promise.reject(error)
    }

  }

export default uploadImages