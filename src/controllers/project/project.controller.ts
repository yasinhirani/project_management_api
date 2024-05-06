import { Types } from "mongoose";
import asyncHandler from "../../utils/asyncHandler";
import ApiResponse from "../../utils/apiResponse";
import ApiError from "../../utils/apiError";
import { Project } from "../../models/project/project.model";
// import { Client } from "../../models/client/client.model";
import { Employee } from "../../models/employee/employee.model";
import { AllocatedHoursDetail } from "../../models/allocatedHoursDetails/allocatedHoursDetails.model";
import handleFileUpload from "../../utils/fileUploadHandler";
import cloudinaryFolderPath from "../../constants/cloudinaryFolderPath.constants";
import deleteFiles from "../../utils/fileDeleteHandler";
import { NextFunction, Request, Response } from "express";
import prisma from "../../utils/prisma";
import { JsonValue } from "@prisma/client/runtime/library";

/**
 * Function to get all the projects
 */
const getAllProjects = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { search } = req.query;
    const projects = await prisma.project.findMany({
      where: { projectName: { contains: search as string } },
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json(new ApiResponse({ projects }));
  }
);

/**
 * Function to get a single project by id
 */
const getProject = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const project = await prisma.project.findUnique({
      where: { id: req.params.id },
      include: {
        assignedClient: true,
        assignedResources: {
          include: {
            employee_details: true,
          },
        },
      },
    });

    if (!project) {
      return next(new ApiError("No project found with the given Id", 404));
    }

    if (project.assignedResources.length > 0) {
      const updatedAssignedResourcesObj = project.assignedResources.map(
        (resource) => {
          return {
            ...resource.employee_details,
            staffingDetailId: resource.id,
            allocatedHours: resource.allocatedHours,
            startDateOfAllocation: resource.startDateOfAllocation,
            endDateOfAllocation: resource.endDateOfAllocation,
          };
        }
      );
      return res.status(200).json(
        new ApiResponse({
          project: {
            ...project,
            assignedResources: updatedAssignedResourcesObj,
          },
        })
      );
    }

    res.status(200).json(new ApiResponse({ project }));
  }
);

/**
 * Function to create a project
 */
const createProject = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    let projectLogoDetails = null;
    const projectDocuments = [];

    const client = await prisma.client.findUnique({
      where: { id: req.body.assignedClientId },
    });

    if (!client) {
      return next(
        new ApiError("Selected client not found or is not available", 404)
      );
    }

    // Upload the project logo to cloudinary, if any
    if (req.body.projectLogo) {
      projectLogoDetails = await handleFileUpload(
        req.body.projectLogo,
        cloudinaryFolderPath.PROJECT
      );
    }

    // Upload project documents to cloudinary, if any
    if (req.body.projectDocuments && req.body.projectDocuments.length > 0) {
      for (let i = 0; i < req.body.projectDocuments.length; i++) {
        const documentDetails: {
          fileName: string;
          public_id: string;
          url: string;
        } = await handleFileUpload(
          req.body.projectDocuments[i],
          cloudinaryFolderPath.PROJECT
        );
        projectDocuments.push(documentDetails);
      }
    }

    // Create the project
    const project = await prisma.project.create({
      data: {
        ...req.body,
        projectLogo: projectLogoDetails,
        projectDocuments,
      },
    });

    // Push the project id to the projects array of assigned client and save it
    await prisma.client.update({
      where: { id: req.body.assignedClientId },
      data: { projectIds: [...client.projectIds, project.id] },
    });

    res
      .status(201)
      .json(new ApiResponse({ project }, "Project Created Successfully"));
  }
);

/**
 * Function to update the client
 */
const updateProject = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const projectDocuments = [];

    const project = await prisma.project.findUnique({
      where: { id: req.params.id },
    });

    if (!project) {
      return next(new ApiError("No project found with the given Id", 404));
    }

    // Upload the documents, if any
    if (req.body.uploadedDocuments && req.body.uploadedDocuments.length > 0) {
      for (let i = 0; i < req.body.uploadedDocuments.length; i++) {
        const documentDetails = await handleFileUpload(
          req.body.uploadedDocuments[i],
          cloudinaryFolderPath.PROJECT
        );
        projectDocuments.push(documentDetails);
      }
    }

    // Delete the documents, if any
    if (req.body.deletedDocuments && req.body.deletedDocuments.length > 0) {
      for (let i = 0; i < req.body.deletedDocuments.length; i++) {
        await deleteFiles(req.body.deletedDocuments[i]);
      }
    }

    // Check if the assigned client is changed or not, and if changed replace the client with updated one
    if (project.assignedClientId !== req.body.assignedClientId) {
      const newClient = await prisma.client.findUnique({
        where: { id: req.body.assignedClientId },
      });

      if (!newClient) {
        return next(new ApiError("Selected client not found", 404));
      }

      await prisma.client.update({
        where: { id: req.body.assignedClientId },
        data: { projectIds: [...newClient.projectIds, project.id] },
      });

      const oldClient = await prisma.client.findUnique({
        where: { id: project.assignedClientId },
      });

      if (oldClient) {
        await prisma.client.update({
          where: { id: oldClient.id },
          data: {
            projectIds: oldClient.projectIds.filter(
              (id) => id !== req.params.id
            ),
          },
        });
      }
    }

    let updatedProjectLogo = null;

    if (req.body.updatedProjectLogo) {
      updatedProjectLogo = await handleFileUpload(
        req.body.updatedProjectLogo,
        cloudinaryFolderPath.PROJECT
      );

      const oldProjectLogo: JsonValue = project.projectLogo;

      if (project.projectLogo) {
        await deleteFiles((oldProjectLogo as { public_id: string }).public_id);
      }
    }

    const excludeFields = [
      "uploadedDocuments",
      "deletedDocuments",
      "updatedProjectLogo",
      "id",
      "assignedResourcesIds",
      "assignedResources",
    ];
    const updatedReqBody: any = {};

    for (let i = 0; i < Object.keys(req.body).length; i++) {
      const [key, value] = Object.entries(req.body)[i];
      if (!excludeFields.includes(key)) {
        updatedReqBody[key] = value;
      }
    }

    // Update the project
    const updatedProjectDetails = await prisma.project.update({
      where: { id: req.params.id },
      data: {
        ...updatedReqBody,
        projectDocuments: [...req.body.projectDocuments, ...projectDocuments],
        projectLogo: updatedProjectLogo
          ? updatedProjectLogo
          : project.projectLogo,
      },
    });

    res
      .status(200)
      .json(
        new ApiResponse(
          { project: updatedProjectDetails },
          "Project updated successfully."
        )
      );
  }
);

/**
 * Function to delete the client
 */
const deleteProject = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const project = await prisma.project.findUnique({
      where: { id: req.params.id },
    });

    if (!project) {
      return next(new ApiError("No project found with the given Id", 404));
    }

    // Delete the project documents if any
    if (project.projectDocuments.length > 0) {
      for (let i = 0; i < project.projectDocuments.length; i++) {
        const projectDocument: JsonValue = project.projectDocuments[i];
        await deleteFiles((projectDocument as { public_id: string }).public_id);
      }
    }

    if (project.projectLogo) {
      const projectLogo: JsonValue = project.projectLogo;
      await deleteFiles((projectLogo as { public_id: string }).public_id!);
    }

    const client = await prisma.client.findUnique({
      where: { id: project.assignedClientId },
    });

    if (client) {
      await prisma.client.update({
        where: { id: project.assignedClientId },
        data: {
          projectIds: client.projectIds.filter((id) => id !== project.id),
        },
      });
    }

    // if (project.assignedResources.length > 0) {
    //   // Get all the resource staffing details where project id is equal to the project id to be deleted
    //   const resourceStaffingDetails = await AllocatedHoursDetail.find({
    //     projectId: project.id,
    //   });

    //   if (resourceStaffingDetails && resourceStaffingDetails.length > 0) {
    //     // Loop over all the resource staffing details
    //     for (let i = 0; i < resourceStaffingDetails.length; i++) {
    //       // Find the employee who is staffed in the project to be deleted
    //       const employee = await Employee.findById(
    //         resourceStaffingDetails[i].resourceId
    //       );

    //       if (employee) {
    //         // Get the index number where the staffing details id is present in assignedProjects array of employee
    //         const staffingDetailsIndex = employee.assignedProjects.findIndex(
    //           (project) =>
    //             project.toString() === resourceStaffingDetails[i]._id.toString()
    //         );

    //         if (staffingDetailsIndex !== -1) {
    //           // Remove that id from assignedProjects array f employee and save it
    //           employee.assignedProjects.splice(staffingDetailsIndex, 1);

    //           await employee.save({ validateBeforeSave: false });
    //         }
    //       }

    //       // Delete the staffing details
    //       await AllocatedHoursDetail.findByIdAndDelete(
    //         resourceStaffingDetails[i]._id
    //       );
    //     }
    //   }
    // }

    // Delete the project
    await prisma.project.delete({ where: { id: project.id } });

    res.status(200).json(new ApiResponse(null, "Project deleted successfully"));
  }
);

/**
 * Function to assign the resources to the project
 */
// const assignResources = asyncHandler(
//   async (req: Request, res: Response, next: NextFunction) => {
//     const { domainName, designations, resources } = req.body;

//     // Find the project with received id in params
//     const project = await Project.findById(req.params.id);

//     if (!project) {
//       return next(new ApiError("No project found with the given Id", 400));
//     }

//     const staffingDetailsIds: Types.ObjectId[] = [];
//     let updatedResources = [];

//     if (resources.length > 0) {
//       // Create an staffing for all the resources available in resources array from req.body
//       for (let i = 0; i < resources.length; i++) {
//         const staffingDetailsObj = await AllocatedHoursDetail.create({
//           projectId: project._id,
//           resourceId: resources[i]._id,
//           allocatedHours: {},
//           startDateOfAllocation: "",
//           endDateOfAllocation: "",
//         });

//         const resourceToAssign = await Employee.findById(resources[i]._id);

//         if (!resourceToAssign) {
//           return next(new ApiError("One or more resource not found", 404));
//         }

//         // Push the project id in assignedProjects array for each resource
//         resourceToAssign.assignedProjects.push(staffingDetailsObj._id);

//         resourceToAssign.save({ validateBeforeSave: false });

//         staffingDetailsIds.push(staffingDetailsObj._id);
//       }
//       // Creating an array of object that contains employeeDetails with employee id and allocatedHours details with staffing details id
//       updatedResources = resources.map(
//         (resource: { _id: string }, index: number) => {
//           return {
//             employeeDetail: resource._id,
//             allocatedHoursDetails: staffingDetailsIds[index],
//           };
//         }
//       );
//     }

//     const updatedProjectDetails = {
//       domainName,
//       designations,
//       resources: updatedResources,
//     };

//     const domainIndex = project.assignedResources.findIndex(
//       (resource) => resource.domainName === domainName
//     );

//     if (domainIndex !== -1) {
//       project.assignedResources[domainIndex].designations = [...designations];
//       for (let i = 0; i < updatedResources.length; i++) {
//         project.assignedResources[domainIndex].resources.push(
//           updatedResources[i]
//         );
//       }
//     } else {
//       project.assignedResources.push(updatedProjectDetails);
//     }

//     await project.save({ validateBeforeSave: false });

//     res
//       .status(200)
//       .json(new ApiResponse(null, "Resource/s assigned successfully"));
//   }
// );

/**
 * Function to assign the resources to the project
 */
const assignResources = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const project = await prisma.project.findUnique({
      where: { id: req.params.id },
    });

    if (!project) {
      return next(new ApiError("No project found with the given Id", 404));
    }
    for (let i = 0; i < req.body.resources.length; i++) {
      const resource = await prisma.employee.findUnique({
        where: { id: req.body.resources[i].id },
      });
      if (resource) {
        const staffingDetails = await prisma.staffingDetails.create({
          data: {
            projectId: req.params.id,
            resourceId: req.body.resources[i].id,
            isForcedStaffed: req.body.resources[i].isForcedStaffed || false,
          },
        });
        await prisma.employee.update({
          where: { id: resource.id },
          data: {
            assignedProjectsIds: [
              ...resource.assignedProjectsIds,
              staffingDetails.id,
            ],
          },
        });
        await prisma.project.update({
          where: { id: project.id },
          data: {
            assignedResourcesIds: [
              ...project.assignedResourcesIds,
              staffingDetails.id,
            ],
          },
        });
      }
    }

    res
      .status(200)
      .json(new ApiResponse(null, "Resource/s assigned successfully"));
  }
);

/**
 * Function to delete the resources from the project
 */
const deleteResource = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { staffingDetailId, resourceId } = req.query as any;
    const projectId = req.params.id;

    const employee = await prisma.employee.findUnique({
      where: { id: resourceId },
    });

    if (!employee) {
      return next(new ApiError("No employee found with the given Id", 404));
    }

    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      return next(new ApiError("No project found with the given Id", 404));
    }

    await prisma.employee.update({
      where: { id: resourceId },
      data: {
        assignedProjectsIds: employee.assignedProjectsIds.filter(
          (id) => id !== staffingDetailId
        ),
      },
    });

    await prisma.project.update({
      where: { id: projectId },
      data: {
        assignedResourcesIds: project.assignedResourcesIds.filter(
          (id) => id !== staffingDetailId
        ),
      },
    });

    await prisma.staffingDetails.delete({ where: { id: staffingDetailId } });

    res
      .status(200)
      .json(new ApiResponse(null, "Resource deleted successfully"));
  }
);

/**
 * Function to get the staffing sheet of a project
 */
const getStaffingSheet = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const assignedResources: any = [];

    const project = await prisma.project.findUnique({
      where: { id: req.params.id },
    });

    if (!project) {
      return next(new ApiError("No project found with the given Id", 404));
    }

    const domains: any =
      await prisma.$queryRaw`SELECT DISTINCT employees.domain FROM staffing_details 
              LEFT JOIN employees ON staffing_details.resource_id = employees.id 
              WHERE project_id = ${req.params.id}`;

    domains.forEach((domain: any) => {
      assignedResources.push({
        domain: domain.domain,
        designations: [],
        resources: [],
      });
    });

    const staffingData: any =
      await prisma.$queryRaw`SELECT to_json(projects.*) AS "projectDetails", 
              to_json(employees.*) AS "employeeDetails", 
              json_build_object('staffingDetailId',staffing_details.id,
              'allocatedHours',staffing_details.allocated_hours,
              'startDateOfAllocation',staffing_details.start_date_of_allocation,
              'endDateOfAllocation',staffing_details.end_date_of_allocation)
              AS "assignedResources" 
              FROM staffing_details 
              LEFT JOIN projects ON staffing_details.project_id = projects.id 
              LEFT JOIN employees ON staffing_details.resource_id = employees.id 
              WHERE project_id = ${req.params.id}`;

    const separatedResourcesWithDomain = staffingData.reduce(
      (acc: any, curr: any) => {
        const currDomain = curr.employeeDetails.domain;
        if (!acc[currDomain]) {
          acc[currDomain] = [];
        }
        acc[currDomain].push({
          ...curr.employeeDetails,
          ...curr.assignedResources,
        });
        return acc;
      },
      {}
    );

    const separatedDesignations = staffingData.reduce((acc: any, curr: any) => {
      const currDomain = curr.employeeDetails.domain;
      const currDesignation = curr.employeeDetails.designation;
      if (!acc[currDomain]) {
        acc[currDomain] = [];
      }
      if (!acc[currDomain].includes(currDesignation)) {
        acc[currDomain].push(currDesignation);
      }
      return acc;
    }, {});

    assignedResources.forEach((domain: any) => {
      domain.resources = separatedResourcesWithDomain[domain.domain];
      domain.designations = separatedDesignations[domain.domain];
    });

    res.status(200).json(
      new ApiResponse({
        projectDetails: {
          id: project.id,
          projectName: project.projectName,
          startDate: project.startDate,
          endDate: project.endDate,
        },
        staffingSheet: assignedResources,
      })
    );
  }
);

/**
 * Function to allocate hours for the projects
 */
const allocateHours = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { projectId, staffingDetailId } = req.query as any;
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      return next(new ApiError("No project found with the given Id", 404));
    }

    const staffingDetail = await prisma.staffingDetails.findUnique({
      where: { id: staffingDetailId },
    });

    if (!staffingDetail) {
      return next(
        new ApiError(
          "No staffing detail found with the given Id, please make sure the employee is assigned to the project",
          404
        )
      );
    }

    await prisma.staffingDetails.update({
      where: { id: staffingDetailId },
      data: {
        ...req.body,
      },
    });

    res.status(200).json(new ApiResponse(null, "Hours allocated successfully"));
  }
);

export {
  getAllProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  assignResources,
  deleteResource,
  getStaffingSheet,
  allocateHours,
};
