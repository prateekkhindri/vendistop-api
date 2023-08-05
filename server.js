import "dotenv/config";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import fileUpload from "express-fileupload";
import { mongoConnect } from "./src/config/dbConfig.js";
import { adminAuth } from "./src/middlewares/AuthMiddleware.js";
import userRouter from "./src/routers/userRouter.js";
import registerLoginRouter from "./src/routers/registerLoginRouter.js";
import categoryRouter from "./src/routers/categoryRouter.js";
import productRouter from "./src/routers/productRouter.js";
import cartsRouter from "./src/routers/cartsRouter.js";
import ordersRouter from "./src/routers/ordersRouter.js";
import paymentsRouter from "./src/routers/paymentsRouter.js";

const app = express();

const PORT = process.env.PORT || 8000;

// Define CORS options
let corsOptions = {
  origin: ["http://localhost:3000", "https://vendistop.netlify.app"],
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  optionsSuccessStatus: 204,
  allowedHeaders: ["Content-Type", "Authorization"],
};

// Middlewares
app.use(cors(corsOptions));
app.use(express.json());
app.use(helmet());
app.use(morgan("tiny"));
app.use(fileUpload());

// Connect to the database
mongoConnect();

// API's
app.use("/api/v1/register-login", registerLoginRouter);
app.use("/api/v1/admin", userRouter);
app.use("/api/v1/categories", categoryRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/cart", adminAuth, cartsRouter);
app.use("/api/v1/orders", adminAuth, ordersRouter);
app.use("/api/v1/payment", paymentsRouter);

app.get("/", (req, res) => {
  res.json({
    message: "You have reached the Vendistop API",
  });
});

// Global Error Handler
app.use((error, req, res, next) => {
  console.log(error.message);
  const status = error.status || 404;
  res.status(status).json({
    status: "error",
    message: error.message,
  });
});

app.listen(PORT, (error) => {
  error
    ? console.log(error)
    : console.log(`Server is running on port http://localhost:${PORT}`);
});
