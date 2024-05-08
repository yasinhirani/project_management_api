import asyncHandler from "../../utils/asyncHandler";
import ApiResponse from "../../utils/apiResponse";
import ApiError from "../../utils/apiError";
// import { Client } from "../../models/client/client.model";
import handleFileUpload from "../../utils/fileUploadHandler";
import deleteFiles from "../../utils/fileDeleteHandler";
import cloudinaryFolderPath from "../../constants/cloudinaryFolderPath.constants";
import { NextFunction, Request, Response } from "express";
import prisma from "../../utils/prisma";
import { JsonValue } from "@prisma/client/runtime/library";

/**
 * Function to get all the clients
 */
const getAllClients = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const searchQuery = req.query;

    const fields = searchQuery.fields as string;
    const search = searchQuery.search as string;

    let clients = null;

    // Limiting the fields when only some specific fields are required
    if (fields) {
      clients = await prisma.client.findMany({
        select: fields
          .split(",")
          .reduce((acc: { [key: string]: boolean }, field: string) => {
            return {
              ...acc,
              [field]: true,
            };
          }, {}),
      });
    } else {
      clients = await prisma.client.findMany({
        where: { clientName: { contains: search, mode: "insensitive" } },
        select: {
          id: true,
          clientName: true,
          email: true,
          contactNumber: true,
          companyName: true,
          country: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    }

    res.status(200).json(new ApiResponse({ clients }));
  }
);

/**
 * Function to get a specific client by id
 */
const getClient = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const client = await prisma.client.findUnique({
      where: { id: req.params.id },
      include: {
        projects: {
          select: {
            id: true,
            projectLogo: true,
            projectName: true,
            startDate: true,
            endDate: true,
            projectStatus: true,
            projectPriority: true,
            projectBudget: true,
          },
        },
      },
    });

    if (!client) {
      return next(new ApiError("No client found with the given Id", 404));
    }

    res.status(200).json(new ApiResponse({ client }));
  }
);

/**
 * Function to create a client
 */
const createClient = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const clientDocuments = [];

    const availableCompany = await prisma.client.findFirst({
      where: { companyName: req.body.companyName },
    });

    if (availableCompany) {
      return next(
        new ApiError(
          `A company with same name ${req.body.companyName} already exists, Please provide a different company name.`,
          400
        )
      );
    }

    // Checking if the user has uploaded contract documents or not
    if (req.body.contractDocuments && req.body.contractDocuments.length > 0) {
      // If contract documents uploaded, converting them to original file from base64 and upload to cloudinary
      for (let i = 0; i < req.body.contractDocuments.length; i++) {
        const documentData = await handleFileUpload(
          req.body.contractDocuments[i],
          cloudinaryFolderPath.CLIENT
        );
        clientDocuments.push(documentData);
      }
    }

    // Create the client
    const client = await prisma.client.create({
      data: {
        ...req.body,
        contractDocuments: clientDocuments,
      },
    });

    // Response after client is created
    res
      .status(201)
      .json(new ApiResponse({ client }, "Client Added Successfully"));
  }
);

/**
 * Function to update the client details
 */
const updateClient = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const clientDocuments = [];

    const isClientAvailable = await prisma.client.findUnique({
      where: { id: req.params.id },
    });

    if (!isClientAvailable) {
      return next(new ApiError("No client found with the give id", 404));
    }

    const availableCompanyName = await prisma.client.findFirst({
      where: {
        companyName: req.body.companyName,
      },
    });

    if (availableCompanyName && availableCompanyName.id !== req.params.id) {
      return next(
        new ApiError(
          `A client with the same company name ${req.body.companyName} already exist, Please provide a different company name.`,
          400
        )
      );
    }

    // Checking if the user has uploaded contract documents or not
    if (req.body.uploadedDocuments && req.body.uploadedDocuments.length > 0) {
      // If contract documents uploaded, converting them to original file from base64 and upload to cloudinary
      for (let i = 0; i < req.body.uploadedDocuments.length; i++) {
        const documentData = await handleFileUpload(
          req.body.uploadedDocuments[i],
          cloudinaryFolderPath.CLIENT
        );
        clientDocuments.push(documentData);
      }
    }

    // Checking if user has deleted any document
    if (req.body.deletedDocuments && req.body.deletedDocuments.length > 0) {
      for (let i = 0; i < req.body.deletedDocuments.length; i++) {
        await deleteFiles(req.body.deletedDocuments[i]);
      }
    }

    const updatedRequestBody: any = {};
    const excludeFields: string[] = [
      "uploadedDocuments",
      "deletedDocuments",
      "id",
      "projects",
      "projectIds",
    ];

    for (let i = 0; i < Object.keys(req.body).length; i++) {
      const [key, value] = Object.entries(req.body)[i];
      if (!excludeFields.includes(key)) {
        updatedRequestBody[key] = value;
      }
    }

    const client = await prisma.client.update({
      where: { id: req.params.id },
      data: {
        ...updatedRequestBody,
        contractDocuments: [
          ...updatedRequestBody.contractDocuments,
          ...clientDocuments,
        ],
      },
    });

    res
      .status(200)
      .json(new ApiResponse({ client }, "Client updated successfully"));
  }
);

/**
 * Function to delete the client
 */
const deleteClient = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const client = await prisma.client.findUnique({
      where: { id: req.params.id },
    });

    if (!client) {
      return next(new ApiError("No client found with the given Id", 404));
    }

    if (client.contractDocuments.length > 0) {
      for (let i = 0; i < client.contractDocuments.length; i++) {
        const contractDocument: JsonValue = client.contractDocuments[i];
        await deleteFiles(
          (contractDocument as { public_id: string }).public_id
        );
      }
    }

    await prisma.project.deleteMany({
      where: { assignedClientId: client.id },
    });

    await prisma.client.delete({ where: { id: req.params.id } });

    res.status(200).json(new ApiResponse(null, "Client deleted successfully"));
  }
);

export { getAllClients, createClient, getClient, updateClient, deleteClient };
