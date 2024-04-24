import mongoose from "mongoose";

const domainSchema = new mongoose.Schema({
  name: {
    type: String,
  },
});

export const Domain = mongoose.model("Domain", domainSchema);