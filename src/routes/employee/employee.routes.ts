import express from "express";
import { getAllEmployees, getEmployee } from "../../controllers/employee/employee.controller";

const router = express.Router();

router.route("/").get(getAllEmployees);
router.route("/:id").get(getEmployee);

export default router;