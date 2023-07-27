import { verifyAccessJWT } from "../helpers/jwtHelper.js";
import { getOneAdminUser } from "../models/user/UserModel.js";
import { getSession } from "../models/sessions/SessionModel.js";

export const adminAuth = async (req, res, next) => {
  try {
    const { authorization } = req.headers;

    if (authorization) {
      // Check if the token is valid
      const decoded = verifyAccessJWT(authorization);

      if (decoded === "jwt expired") {
        return res.status(403).json({
          status: "error",
          message: "jwt expired",
        });
      }

      if (decoded?.email) {
        // Check if the token exists in the sessions table (db)
        const existsInDB = await getSession({
          type: "jwt",
          token: authorization,
        });

        // Get the user information and do next
        if (existsInDB?._id) {
          const admin = await getOneAdminUser({
            email: decoded.email,
          });

          if (admin?._id) {
            req.adminInfo = admin;
            return next();
          }
        }
      }
    }

    // Otherwise, return or respond with a status of 401
    res.status(401).json({
      status: "error",
      message: "Unauthorized",
    });
  } catch (error) {
    next(error);
  }
};
