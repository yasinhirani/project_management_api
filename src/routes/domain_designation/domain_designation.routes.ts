import express from "express";
import {
  getDesignations,
  getDomains,
} from "../../controllers/domain_designation/domain_designation.controller";

const domainRouter = express.Router();
const designationRouter = express.Router();

domainRouter.route("/").get(getDomains);
designationRouter.route("/").get(getDesignations);

export { domainRouter, designationRouter };
