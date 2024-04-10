import express from "express";
import cors from "cors";
import clientRoutes from "./routes/client/client.routes.js";
import projectRoutes from "./routes/project/project.routes.js";
import employeeRoutes from "./routes/employee/employee.routes.js";
import countryListRoutes from "./routes/countryList/countryList.routes.js";
import errorHandler from "./utils/errorHandler.js";
import ApiError from "./utils/apiError.js";

const app = express();

app.use(cors());

app.use(express.json({limit: "5mb"}));

app.use(express.urlencoded({ limit: "5mb", extended: true }));

app.use("/api/clients", clientRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/countryList", countryListRoutes);

app.all("*", (req, res, next) => {
  next(new ApiError(`Cannot ${req.method} ${req.path}. The URL is currently unaccessible`, 404));
});

app.use(errorHandler);

export { app };
