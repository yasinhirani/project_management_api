import asyncHandler from "../../utils/asyncHandler.js";
import ApiResponse from "../../utils/apiResponse.js";
import ApiError from "../../utils/apiError.js";
import { Client } from "../../models/client/client.model.js";
import handleFileUpload from "../../utils/fileUploadHandler.js";

const getAllClients = asyncHandler(async (req, res, next) => {
  const clients = await Client.find({});

  res.status(200).json(new ApiResponse({ clients }));
});

const getClient = asyncHandler(async (req, res, next) => {
  const client = await Client.findById(req.params.id)
    .select("-__v")
    .populate("projects");

  if (!client) {
    return next(new ApiError("No client found with the given Id", 404));
  }

  res.status(200).json(new ApiResponse({ client }));
});

const createClient = asyncHandler(async (req, res, next) => {
  const clientDocuments = [];

  if (req.body.contractDocuments && req.body.contractDocuments.length > 0) {
    for (let i = 0; i < req.body.contractDocuments.length; i++) {
      const documentData = await handleFileUpload(
        req.body.contractDocuments[i],
        next
      );
      clientDocuments.push(documentData);
    }
  }

  const client = await Client.create({
    ...req.body,
    contractDocuments: clientDocuments,
  });

  res
    .status(201)
    .json(new ApiResponse({ client }, "Client Added Successfully"));
});

export { getAllClients, createClient, getClient };
