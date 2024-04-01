import mongoose from "mongoose";

const clientSchema = new mongoose.Schema(
  {
    clientName: {
      type: String,
      required: [true, "Client name is required"],
    },
    email: {
      type: String,
      required: [true, "Client email is required"],
    },
    contactNumber: {
      type: String,
      required: [true, "Client contact number is required"],
    },
    address: {
      type: String,
      required: [true, "Client address is required"],
    },
    country: {
      type: String,
      required: [true, "Client location is required"],
    },
    role: {
      type: String,
      required: [true, "Client role is required"],
    },
    linkedinLink: {
      type: String,
      default: "",
    },
    facebookLink: {
      type: String,
      default: "",
    },
    companyName: {
      type: String,
      required: [true, "Client company name is required"],
      unique: [true, "Client company name should be unique"],
    },
    companyAddress: {
      type: String,
      required: [true, "Client address is required"],
    },
    dateOfEstablishment: {
      type: String,
      required: [true, "Client's date of establishment is required"],
    },
    industryType: {
      type: [String],
      required: [true, "Client industry type is required"],
    },
    preferredCommunicationMethod: {
      type: [String],
      required: [true, "Client preferred communication method is required"],
    },
    preferredCommunicationLanguage: {
      type: [String],
      required: [
        true,
        "Client preferred language for communication is required",
      ],
    },
    preferredMeetingTime: {
      type: String,
      required: [true, "Client preferred meeting time is required"],
    },
    annualRevenueRange: {
      type: String,
      required: [true, "Client annual revenue range is required"],
    },
    targetAudience: {
      type: String,
      required: [true, "Client's target audience is required"],
    },
    referralSource: {
      type: String,
      default: "",
    },
    clientExpectation: {
      type: String,
      default: "",
    },
    projects: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Project",
      default: [],
    },
    contractDocuments: [
      {
        fileName: String,
        url: String,
      },
    ],
  },
  { timestamps: true }
);

export const Client = mongoose.model("Client", clientSchema);
