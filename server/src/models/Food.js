import mongoose from "mongoose";

const foodSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    price: {
      type: Number,
      required: true,
    },

    image: {
      type: String,
      default: "",
    },

    images: {
      type: [String],
      default: [],
    },

    category: {
      type: String,
      default: "Food",
    },

    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
      default: null,
    },

    stock: {
      type: Number,
      default: 0,
      min: 0,
    },

    soldCount: {
      type: Number,
      default: 0,
    },

    discountPrice: {
      type: Number,
      default: null,
    },

    isFeatured: {
      type: Boolean,
      default: false,
    },

    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 4.5,
    },

    isAvailable: {
      type: Boolean,
      default: true,
    },

    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

foodSchema.index({ category: 1, createdAt: -1 });
foodSchema.index({ isAvailable: 1, isFeatured: 1, createdAt: -1 });
foodSchema.index({ restaurant: 1 });
foodSchema.index({ soldCount: -1 });
foodSchema.index({ rating: -1 });
foodSchema.index({ brand: 1 });

const Food = mongoose.model("Food", foodSchema);

export default Food;
