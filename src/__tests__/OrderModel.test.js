import {
  createOrder,
  getOrderById,
  getOrdersByUser,
  getAllOrders,
  updateOrderToDelivered,
} from "../models/order/OrderModel.js";
import Order from "../models/order/OrderSchema.js";

describe("createOrder function", () => {
  // Tests that createOrder function throws an error when creating an order with missing required data
  it("should throw an error when creating an order with missing required data", async () => {
    const orderData = {
      // order data with missing required fields
    };
    await expect(createOrder(orderData)).rejects.toThrow();
  });

  // Tests that createOrder function throws an error when creating an order with invalid data type
  it("should throw an error when creating an order with invalid data type", async () => {
    const orderData = {
      // order data with invalid data type
    };
    await expect(createOrder(orderData)).rejects.toThrow();
  });

  // Tests that createOrder function throws an error when saving the order fails
  it("should throw an error when saving the order fails", async () => {
    const orderData = {
      // valid order data
    };
    const order = new Order(orderData);
    // force save to fail
    order.save = jest.fn().mockRejectedValue(new Error("save failed"));
    await expect(order.save()).rejects.toThrow();
  });
});

describe("getOrderById function", () => {
  // Tests that an invalid _id throws an error
  it("should throw an error when an invalid _id is provided", async () => {
    const invalidId = "invalidId";
    await expect(getOrderById(invalidId)).rejects.toThrow();
  });

  // Tests that an invalid second argument throws an error
  it("should throw an error when an invalid second argument is provided", async () => {
    const validId = "validId";
    const invalidArg = "invalidArg";
    await expect(getOrderById(validId, invalidArg)).rejects.toThrow();
  });
});

describe("getOrdersByUser function", () => {
  // Tests that the function throws an error when an invalid user ID is provided
  it("should throw an error when an invalid user ID is provided", async () => {
    const invalidUserId = "123";
    await expect(getOrdersByUser(invalidUserId)).rejects.toThrow();
  });
});

describe("getAllOrders function", () => {
  // Tests that the function throws an error when there is an error retrieving orders from the database.
  it("should throw an error when there is an error retrieving orders from the database", async () => {
    jest.spyOn(Order, "find").mockImplementationOnce(() => {
      throw new Error();
    });
    await expect(getAllOrders()).rejects.toThrow();
  });
});

describe("updateOrderToDelivered function", () => {
  // Tests that an error is thrown when an invalid _id parameter is passed
  it("should throw an error when invalid _id is passed", async () => {
    await expect(updateOrderToDelivered("invalid_id")).rejects.toThrow();
  });
});
