import mongoose from "mongoose";

// This table exists to store the OTP, JWT's
// to authenticate the user

const SessionSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      required: true,
    },

    associate: {
      type: String,
      default: "",
    },

    type: {
      type: String,
      required: true,
    },

    expires: {
      type: Date,
      default: null,
    },
  },

  {
    timestamps: true,
  }
);

export default mongoose.model("Session", SessionSchema);
