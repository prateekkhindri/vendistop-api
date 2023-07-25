import "dotenv/config";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import fileUpload from "express-fileupload";
import { mongoConnect } from "./src/config/dbConfig.js";

const app = express();

const PORT = process.env.PORT || 8000;

// Define CORS options
let corsOptions = {
  origin: ["http://localhost:3000", "https://vendistop.netlify.app"],
  optionsSuccessStatus: 200,
};

// Middlewares
app.use(helmet());
app.use(morgan("tiny"));
app.use(express.json());
app.use(cors(corsOptions));
app.use(fileUpload());

// Connect to the database
mongoConnect();

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
