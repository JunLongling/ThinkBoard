import express from "express";
import cors from "cors";

import notesRoutes from "./routes/notesRoutes.js";

import { ENV } from "./config/env.js";
import { connectDB } from "./config/db.js";

const app = express();

app.use(cors());
app.use(express.json()); // JSON body parser

// API routes only
app.use("/api/notes", notesRoutes);

const startServer = async () => {
  try {
    await connectDB();

    // listen for local development
    if (ENV.NODE_ENV !== "production") {
      app.listen(ENV.PORT, () => console.log("Server is up and running on PORT:", ENV.PORT));
    }
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();

// export for vercel
export default app;
