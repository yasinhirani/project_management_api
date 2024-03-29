import { CountryList } from "../../models/countryLIst/countryList.model.js";
import asyncHandler from "../../utils/asyncHandler.js";
import ApiResponse from "../../utils/apiResponse.js";

const getCountryList = asyncHandler(async (req, res, next) => {
  const countryList = await CountryList.find({});

  res.status(200).json(new ApiResponse({ countryList }));
});

export { getCountryList };
