import mongoose from "mongoose";

const settingSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    value: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    label: {
      type: String,
      default: "",
    },
    group: {
      type: String,
      enum: ["general", "shipping", "payment", "email", "social", "seo"],
      default: "general",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Setting", settingSchema);
