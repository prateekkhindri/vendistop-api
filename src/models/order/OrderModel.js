import Order from "./OrderSchema.js";

export const createOrder = async (orderData) => {
  const order = new Order(orderData);
  return await order.save();
};

export const getOrderById = async (_id) => {
  return await Order.findById(_id).populate("user", "name email");
};

export const getOrdersByUser = async (_id) => {
  return await Order.find({ user: _id });
};

export const getAllOrders = async () => {
  return await Order.find({}).populate("user", "name email");
};

export const updateOrderToDelivered = async (_id) => {
  return await Order.findByIdAndUpdate(
    _id,
    {
      orderStatus: "delivered",
      deliveredAt: Date.now(),
    },
    { new: true }
  );
};
