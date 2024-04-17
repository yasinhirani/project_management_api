import { app } from "./app";
import dotenv from "dotenv";
import connectDB from "./db/db";
import { v2 as cloudinary } from "cloudinary";
import { Pool, QueryResult } from "pg";

dotenv.config({
  path: "./.env.local",
});

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const pool = new Pool({
  user: "postgres",
  password: "Admin@123",
  host: "localhost",
  port: 5432,
  database: "myDB",
});

const getPostgresClients = async () => {
  let projectDetails: QueryResult | null = null;

  projectDetails = await pool.query(
    "SELECT projects.*, to_json(clients) AS assigned_client FROM projects LEFT JOIN clients ON clients.id = projects.assigned_client WHERE projects.id = '45232e8d-7f03-4892-a06f-04bfe05989e6'"
  );

  // console.log({
  //   ...projectDetails.rows[0],
  //   assignedclient: { ...assignedClientDetails.rows[0] },
  // });

  console.log(projectDetails.rows[0]);

  await pool.end();
};

getPostgresClients();

connectDB()
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`Server listening on port ${process.env.PORT}`);
    });
  })
  .catch((err: any) => {
    console.log(err.message);
    process.exit(1);
  });
