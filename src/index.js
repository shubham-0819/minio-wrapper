import express from "express";
import winston from "winston";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import cors from "cors";
import bodyParser from "body-parser";
import routeManager from "./route-manager.js";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();


const app = express();
const port = process.env.PORT || 3000;

// Logger setup
const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "combined.log" }),
  ],
});

// Middleware setup
app.use(helmet());
app.use(cors());
app.use(bodyParser.json());
app.use(
  morgan("combined", {
    stream: { write: (message) => logger.info(message.trim()) },
  })
);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Route manager
app.use("/api", routeManager);

// Error handling
app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});


// Start server
app.listen(port, () => {
  logger.info(`Server is running on port ${port}`);
});
