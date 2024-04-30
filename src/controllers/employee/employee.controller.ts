import asyncHandler from "../../utils/asyncHandler";
import { Employee } from "../../models/employee/employee.model";
import ApiResponse from "../../utils/apiResponse";
import ApiError from "../../utils/apiError";
import { NextFunction, Request, Response } from "express";
import prisma from "../../utils/prisma";

const getAllEmployees = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    let searchQuery = req.query;

    if (Array.isArray(searchQuery.designation)) {
      searchQuery = {
        ...searchQuery,
        designation: {
          in: searchQuery.designation,
        },
      };
    }

    const employees = await prisma.employee.findMany({
      where: { ...searchQuery },
    });

    res.status(200).json(new ApiResponse({ employees }));
  }
);

const getEmployee = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const employee = await prisma.employee.findUnique({
      where: { id: req.params.id },
      include: {
        assignedProjects: {
          include: {
            project_details: true,
          },
        },
      },
    });

    if (!employee) {
      return next(new ApiError("No employee found with given Id", 404));
    }

    res.status(200).json(new ApiResponse({ employee }));
  }
);

export { getAllEmployees, getEmployee };
