import express from "express";
import { createProject } from "../../controllers/project/project.controller.js";

const router = express.Router();

router.route("/").post(createProject);

export default router;
