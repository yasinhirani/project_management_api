import express from "express";
import cors from "cors";
import clientRoutes from "./routes/client/client.routes.js";
import projectRoutes from "./routes/project/project.routes.js";
import countryListRoutes from "./routes/countryList/countryList.routes.js";
import errorHandler from "./utils/errorHandler.js";
import ApiError from "./utils/apiError.js";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
  })
);

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use("/api/clients", clientRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/countryList", countryListRoutes);

app.all("*", (req, res, next) => {
  next(new ApiError(`Cannot get ${req.path}`, 404));
});

app.use(errorHandler);

export { app };
