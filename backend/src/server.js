import express from "express";
import cors from "cors";

import notesRoutes from "./routes/notesRoutes.js";
import pusherRoutes from "./routes/pusherRoutes.js";
import boardRoutes from "./routes/boardRoutes.js"; 

import { ENV } from "./config/env.js";
import { connectDB } from "./config/db.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => res.send("Hello from server"));

app.use("/api/notes", notesRoutes);
app.use("/api/boards", boardRoutes);
app.use("/pusher", pusherRoutes);

const startServer = async () => {
  try {
    await connectDB();

    app.listen(ENV.PORT, () => {
      console.log(`Server running on PORT: ${ENV.PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();

export default app;
