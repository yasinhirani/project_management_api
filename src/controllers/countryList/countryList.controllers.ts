import { CountryList } from "../../models/countryList/countryList.model";
import asyncHandler from "../../utils/asyncHandler";
import ApiResponse from "../../utils/apiResponse";
import { NextFunction, Request, Response } from "express";
import prisma from "../../utils/prisma";

const getCountryList = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const countryList = await prisma.countriesList.findMany({
      orderBy: {
        name: "asc",
      },
    });

    res.status(200).json(new ApiResponse({ countryList }));
  }
);

export { getCountryList };
