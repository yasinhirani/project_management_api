import { NextFunction, Request, Response } from "express";
import { Domain, Designation } from "../../models/domain_designation/domain_designation.model";
import asyncHandler from "../../utils/asyncHandler";
import ApiResponse from "../../utils/apiResponse";

const getDomains = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const domains = await Domain.find({});

    res.status(200).json(new ApiResponse({ domains }));
  }
);

const getDesignations = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const designations = await Designation.find({});

    res.status(200).json(new ApiResponse({ designations }));
  }
);

export { getDomains, getDesignations };
