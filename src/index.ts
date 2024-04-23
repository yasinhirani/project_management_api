import { app } from "./app";
import dotenv from "dotenv";
// import connectDB from "./db/db";
import { v2 as cloudinary } from "cloudinary";

dotenv.config({
  path: "./.env.local",
});

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

app.listen(process.env.PORT, () => {
  console.log(`Server listening on port ${process.env.PORT}`);
});

// connectDB()
//   .then(() => {
//     app.listen(process.env.PORT, () => {
//       console.log(`Server listening on port ${process.env.PORT}`);
//     });
//   })
//   .catch((err: any) => {
//     console.log(err.message);
//     process.exit(1);
//   });
