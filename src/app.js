import express from "express";

import submissionRoutes from "./routes/submission.routes.js";

import errorMiddleware from "./middleware/error.middleware.js";

const app = express();

// Parse JSON request bodies
app.use(express.json());

// Health check
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Submission API is running",
  });
});

// API routes
app.use("/api", submissionRoutes);

// Error handling
app.use(errorMiddleware);

export default app;
