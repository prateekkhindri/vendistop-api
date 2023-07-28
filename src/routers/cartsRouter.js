import express from "express";
import {
  addToCart,
  clearCart,
  getCart,
  removeFromCart,
} from "../models/cart/CartModel.js";

const router = express.Router();

// Fetch cart
router.get("/", async (req, res, next) => {
  try {
    const user = req.adminInfo;
    const cart = await getCart({ userId: user._id });

    res.json({
      status: "success",
      message: "Cart fetched",
      cart: cart ? cart.cartItems : [],
    });
  } catch (error) {
    next(error);
  }
});

// Add product to cart
router.post("/:productId", async (req, res, next) => {
  try {
    const productId = req.params.productId;
    const { quantity = 1 } = req.body;
    const user = req.adminInfo;

    // Fetch the user's cart to compare the cart length later
    const oldCart = await getCart({ userId: user._id });

    // Add product to cart
    const { cart: updatedCart, updatedQuantity } = await addToCart(
      { userId: user._id },
      productId,
      quantity
    );

    // Find the product in the old cart
    const productInOldCart = oldCart.cartItems.find(
      (item) => item.product.toString() === productId
    );

    // Compare the quantity before and after the operation
    if (productInOldCart && productInOldCart.quantity === updatedQuantity) {
      res.json({
        status: "error",
        message: "This product is already in the cart",
      });
    } else {
      res.json({
        status: "success",
        message: "Product added to cart successfully",
        cart: updatedCart.cartItems,
      });
    }
  } catch (error) {
    next(error);
  }
});

// Clearing the cart when payment successful
router.delete("/clear", async (req, res, next) => {
  try {
    const user = req.adminInfo;

    // Remove product from cart
    const clearedCart = await clearCart({ userId: user._id });

    // Check if product still exists in the cartItems
    const cartEmpty = clearedCart?.cartItems?.length === 0;

    res.json({
      status: "success",
      message: cartEmpty
        ? "Cart has been cleared successfully"
        : "An error has occurred, please try again",
      cart: clearedCart ? clearedCart.cartItems : [],
    });
  } catch (error) {
    next(error);
  }
});

// Remove product from cart
router.delete("/:productId", async (req, res, next) => {
  try {
    const productId = req.params.productId;
    const { amount = 1, removeAll = false } = req.body;
    const user = req.adminInfo;

    // Remove product from cart
    const updatedCart = await removeFromCart(
      { userId: user._id },
      productId,
      amount,
      removeAll
    );

    // Check if product still exists in the cartItems
    const productExists = updatedCart?.cartItems?.some(
      (item) => item.product.toString() === productId
    );

    res.json({
      status: "success",
      message: productExists
        ? "Product quantity reduced in cart"
        : "Product removed from cart",
      cart: updatedCart ? updatedCart.cartItems : [],
    });
  } catch (error) {
    next(error);
  }
});

export default router;
