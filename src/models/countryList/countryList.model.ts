import mongoose from "mongoose";

const countryListSchema = new mongoose.Schema({
  name: String,
  code: String,
});

export const CountryList = mongoose.model("CountryList", countryListSchema);