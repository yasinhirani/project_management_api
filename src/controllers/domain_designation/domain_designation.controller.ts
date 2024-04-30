import { NextFunction, Request, Response } from "express";
import asyncHandler from "../../utils/asyncHandler";
import ApiResponse from "../../utils/apiResponse";
import prisma from "../../utils/prisma";

const getDomains = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const domains = await prisma.domainList.findMany();

    res.status(200).json(new ApiResponse({ domains }));
  }
);

const getDesignations = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const designations = await prisma.designationList.findMany();

    res.status(200).json(new ApiResponse({ designations }));
  }
);

export { getDomains, getDesignations };
