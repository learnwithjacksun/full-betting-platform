import { v2 as cloudinary } from "cloudinary";
import envFile from "../config/env.js";


cloudinary.config({
  cloud_name: envFile.CLOUDINARY_CLOUD_NAME,
  api_key: envFile.CLOUDINARY_API_KEY,
  api_secret: envFile.CLOUDINARY_API_SECRET,
});


const uploadImage = async (file) => {
  try {
    const result = await cloudinary.uploader.upload(file, {
      resource_type: "image",
      folder: "allstakes-images",
      use_filename: true,
      unique_filename: false,
      overwrite: true,
    });

    return {
      imageUrl: result.secure_url,
      publicIdImage: result.public_id,
    };
  } catch (error) {
    throw new Error(error.message || "Failed to upload image");
  }
};


const deleteImage = async (publicIdImage) => {
  const imageDelete = await cloudinary.uploader.destroy(publicIdImage);

  return {
    imageDelete,
  };
};


  export { uploadImage, deleteImage };
