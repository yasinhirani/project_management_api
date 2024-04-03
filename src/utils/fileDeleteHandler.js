import { v2 as cloudinary } from "cloudinary";
import ApiError from "./apiError.js";

const deleteFiles = async (file, next) => {
  try {
    const res = await cloudinary.uploader
      .destroy(file.public_id, { resource_type: "raw" })

    if(res.result !== "ok"){
      throw new Error("There was an issue deleting the client, please try again later");
    }
  } catch (error) {
    throw new ApiError(error.message);
  }
};

export default deleteFiles;
