import asyncHandler from "../../utils/asyncHandler";
import { Employee } from "../../models/employee/employee.model";
import ApiResponse from "../../utils/apiResponse";
import ApiError from "../../utils/apiError";
import { NextFunction, Request, Response } from "express";
import prisma from "../../utils/prisma";

/**
 * Function to get all the employees
 */
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

    let employees = null;

    if (
      Object.keys(searchQuery).length > 0 &&
      searchQuery.designation &&
      searchQuery.domain
    ) {
      employees = await prisma.employee.findMany({
        where: { ...searchQuery },
        include: {
          assignedProjects: {
            select: {
              id: true,
              projectId: true,
              allocatedHours: true,
              startDateOfAllocation: true,
              endDateOfAllocation: true,
            },
          },
        },
      });
    } else {
      employees = await prisma.employee.findMany({
        where: {
          name: { contains: searchQuery.search as string, mode: "insensitive" },
        },
      });
    }

    res.status(200).json(new ApiResponse({ employees }));
  }
);

/**
 * Function to get a single employee
 */
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
