import {
  addToCart,
  clearCart,
  getCart,
  removeFromCart,
} from "../models/cart/CartModel.js";
import Cart from "../models/cart/CartSchema.js";

describe("addToCart function", () => {
  // Tests that an error is thrown when trying to find a cart with a filter that matches multiple carts
  it("should throw an error when finding a cart with a filter that matches multiple carts", async () => {
    const filter = { user: "user1" };
    const productId = "product1";
    const quantity = 1;
    await expect(addToCart(filter, productId, quantity)).rejects.toThrow();
  }, 20000);
});

describe("clearCart function", () => {
  // Tests that clearCart throws an error when an invalid filter is provided
  it("should throw an error when an invalid filter is provided", async () => {
    // Arrange
    const invalidFilter = "invalid filter";

    // Act & Assert
    await expect(clearCart(invalidFilter)).rejects.toThrow();
  });
});

describe("getCart function", () => {
  it("should successfully fetch a cart", async () => {
    const filter = { _id: "validId" };
    const mockCart = { _id: "validId", cartItems: [{ product: "product1" }] };
    jest.spyOn(Cart, "findOne").mockReturnValue({
      populate: jest.fn().mockResolvedValue(mockCart),
    });
    const result = await getCart(filter);
    expect(result).toEqual(mockCart);
  });
});

describe("removeFromCart function", () => {
  it("should successfully remove a product from the cart", async () => {
    const filter = { _id: "validId" };
    const productId = "product1";
    const mockCart = {
      _id: "validId",
      cartItems: [{ product: "product1", quantity: 2 }],
      save: jest.fn().mockResolvedValue(true),
    };
    jest.spyOn(Cart, "findOne").mockResolvedValue(mockCart);
    await removeFromCart(filter, productId);
    expect(mockCart.cartItems[0].quantity).toEqual(1);
  });
});
