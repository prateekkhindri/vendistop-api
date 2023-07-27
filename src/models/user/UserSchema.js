import mongoose from "mongoose";

const AdminSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ["Admin", "User"],
      required: true,
      default: "User",
    },

    fName: {
      type: String,
      required: true,
      maxLength: 50,
    },

    lName: {
      type: String,
      required: true,
      maxLength: 50,
    },

    phone: {
      type: String,
      maxLength: 15,
    },

    email: {
      type: String,
      unique: true,
      index: 1,
      required: true,
      maxLength: 50,
    },

    password: {
      type: String,
      required: true,
      maxLength: 100,
    },

    address: {
      type: String,
      maxLength: 50,
    },

    wishlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],

    refreshJWT: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", AdminSchema);
