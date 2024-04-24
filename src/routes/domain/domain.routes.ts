import express from "express";
import { getDomains } from "../../controllers/domain/domain.controller";

const router = express.Router();

router.route("/").get(getDomains);

export default router;