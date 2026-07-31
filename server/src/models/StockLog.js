import mongoose from "mongoose";

const stockLogSchema = new mongoose.Schema(
  {
    food: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Food",
      required: true,
    },
    type: {
      type: String,
      enum: ["import", "export", "sale", "adjust", "return"],
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    note: {
      type: String,
      default: "",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

stockLogSchema.index({ food: 1, createdAt: -1 });

export default mongoose.model("StockLog", stockLogSchema);
