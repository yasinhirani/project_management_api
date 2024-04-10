import asyncHandler from "../../utils/asyncHandler.js";
import ApiResponse from "../../utils/apiResponse.js";
import ApiError from "../../utils/apiError.js";
import { Client } from "../../models/client/client.model.js";
import handleFileUpload from "../../utils/fileUploadHandler.js";
import deleteFiles from "../../utils/fileDeleteHandler.js";
import cloudinaryFolderPath from "../../constants/cloudinaryFolderPath.constants.js";

/**
 * Function to get all the clients
 */
const getAllClients = asyncHandler(async (req, res, next) => {
  const searchQuery = req.query;

  const query = Client.find({});

  // Limiting the fields when only some specific fields are required
  if (searchQuery.fields) {
    query.select(req.query.fields.split(",").join(" "));
  }

  const clients = await query;

  res.status(200).json(new ApiResponse({ clients }));
});

/**
 * Function to get a specific client by id
 */
const getClient = asyncHandler(async (req, res, next) => {
  const client = await Client.findById(req.params.id)
    .select("-__v")
    .populate("projects");

  if (!client) {
    return next(new ApiError("No client found with the given Id", 404));
  }

  res.status(200).json(new ApiResponse({ client }));
});

/**
 * Function to create a client
 */
const createClient = asyncHandler(async (req, res, next) => {
  const clientDocuments = [];

  const availableCompany = await Client.findOne({
    companyName: req.body.companyName,
  });

  if (availableCompany) {
    return next(
      new ApiError(
        `A company with same name ${req.body.companyName} already exists, Please provide a different company name.`
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
  const client = await Client.create({
    ...req.body,
    contractDocuments: clientDocuments,
  });

  // Response after client is created
  res
    .status(201)
    .json(new ApiResponse({ client }, "Client Added Successfully"));
});

/**
 * Function to update the client details
 */
const updateClient = asyncHandler(async (req, res, next) => {
  const clientDocuments = [];

  const isClientAvailable = await Client.findOne({ _id: req.params.id });

  if (!isClientAvailable) {
    return next(new ApiError("No client found with the give id", 404));
  }

  const availableCompanyName = await Client.findOne({
    companyName: req.body.companyName,
  });

  if (
    availableCompanyName &&
    availableCompanyName._id.toString() !== req.params.id
  ) {
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

  const client = await Client.findByIdAndUpdate(
    req.params.id,
    {
      ...req.body,
      contractDocuments: [...req.body.contractDocuments, ...clientDocuments],
    },
    {
      new: true,
    }
  );

  res
    .status(200)
    .json(new ApiResponse({ client }, "Client updated successfully"));
});

/**
 * Function to delete the client
 */
const deleteClient = asyncHandler(async (req, res, next) => {
  const client = await Client.findOne({ _id: req.params.id });

  if (!client) {
    return next(new ApiError("Client not found", 404));
  }

  if (client.contractDocuments.length > 0) {
    for (let i = 0; i < client.contractDocuments.length; i++) {
      await deleteFiles(client.contractDocuments[i].public_id);
    }
  }

  await Client.findByIdAndDelete(req.params.id);

  res.status(200).json(new ApiResponse(null, "Client deleted successfully"));
});

export { getAllClients, createClient, getClient, updateClient, deleteClient };
