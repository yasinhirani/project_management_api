import express from "express";
import {
  getAllClients,
  createClient,
  getClient,
} from "../../controllers/client/client.controllers.js";

const router = express.Router();

router.route("/").get(getAllClients).post(createClient);
router.route("/:id").get(getClient);

export default router;