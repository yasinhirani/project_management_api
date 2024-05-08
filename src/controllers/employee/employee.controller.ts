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
      (searchQuery.designation || searchQuery.domain)
    ) {
      employees = await prisma.employee.findMany({
        where: { ...searchQuery },
        select: {
          assignedProjects: {
            select: {
              id: true,
              projectId: true,
              allocatedHours: true,
              startDateOfAllocation: true,
              endDateOfAllocation: true,
            },
          },
          id: true,
          name: true,
        },
      });
    } else {
      employees = await prisma.employee.findMany({
        where: {
          name: { contains: searchQuery.search as string, mode: "insensitive" },
        },
        select: {
          id: true,
          name: true,
          empCode: true,
          emailId: true,
          domain: true,
          designation: true,
        },
      });
    }

    res.status(200).json(new ApiResponse({ employees }));
  }
);

/**
 * Function to get a single employee
 */
// const getEmployee = asyncHandler(
//   async (req: Request, res: Response, next: NextFunction) => {
//     const employee = await prisma.employee.findUnique({
//       where: { id: req.params.id },
//       include: {
//         assignedProjects: {
//           select: {
//             projectId: true,
//             allocatedHours: true,
//             startDateOfAllocation: true,
//             endDateOfAllocation: true,
//             projectDetails: true,
//           },
//         },
//       },
//     });

//     if (!employee) {
//       return next(new ApiError("No employee found with given Id", 404));
//     }

//     res.status(200).json(new ApiResponse({ employee }));
//   }
// );

/**
 * Function to create the employee
 */
const createEmployee = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const employee = await prisma.employee.create({
      data: req.body,
    });

    res
      .status(201)
      .json(new ApiResponse({ employee }, "Employee created successfully"));
  }
);

/**
 * Function to get employee profile
 */
const getEmployeeProfile = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const employeeProfile = await prisma.employee.findUnique({
      where: { id: req.params.id },
      select: {
        id: true,
        name: true,
        emailId: true,
        domain: true,
        designation: true,
        contactNumber: true,
        empCode: true,
        reportingManager: true,
      },
    });

    if (!employeeProfile) {
      return next(new ApiError("No employee found with the given Id", 404));
    }

    res.status(200).json(new ApiResponse({ employeeProfile }));
  }
);

/**
 * Function to get employee personal details
 */
const getEmployeePersonalInformation = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const employeePersonalInformation = await prisma.employee.findUnique({
      where: { id: req.params.id },
      select: {
        id: true,
        name: true,
        contactNumber: true,
        skills: true,
        address: true,
      },
    });

    if (!employeePersonalInformation) {
      return next(new ApiError("No employee found with the given Id", 404));
    }

    res.status(200).json(new ApiResponse({ employeePersonalInformation }));
  }
);

/**
 * Function to get employee work profile
 */
const getEmployeeWorkProfile = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const employeeWorkProfile = await prisma.employee.findUnique({
      where: { id: req.params.id },
      select: {
        id: true,
        dateOfJoining: true,
        empCode: true,
        designation: true,
        reportingManager: true,
      },
    });

    if (!employeeWorkProfile) {
      return next(new ApiError("No employee found with the given Id", 404));
    }

    res.status(200).json(new ApiResponse({ employeeWorkProfile }));
  }
);

/**
 * Function to get employee work experience
 */
const getEmployeeWorkExperience = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const employeeWorkExperience = await prisma.employee.findUnique({
      where: { id: req.params.id },
      select: {
        id: true,
        workExperience: true,
      },
    });

    if (!employeeWorkExperience) {
      return next(new ApiError("No employee found with the given Id", 404));
    }

    res.status(200).json(new ApiResponse({ employeeWorkExperience }));
  }
);

/**
 * Function to get employee work experience
 */
const getEmployeeProjectDetails = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const employeeProjectDetails = await prisma.employee.findUnique({
      where: { id: req.params.id },
      select: {
        id: true,
        assignedProjectsIds: true,
        assignedProjects: {
          select: {
            id: true,
            projectDetails: {
              select: {
                id: true,
                projectName: true,
                projectStatus: true,
                projectType: true,
              },
            },
          },
        },
      },
    });

    if (!employeeProjectDetails) {
      return next(new ApiError("No employee found with the given Id", 404));
    }

    res.status(200).json(new ApiResponse({ employeeProjectDetails }));
  }
);

/**
 * Function to update employee skills and language
 */
const updateEmployeePersonalDetails = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const employee = await prisma.employee.findUnique({
      where: { id: req.params.id },
    });

    if (!employee) {
      return next(new ApiError("No employee found with the given Id", 404));
    }

    await prisma.employee.update({
      where: { id: req.params.id },
      data: req.body,
    });

    res
      .status(200)
      .json(new ApiResponse(null, "Personal information updated successfully"));
  }
);

/**
 * Function to update employee work experience
 */
const updateEmployeeWorkExperience = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const employee = await prisma.employee.findUnique({
      where: { id: req.params.id },
    });

    if (!employee) {
      return next(new ApiError("No employee found with the given Id", 404));
    }

    await prisma.employee.update({
      where: { id: req.params.id },
      data: {
        workExperience: [...employee.workExperience, req.body],
      },
    });

    res
      .status(200)
      .json(new ApiResponse(null, "Work experience updated successfully"));
  }
);

export {
  getAllEmployees,
  createEmployee,
  getEmployeeProfile,
  getEmployeePersonalInformation,
  getEmployeeWorkProfile,
  getEmployeeWorkExperience,
  getEmployeeProjectDetails,
  updateEmployeePersonalDetails,
  updateEmployeeWorkExperience,
};
