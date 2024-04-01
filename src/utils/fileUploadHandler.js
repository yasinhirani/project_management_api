import { fileTypeFromBuffer } from "file-type";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

const handleFileUpload = async (file, next) => {
  try {
    const fileBuffer = Buffer.from(file.data, "base64");
    const fileType = await fileTypeFromBuffer(fileBuffer);
    if (fileType.ext) {
      await fs.promises.writeFile(
        `public/temp/${file.originalName}-${new Date().getDate()}.${
          fileType.ext
        }`,
        fileBuffer
      );
      const result = await cloudinary.uploader.upload(
        `public/temp/${file.originalName}-${new Date().getDate()}.${
          fileType.ext
        }`,
        {
          public_id: `${file.originalName}-${new Date().getDate()}.${
            fileType.ext
          }`,
          resource_type: "auto",
        }
      );
      await fs.promises.unlink(
        `public/temp/${file.originalName}-${new Date().getDate()}.${
          fileType.ext
        }`
      );
      return {
        fileName: file.originalName,
        url: result.url,
      };
    }
  } catch (error) {
    fs.unlinkSync(
      `public/temp/${file.originalName}-${new Date().getDate()}.${fileType.ext}`
    );
    next(error);
  }
};

export default handleFileUpload;
