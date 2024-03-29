import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  resources: [String],
});

export const Project = mongoose.model("Project", projectSchema);
