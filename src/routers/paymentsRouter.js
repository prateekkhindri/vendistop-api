import express from "express";
import Stripe from "stripe";

const router = express.Router();

router.post("/create-payment-intent", async (req, res) => {
  const secret = process.env.STRIPE_API_KEY;
  const stripe = new Stripe(secret);

  const { amount, currency, paymentMethodType } = req.body;

  // Check that amount, currency and paymentMethodType exist and are in the correct format
  if (!amount || !Number.isInteger(amount)) {
    return res.status(400).send({
      message: "Invalid amount. Must be a number.",
    });
  }
  if (!currency || typeof currency !== "string") {
    return res.status(400).send({
      message: "Invalid currency. Must be a string.",
    });
  }
  if (!paymentMethodType || typeof paymentMethodType !== "string") {
    return res.status(400).send({
      message: "Invalid payment method type. Must be a string.",
    });
  }

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      payment_method_types: [paymentMethodType],
    });

    res.status(200).send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: error.message,
    });
  }
});

export default router;
