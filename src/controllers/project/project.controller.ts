import { Types } from "mongoose";
import asyncHandler from "../../utils/asyncHandler";
import ApiResponse from "../../utils/apiResponse";
import ApiError from "../../utils/apiError";
import { Project } from "../../models/project/project.model";
import { Client } from "../../models/client/client.model";
import { Employee } from "../../models/employee/employee.model";
import { AllocatedHoursDetail } from "../../models/allocatedHoursDetails/allocatedHoursDetails.model";
import handleFileUpload from "../../utils/fileUploadHandler";
import cloudinaryFolderPath from "../../constants/cloudinaryFolderPath.constants";
import deleteFiles from "../../utils/fileDeleteHandler";
import { NextFunction, Request, Response } from "express";

/**
 * Function to get all the projects
 */
const getAllProjects = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const projects = await Project.find({});

    res.status(200).json(new ApiResponse({ projects }));
  }
);

/**
 * Function to get a single project by id
 */
const getProject = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    // Find the project by id and populate all the details of clients and assigned resources by id to the actual data
    const project = await Project.findOne({ _id: req.params.id })
      .populate({
        path: "assignedClient",
        select: "clientName email companyName",
      })
      .populate({
        path: "assignedResources",
        populate: {
          path: "resources",
          populate: {
            path: "employeeDetail",
            model: "Employee",
            select: "-assignedProjects",
          },
        },
      })
      .populate({
        path: "assignedResources",
        populate: {
          path: "resources",
          populate: {
            path: "allocatedHoursDetails",
            model: "AllocatedHoursDetail",
            select: "-projectId -resourceId",
          },
        },
      });

    if (!project) {
      return next(new ApiError("No project found with the given Id", 404));
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

    const client = await Client.findOne({ _id: req.body.assignedClient });

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
        const documentDetails = await handleFileUpload(
          req.body.projectDocuments[i],
          cloudinaryFolderPath.PROJECT
        );
        projectDocuments.push(documentDetails);
      }
    }

    // Create the project
    const project = await Project.create({
      ...req.body,
      projectLogo: projectLogoDetails,
      projectDocuments,
    });

    // Push the project id to the projects array of assigned client and save it
    client.projects.push(project._id);

    await client.save({ validateBeforeSave: false });

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

    const project = await Project.findById(req.params.id);

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
    if (project.assignedClient.toString() !== req.body.assignedClient) {
      const newClient = await Client.findById(req.body.assignedClient);

      if (!newClient) {
        return next(new ApiError("Selected client not found", 404));
      }

      newClient.projects.push(project._id);

      await newClient.save({ validateBeforeSave: false });

      const oldClient = await Client.findById(project.assignedClient);

      if (oldClient) {
        const projectIndex = oldClient.projects.findIndex(
          (project) => project.toString() === project._id.toString()
        );

        if (projectIndex !== -1) {
          oldClient.projects.splice(projectIndex, 1);
        }

        await oldClient.save({ validateBeforeSave: false });
      }
    }

    let updatedProjectLogo = null;

    if (req.body.updatedProjectLogo) {
      updatedProjectLogo = await handleFileUpload(
        req.body.updatedProjectLogo,
        cloudinaryFolderPath.PROJECT
      );

      await deleteFiles(project.projectLogo.public_id!);
    }

    // Update the project
    const updatedProjectDetails = await Project.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        projectDocuments: [...req.body.projectDocuments, ...projectDocuments],
        projectLogo: updatedProjectLogo
          ? updatedProjectLogo
          : project.projectLogo,
      },
      { new: true }
    );

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
    const project = await Project.findById(req.params.id);

    if (!project) {
      return next(new ApiError("No project found with the given Id", 404));
    }

    // Delete the project documents if any
    if (project.projectDocuments.length > 0) {
      for (let i = 0; i < project.projectDocuments.length; i++) {
        await deleteFiles(project.projectDocuments[i].public_id!);
      }
    }

    const client = await Client.findById(project.assignedClient);

    if (client) {
      // Find the project index in clients project array
      const projectIdIndex = client.projects.findIndex(
        (projectId) => projectId.toString() === req.params.id
      );

      if (projectIdIndex !== -1) {
        // If index is found, then delete the project from clients project array and save it
        client.projects.splice(projectIdIndex, 1);
        await client.save({ validateBeforeSave: false });
      }
    }

    if (project.assignedResources.length > 0) {
      // Get all the resource staffing details where project id is equal to the project id to be deleted
      const resourceStaffingDetails = await AllocatedHoursDetail.find({
        projectId: project._id,
      });

      if (resourceStaffingDetails && resourceStaffingDetails.length > 0) {
        // Loop over all the resource staffing details
        for (let i = 0; i < resourceStaffingDetails.length; i++) {
          // Find the employee who is staffed in the project to be deleted
          const employee = await Employee.findById(
            resourceStaffingDetails[i].resourceId
          );

          if (employee) {
            // Get the index number where the staffing details id is present in assignedProjects array of employee
            const staffingDetailsIndex = employee.assignedProjects.findIndex(
              (project) =>
                project.toString() === resourceStaffingDetails[i]._id.toString()
            );

            if (staffingDetailsIndex !== -1) {
              // Remove that id from assignedProjects array f employee and save it
              employee.assignedProjects.splice(staffingDetailsIndex, 1);

              await employee.save({ validateBeforeSave: false });
            }
          }

          // Delete the staffing details
          await AllocatedHoursDetail.findByIdAndDelete(
            resourceStaffingDetails[i]._id
          );
        }
      }
    }

    // Delete the project
    await Project.findByIdAndDelete(req.params.id);

    res.status(200).json(new ApiResponse(null, "Project deleted successfully"));
  }
);

/**
 * Function to assign the resources to the project
 */
// const assignResources = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
//   const { domainName, designations, resources } = req.body;

//   const project = await Project.findOne({ _id: req.params.id });

//   if (!project) {
//     return next(new ApiError("No project found with the given ID", 404));
//   }

//   const allocatedHoursIds = [];

//   for (let i = 0; i < resources.length; i++) {
//     const resource = resources[i];
//     const allocatedHoursDetails = await AllocatedHoursDetail.create({
//       projectId: req.params.id,
//       resourceId: resource._id,
//       allocatedHours: {},
//       startDateOfAllocation: "",
//       endDateOfAllocation: "",
//     });

//     const resourceToAssign = await Employee.findOne({ _id: resource._id });

//     if (!resourceToAssign) {
//       return next(new ApiError(`One or more resource is not found`, 404));
//     }

//     resourceToAssign.assignedProjects.push(allocatedHoursDetails._id);

//     resourceToAssign.save({ validateBeforeSave: false });

//     allocatedHoursIds.push(allocatedHoursDetails._id);
//   }

//   const resourcesArray = resources.map((resource, index) => {
//     return {
//       employeeDetail: resource._id,
//       allocatedHoursDetails: allocatedHoursIds[index],
//     };
//   });

//   project.assignedResources.push({
//     domainName,
//     designations,
//     resources: resourcesArray,
//   });

//   await project.save({ validateBeforeSave: false });

//   res
//     .status(200)
//     .json(new ApiResponse(null, "Resource/s assigned successfully"));
// });

const assignResources = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { domainName, designations, resources } = req.body;

    // Find the project with received id in params
    const project = await Project.findById(req.params.id);

    if (!project) {
      return next(new ApiError("No project found with the given Id", 400));
    }

    const staffingDetailsIds: Types.ObjectId[] = [];
    let updatedResources = [];

    if (resources.length > 0) {
      // Create an staffing for all the resources available in resources array from req.body
      for (let i = 0; i < resources.length; i++) {
        const staffingDetailsObj = await AllocatedHoursDetail.create({
          projectId: project._id,
          resourceId: resources[i]._id,
          allocatedHours: {},
          startDateOfAllocation: "",
          endDateOfAllocation: "",
        });

        const resourceToAssign = await Employee.findById(resources[i]._id);

        if (!resourceToAssign) {
          return next(new ApiError("One or more resource not found", 404));
        }

        // Push the project id in assignedProjects array for each resource
        resourceToAssign.assignedProjects.push(staffingDetailsObj._id);

        resourceToAssign.save({ validateBeforeSave: false });

        staffingDetailsIds.push(staffingDetailsObj._id);
      }
      // Creating an array of object that contains employeeDetails with employee id and allocatedHours details with staffing details id
      updatedResources = resources.map(
        (resource: { _id: string }, index: number) => {
          return {
            employeeDetail: resource._id,
            allocatedHoursDetails: staffingDetailsIds[index],
          };
        }
      );
    }

    const updatedProjectDetails = {
      domainName,
      designations,
      resources: updatedResources,
    };

    const domainIndex = project.assignedResources.findIndex(
      (resource) => resource.domainName === domainName
    );

    if (domainIndex !== -1) {
      project.assignedResources[domainIndex].designations = [...designations];
      for (let i = 0; i < updatedResources.length; i++) {
        project.assignedResources[domainIndex].resources.push(
          updatedResources[i]
        );
      }
    } else {
      project.assignedResources.push(updatedProjectDetails);
    }

    await project.save({ validateBeforeSave: false });

    res
      .status(200)
      .json(new ApiResponse(null, "Resource/s assigned successfully"));
  }
);

export {
  getAllProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  assignResources,
};
