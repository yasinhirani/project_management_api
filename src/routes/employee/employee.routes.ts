import express from "express";
import {
  createEmployee,
  getAllEmployees,
  getEmployeePersonalInformation,
  getEmployeeProfile,
  getEmployeeProjectDetails,
  getEmployeeWorkExperience,
  getEmployeeWorkProfile,
  updateEmployeePersonalDetails,
  updateEmployeeWorkExperience,
} from "../../controllers/employee/employee.controller";

const router = express.Router();

router.route("/").get(getAllEmployees).post(createEmployee);
router.route("/:id/profile").get(getEmployeeProfile);
router
  .route("/:id/personalInformation")
  .get(getEmployeePersonalInformation)
  .put(updateEmployeePersonalDetails);
router.route("/:id/workProfile").get(getEmployeeWorkProfile);
router
  .route("/:id/workExperience")
  .get(getEmployeeWorkExperience)
  .put(updateEmployeeWorkExperience);
router.route("/:id/projectDetails").get(getEmployeeProjectDetails);

export default router;
