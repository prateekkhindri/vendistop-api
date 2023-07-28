import Cart from "./CartSchema.js";

// Fetch the user's cart
export const getCart = (filter) => {
  return Cart.findOne(filter).populate("cartItems.product");
};

// Add product to cart or increment quantity
export const addToCart = async (filter, productId, quantity) => {
  let cart = await Cart.findOne(filter);

  let updatedQuantity = quantity; // This will hold the updated quantity

  if (!cart) {
    cart = await Cart.create({
      ...filter,
      cartItems: [{ product: productId, quantity }],
    });
  } else {
    const index = cart.cartItems.findIndex(
      (item) => item.product.toString() === productId
    );
    if (index !== -1) {
      cart.cartItems[index].quantity += quantity;
      updatedQuantity = cart.cartItems[index].quantity; // Update the updatedQuantity here
    } else {
      cart.cartItems.push({ product: productId, quantity });
    }

    await cart.save();
  }

  cart = await Cart.findOne(filter).populate("cartItems.product");
  // Return the updated cart and the updated quantity
  return { cart, updatedQuantity };
};

// Remove product from cart
export const removeFromCart = async (
  filter,
  productId,
  amount = 1,
  removeAll = false
) => {
  const cart = await Cart.findOne(filter);

  if (cart) {
    const index = cart.cartItems.findIndex(
      (item) => item.product.toString() === productId
    );
    if (index !== -1) {
      if (cart.cartItems[index].quantity > 1 && !removeAll) {
        cart.cartItems[index].quantity -= amount;
      } else {
        cart.cartItems.splice(index, 1);
      }
    }

    return await cart.save();
  }

  return null;
};

// Clear cart

export const clearCart = async (filter) => {
  const cart = await Cart.findOne(filter);

  if (cart) {
    cart.cartItems = [];

    return await cart.save();
  }

  return null;
};
