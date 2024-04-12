import express from "express";
import {
  getAllProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  assignResources,
} from "../../controllers/project/project.controller";

const router = express.Router();

router.route("/").get(getAllProjects).post(createProject);
router.route("/:id").get(getProject).put(updateProject).delete(deleteProject);
// router.route("/assignResources/:id").post(assignResources);

export default router;
