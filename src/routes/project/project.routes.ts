import express from "express";
import {
  getAllProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  assignResources,
  deleteResource,
  getStaffingSheet,
  allocateHours,
} from "../../controllers/project/project.controller";

const router = express.Router();

router.route("/").get(getAllProjects).post(createProject);
router.route("/:id").get(getProject).put(updateProject).delete(deleteProject);
router.route("/assignResources/:id").post(assignResources);
router.route("/deleteResource/:id").delete(deleteResource);
router.route("/staffingSheet/:id").get(getStaffingSheet);
router.route("/allocateHours").post(allocateHours);

export default router;
