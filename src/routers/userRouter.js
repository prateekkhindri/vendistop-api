import express from "express";
import {
  updateAdminPasswordValidation,
  updateAdminProfileValidation,
} from "../middlewares/validationMiddleware.js";
import {
  addToWishlist,
  getOneAdminUser,
  getWishlist,
  removeFromWishlist,
  updateAdmin,
} from "../models/user/UserModel.js";
import { comparePassword, hashedPassword } from "../helpers/bcryptHelper.js";
import { profileUpdateNotification } from "../helpers/emailHelper.js";
import { signAccessJWT, verifyRefreshJWT } from "../helpers/jwtHelper.js";
import { adminAuth } from "../middlewares/AuthMiddleware.js";

const router = express.Router();

// Get admin information
router.get("/", adminAuth, (req, res, next) => {
  try {
    const user = req.adminInfo;

    user.password = undefined;
    user.accessJWT = undefined;
    res.json({
      status: "success",
      message: "Users fetched successfully",
      user,
    });
  } catch (error) {
    next(error);
  }
});

// Update password as a logged in user
router.patch(
  "/",
  adminAuth,
  updateAdminPasswordValidation,
  async (req, res, next) => {
    try {
      const { currentPassword, password, email } = req.body;

      // 1. Check if the user exists for the given email in the db
      const user = await getOneAdminUser({ email });

      // 2. Check if the password stored in the db matches the password sent from the frontend
      if (user?._id) {
        const isMatched = comparePassword(currentPassword, user.password);

        if (isMatched) {
          // 3. If the password matches, encrypt the new password
          const hashedPass = hashedPassword(password);

          // 4. Update the password in the db
          const filter = { _id: user._id };
          const obj = {
            password: hashedPass,
          };

          const updatedAdmin = await updateAdmin(filter, obj);

          if (updatedAdmin?._id) {
            res.json({
              status: "success",
              message: "Password has been updated successfully",
            });

            // 5. Finally, send the email notification to the user
            profileUpdateNotification(user);

            return;
          }
        }
      }

      res.json({
        status: "error",
        message: "Invalid current password",
      });
    } catch (error) {
      next(error);
    }
  }
);

// Update profile information for a logged in user
router.put(
  "/",
  adminAuth,
  updateAdminProfileValidation,
  async (req, res, next) => {
    try {
      const { currentPassword, email, ...rest } = req.body;

      const user = await getOneAdminUser({ email });
      if (user?._id) {
        const isMatched = comparePassword(currentPassword, user.password);

        if (isMatched) {
          const filter = { _id: user._id };

          const updatedAdmin = await updateAdmin(filter, rest);

          if (updatedAdmin?._id) {
            user.password = undefined;
            res.json({
              status: "success",
              message: "Profile has been updated successfully",
              user,
            });

            //  Finally, send the email notification to the user saying that their profile has been updated successfully
            profileUpdateNotification(user);

            return;
          }
        }
      }
      res.json({
        status: "error",
        message:
          "Unable to update the profile information at this time, please try again later",
      });
    } catch (error) {
      next(error);
    }
  }
);

// Return new accessJWT based on the accessJWT
router.get("/accessjwt", async (req, res, next) => {
  try {
    // Receive the authorization token, refresh JWT
    const { authorization } = req.headers;

    if (authorization) {
      const decoded = await verifyRefreshJWT(authorization);

      if (decoded?.email) {
        const user = await getOneAdminUser({
          email: decoded.email,
          refreshJWT: authorization,
        });

        if (user?._id) {
          const accessJWT = await signAccessJWT({ email: decoded.email });

          return res.json({
            status: "success",
            accessJWT,
          });
        }
      }
    }

    res.status(401).json({
      status: "error",
      message: "Unauthorized",
    });
  } catch (error) {
    next(error);
  }
});

// Wishlist routes
// Add product to wishlist
router.post("/wishlist/:productId", adminAuth, async (req, res, next) => {
  try {
    const productId = req.params.productId;
    const user = req.adminInfo;

    // Fetch the user to compare the wishlist length later
    const oldUser = await getOneAdminUser({ _id: user._id });

    // Update the wishlist
    const updatedUser = await addToWishlist({ _id: user._id }, productId);

    oldUser.wishlist.length === updatedUser.wishlist.length
      ? res.json({
          status: "error",
          message: "This product is already in the wishlist",
        })
      : res.json({
          status: "success",
          message: "Product added to wishlist successfully",
          wishlist: updatedUser.wishlist,
        });
  } catch (error) {
    next(error);
  }
});

// Remove product from wishlist
router.delete("/wishlist/:productId", adminAuth, async (req, res, next) => {
  try {
    const productId = req.params.productId;
    const user = req.adminInfo;
    const updatedUser = await removeFromWishlist({ _id: user._id }, productId);

    updatedUser?.wishlist?.includes(productId)
      ? res.json({
          status: "error",
          message:
            "Unable to remove product from wishlist at this time, please try again later",
        })
      : res.json({
          status: "success",
          message: "Product removed from wishlist",
          wishlist: updatedUser.wishlist,
        });
  } catch (error) {
    next(error);
  }
});

// Fetch wishlist
router.get("/wishlist", adminAuth, async (req, res, next) => {
  try {
    const user = req.adminInfo;
    const wishlistUser = await getWishlist({ _id: user._id });

    res.json({
      status: "success",
      message: "Wishlist fetched",
      wishlist: wishlistUser.wishlist,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
