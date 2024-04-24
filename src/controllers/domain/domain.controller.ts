import { NextFunction, Request, Response } from "express";
import { Domain } from "../../models/domain/domain.model";
import asyncHandler from "../../utils/asyncHandler";
import ApiResponse from "../../utils/apiResponse";

const getDomains = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const domains = await Domain.find({});

    res.status(200).json(new ApiResponse({ domains }));
  }
);

export { getDomains };
