import express from "express";
import { getCountryList } from "../../controllers/countryList/countryList.controllers";

const router = express.Router();

router.route("/").get(getCountryList);

export default router;
