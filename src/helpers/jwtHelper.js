import jwt from "jsonwebtoken";
import { insertSession } from "../models/sessions/SessionModel.js";
import { updateAdmin } from "../models/user/UserModel.js";

export const signAccessJWT = async (payload) => {
  const accessJWT = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
    expiresIn: "7d",
  });

  const obj = {
    token: accessJWT,
    type: "jwt",
  };

  await insertSession(obj);

  return accessJWT;
};

// @payload must have an email
export const signRefreshJWT = async (payload) => {
  const refreshJWT = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
    expiresIn: "30d",
  });

  const obj = {
    refreshJWT,
  };

  await updateAdmin(payload, obj);
  return refreshJWT;
};

// Function to create both the JWT's
export const createJWTs = async (payload) => {
  return {
    accessJWT: await signAccessJWT(payload),
    refreshJWT: await signRefreshJWT(payload),
  };
};

export const verifyAccessJWT = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_ACCESS_SECRET);
  } catch (error) {
    return error.message;
  }
};

export const verifyRefreshJWT = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  } catch (error) {
    return error.message;
  }
};
