import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import clientRoutes from "./routes/client/client.routes";
import projectRoutes from "./routes/project/project.routes";
import employeeRoutes from "./routes/employee/employee.routes";
import countryListRoutes from "./routes/countryList/countryList.routes";
import {domainRouter, designationRouter} from "./routes/domain_designation/domain_designation.routes";
import errorHandler from "./utils/errorHandler";
import ApiError from "./utils/apiError";
import { designationRouter, domainRouter } from "./routes/domain_designation/domain_designation.routes";

const app = express();

app.use(cors());

app.use(express.json({limit: "5mb"}));

app.use(express.urlencoded({ limit: "5mb", extended: true }));

app.use("/api/clients", clientRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/countryList", countryListRoutes);
app.use("/api/domains", domainRouter);
app.use("/api/designations", designationRouter);

app.all("*", (req: Request, res: Response, next: NextFunction) => {
  next(new ApiError(`Cannot ${req.method} ${req.path}. The URL is currently unaccessible`, 404));
});

app.use(errorHandler);

export { app };
