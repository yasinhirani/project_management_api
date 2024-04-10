import asyncHandler from "../../utils/asyncHandler.js";
import { Employee } from "../../models/employee/employee.model.js";
import ApiResponse from "../../utils/apiResponse.js";
import ApiError from "../../utils/apiError.js";

const getAllEmployees = asyncHandler(async (req, res, next) => {
  const employees = await Employee.find({});

  res.status(200).json(new ApiResponse({ employees }));
});

const getEmployee = asyncHandler(async (req, res, next) => {
  const employee = await Employee.findById(req.params.id);

  if (!employee) {
    return next(new ApiError("No employee found with given Id", 404));
  }

  await employee.populate({
    path: "assignedProjects",
    model: "AllocatedHoursDetail",
    select: "-resourceId",
    // populate: {
    //   path: "projectId",
    //   model: "Project",
    //   select: "-assignedResources",
    // },
  });

  res.status(200).json(new ApiResponse({ employee }));
});

export { getAllEmployees, getEmployee };
