import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      maxLength: 100,
    },

    description: {
      type: String,
      required: true,
      maxLength: 100,
    },

    details: {
      type: String,
      required: true,
      maxLength: 5000,
    },

    catId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: null,
    },

    topProduct: {
      type: Boolean,
      default: false,
    },

    image: {
      type: String,
    },

    imageKey: {
      type: String,
    },

    thumbnail: {
      type: String,
      default: "",
    },

    price: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Product", ProductSchema);
