import asyncHandler from "../../utils/asyncHandler.js";
import ApiResponse from "../../utils/apiResponse.js";
import ApiError from "../../utils/apiError.js";
import { Client } from "../../models/client/client.model.js";
import handleFileUpload from "../../utils/fileUploadHandler.js";

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

  // Checking if the user has uploaded contract documents or not
  if (req.body.contractDocuments && req.body.contractDocuments.length > 0) {
    // If contract documents uploaded, converting them to original file from base64 and upload to cloudinary
    for (let i = 0; i < req.body.contractDocuments.length; i++) {
      const documentData = await handleFileUpload(
        req.body.contractDocuments[i],
        next
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
  const client = await Client.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  res
    .status(200)
    .json(new ApiResponse({ client }, "Client updated successfully"));
});

/**
 * Function to delete the client
 */
const deleteClient = asyncHandler(async (req, res, next) => {
  const client = await Client.findByIdAndDelete(req.params.id);

  res
    .status(200)
    .json(new ApiResponse(null, "Client deleted successfully"));
});

export { getAllClients, createClient, getClient, updateClient, deleteClient };
