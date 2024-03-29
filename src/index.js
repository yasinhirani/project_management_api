import { app } from "./app.js";
import dotenv from "dotenv";
import connectDB from "./db/db.js";

dotenv.config({
  path: "./.env.local",
});

connectDB()
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`Server listening on port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log(err.message);
    process.exit(1);
  });
