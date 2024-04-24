import asyncHandler from "../../utils/asyncHandler";
import { Employee } from "../../models/employee/employee.model";
import ApiResponse from "../../utils/apiResponse";
import ApiError from "../../utils/apiError";
import { NextFunction, Request, Response } from "express";

const getAllEmployees = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const searchQuery: any = req.query;

    let employeesQuery;
    if (searchQuery) {
      employeesQuery = Employee.find(searchQuery);
    } else {
      employeesQuery = Employee.find({});
    }

    const employees = await employeesQuery;

    res.status(200).json(new ApiResponse({ employees }));
  }
);

const getEmployee = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
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
  }
);

export { getAllEmployees, getEmployee };
