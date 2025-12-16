import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    // User-selected issue type
    type: {
      type: String,
      enum: ["pothole", "garbage", "streetlight", "waterlogging", "other"],
      default: "other",
    },

    imageUrl: {
      type: String,
      default: "",
    },

    // Human-readable address
    address: {
      type: String,
      default: "",
    },

    // GeoJSON location
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
      },
    },

    // Report lifecycle status
    status: {
      type: String,
      enum: ["open", "in progress", "resolved"],
      default: "open",
    },
  },
  { timestamps: true }
);

reportSchema.index({ location: "2dsphere" });

export default mongoose.model("Report", reportSchema);
