import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  projectName: {
    type: String,
    required: [true, "Project Name is required."],
  },
  projectDescription: {
    type: String,
    required: [true, "Project description is required."],
  },
  projectType: {
    type: String,
    required: [true, "Project type is required."],
  },
  softwareCategory: {
    type: String,
    required: [true, "Software category is required."],
  },
  projectBudget: {
    type: {
      _id: false,
      currency: String,
      value: String,
    },
    required: [true, "Project budget is required."],
  },
  projectBudgetType: {
    type: String,
    required: [true, "Software category is required."],
  },
  assignedClient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Client",
    required: [true, "Clients is/are required."],
  },
  projectPriority: {
    type: String,
    required: [true, "Project priority is required."],
  },
  projectStatus: {
    type: String,
    required: [true, "Project status is required."],
  },
  startDate: {
    type: String,
    required: [true, "Project start date is required"],
  },
  endDate: {
    type: String,
    default: "",
  },
  projectLogo: {
    type: {
      _id: false,
      fileName: String,
      public_id: String,
      url: String,
    },
    default: null,
  },
  projectDocuments: {
    type: [
      {
        _id: false,
        fileName: String,
        public_id: String,
        url: String,
      },
    ],
    default: [],
  },
  assignedResources: {
    type: [
      {
        _id: false,
        domainName: String,
        designations: [String],
        resources: [
          {
            _id: false,
            employeeDetail: {
              type: mongoose.Schema.Types.ObjectId,
              ref: "Employee",
            },
            allocatedHoursDetails: {
              type: mongoose.Schema.Types.ObjectId,
              ref: "AllocatedHoursDetail",
            },
          },
        ],
      },
    ],
    default: [],
  },
});

export const Project = mongoose.model("Project", projectSchema);
