import express from "express";
import {
  getAllClients,
  createClient,
  getClient,
  updateClient,
  deleteClient,
  searchClient,
} from "../../controllers/client/client.controllers";

const router = express.Router();

router.route("/search").get(searchClient);
router.route("/").get(getAllClients).post(createClient);
router.route("/:id").get(getClient).put(updateClient).delete(deleteClient);

export default router;
