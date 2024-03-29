import asyncHandler from "../../utils/asyncHandler.js";
import ApiResponse from "../../utils/apiResponse.js";
import { Project } from "../../models/project/project.model.js";

const createProject = asyncHandler(async (req, res, next) => {
  const project = await Project.create(req.body);
  res
    .status(201)
    .json(new ApiResponse({ project }, "Project Created Successfully"));
});

export { createProject };
