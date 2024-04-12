import { v2 as cloudinary } from "cloudinary";
import ApiError from "./apiError";

const deleteFiles = async (file: string) => {
  try {
    const res = await cloudinary.uploader
      .destroy(file, { resource_type: "raw" })

    if(res.result !== "ok"){
      throw new Error(`There was an issue deleting the ${file.split("/")[0]}, please try again later`);
    }
  } catch (error: any) {
    throw new ApiError(error.message, 400);
  }
};

export default deleteFiles;
