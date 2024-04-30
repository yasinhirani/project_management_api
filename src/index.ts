import { app } from "./app";
import dotenv from "dotenv";
// import connectDB from "./db/db";
import { v2 as cloudinary } from "cloudinary";

import { Pool } from "pg";
import prisma from "./utils/prisma";

dotenv.config({
  path: "./.env.local",
});

const pool = new Pool({
  host: "localhost",
  user: "postgres",
  port: 5432,
  database: "myDB",
});

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const getResource = async () => {
  const assignedResources: any = [];
  const domains: any =
    await prisma.$queryRaw`SELECT DISTINCT employees.domain FROM staffing_details LEFT JOIN employees ON staffing_details.resource_id = employees.id WHERE project_id = 'ce44483f-c365-4e32-a872-94d449950c94'`;

  domains.forEach((domain: any) => {
    assignedResources.push({
      domain: domain.domain,
      designations: [],
      resources: [],
    });
  });

  const data: any =
    await prisma.$queryRaw`SELECT projects.*, to_json(employees.*) AS EmployeeDetails, to_json(staffing_details.*) AS assignedResources FROM staffing_details LEFT JOIN projects ON staffing_details.project_id = projects.id LEFT JOIN employees ON staffing_details.resource_id = employees.id WHERE project_id = 'ce44483f-c365-4e32-a872-94d449950c94'`;

  const updatedAssignedResources: any = [];
  assignedResources.forEach((res: any, index: any) => {
    data.forEach((detail: any) => {
      if (detail.employeedetails.domain === res.domain) {
        updatedAssignedResources.push({
          ...res,
          resources: [...res.resources, detail.employeedetails],
        });
      }
    });
  });
  return updatedAssignedResources;
};

// getResource();

app.listen(process.env.PORT, () => {
  console.log(`Server listening on port ${process.env.PORT}`);
});

export {getResource};

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
