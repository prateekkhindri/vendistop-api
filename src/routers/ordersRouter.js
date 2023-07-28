import express from "express";
import {
  createOrder,
  getAllOrders,
  getOrderById,
  getOrdersByUser,
  updateOrderToDelivered,
} from "../models/order/OrderModel.js";

const router = express.Router();

// Create an order
router.post("/", async (req, res, next) => {
  try {
    const order = await createOrder(req.body);
    res.status(201).json({
      status: "success",
      message: "Your order has been placed successfully",
      order,
    });
  } catch (error) {
    next(error);
  }
});

// Get all orders: ONLY ACCESSIBLE TO AN ADMIN USER
router.get("/", async (req, res, next) => {
  try {
    const orders = await getAllOrders();
    res.status(200).json({
      status: "success",
      message: "Orders Fetched",
      orders,
    });
  } catch (error) {
    next(error);
  }
});

// Get order history for a logged in user
router.get("/my-orders", async (req, res, next) => {
  try {
    const orders = await getOrdersByUser(req.adminInfo._id);
    res.status(200).json({
      status: "success",
      message: "Orders Fetched",
      orders,
    });
  } catch (error) {
    next(error);
  }
});

// Get order by id accessible to a user
router.get("/:_id", async (req, res, next) => {
  try {
    const { _id } = req.params;
    const order = await getOrderById(_id);
    res.status(200).json({
      status: "success",
      message: "Orders Fetched",
      order,
    });
  } catch (error) {
    next(error);
  }
});

// Update order status - only accessible to an admin user
router.put("/:_id/deliver", async (req, res, next) => {
  try {
    const order = await updateOrderToDelivered(req.params._id);

    res.status(200).json({
      status: "success",
      message: "Order status updated to delivered",
      order,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
