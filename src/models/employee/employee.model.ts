import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema({
  empId: {
    type: String,
    required: [true, "Employee ID is required."],
  },
  name: {
    type: String,
    required: [true, "Employee name is required."],
  },
  email: {
    type: String,
    required: [true, "Employee Email is required."],
  },
  contactNumber: {
    type: String,
    required: [true, "Employee Contact number is required."],
  },
  domain: {
    type: String,
    required: [true, "Employee domain is required."],
  },
  designation: {
    type: String,
    required: [true, "Employee designation is required."],
  },
  dateOfJoining: {
    type: String,
    required: [true, "Employee date of joining is required."],
  },
  reportingManager: {
    type: String,
    required: [true, "Employee reporting manager is required."],
  },
  assignedProjects: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "AllocatedHoursDetail",
      },
    ],
    default: [],
  },
});

export const Employee = mongoose.model("Employee", employeeSchema);
