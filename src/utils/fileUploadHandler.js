// import { fileTypeFromBuffer } from "file-type";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

/**
 * Function to convert base64 content to original file and upload the file to cloudinary
 * @param {*} file The details of the file with base64 content
 * @param {*} next Function used to throw error to express while uploading file
 * @returns Details of uploaded file with original name and its url
 */
const handleFileUpload = async (file, next) => {
  const fileNameWithPath = `public/temp/${
    file.originalName
  }-${new Date().getTime()}.${file.extension}`;
  try {
    // Converting base64 file to buffer
    // const fileBuffer = Buffer.from(file.data, "base64");

    // Getting file type from buffer
    // const fileType = await fileTypeFromBuffer(fileBuffer);

    // Storing the file temporary on the server
    await fs.promises.writeFile(fileNameWithPath, file.data, "base64");

    // Uploading the file to cloudinary
    const result = await cloudinary.uploader.upload(fileNameWithPath, {
      public_id: `${fileNameWithPath.split("/")[2]}`,
      resource_type: "raw",
      folder: "client"
    });

    // Deleting the file from our server once uploaded to cloudinary
    await fs.promises.unlink(fileNameWithPath);

    // Returning the details of uploaded file
    return {
      fileName: file.originalName,
      public_id: result.public_id,
      url: result.secure_url,
    };
  } catch (error) {
    // Catching errors, if any and if error, deleting the file from the server
    fs.unlinkSync(fileNameWithPath);

    // Throwing error to express
    next(error);
  }
};

export default handleFileUpload;
