import express from "express";
import { getAllEmployees, getEmployee } from "../../controllers/employee/employee.controller.js";

const router = express.Router();

router.route("/").get(getAllEmployees);
router.route("/:id").get(getEmployee);

export default router;