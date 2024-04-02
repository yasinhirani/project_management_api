import { fileTypeFromBuffer } from "file-type";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

/**
 * Function to convert base64 content to original file and upload the file to cloudinary
 * @param {*} file The details of the file with base64 content
 * @param {*} next Function used to throw error to express while uploading file
 * @returns Details of uploaded file with original name and its url
 */
const handleFileUpload = async (file, next) => {
  try {
    // Converting base64 file to buffer
    const fileBuffer = Buffer.from(file.data, "base64");

    // Getting file type from buffer
    const fileType = await fileTypeFromBuffer(fileBuffer);

    // Storing the file temporary on our server
    await fs.promises.writeFile(
      `public/temp/${file.originalName}-${new Date().getDate()}.${
        file.extension
      }`,
      fileBuffer
    );

    // Uploading the file to cloudinary
    const result = await cloudinary.uploader.upload(
      `public/temp/${file.originalName}-${new Date().getDate()}.${
        file.extension
      }`,
      {
        public_id: `${file.originalName}-${new Date().getDate()}.${
          file.extension
        }`,
        resource_type: "auto",
      }
    );

    // Deleting the file from our server once uploaded to cloudinary
    await fs.promises.unlink(
      `public/temp/${file.originalName}-${new Date().getDate()}.${file.extension}`
    );

    // Returning the details of uploaded file
    return {
      fileName: file.originalName,
      url: result.url,
    };
  } catch (error) {
    // Catching errors, if any and if error deleting the file from our server
    fs.unlinkSync(
      `public/temp/${file.originalName}-${new Date().getDate()}.${file.extension}`
    );

    // Throwing error to express
    next(error);
  }
};

export default handleFileUpload;
