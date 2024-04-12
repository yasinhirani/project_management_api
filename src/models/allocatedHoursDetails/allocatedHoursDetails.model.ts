import mongoose from "mongoose";

const allocatedHoursDetailsSchema = new mongoose.Schema({
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project"
  },
  resourceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee"
  },
  allocatedHours: {
    type: mongoose.Schema.Types.Map,
    of: String,
  },
  startDateOfAllocation: String,
  endDateOfAllocation: String
});

export const AllocatedHoursDetail = mongoose.model("AllocatedHoursDetail", allocatedHoursDetailsSchema);