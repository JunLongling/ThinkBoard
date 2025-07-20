import express from "express";
import cors from "cors";
import http from "http";                // <-- add this
import { Server } from "socket.io";    // <-- add this

import notesRoutes from "./routes/notesRoutes.js";

import { ENV } from "./config/env.js";
import { connectDB } from "./config/db.js";

const app = express();

app.use(cors());
app.use(express.json());

// Create HTTP server wrapping Express app
const server = http.createServer(app);

// Create Socket.IO server attached to HTTP server
const io = new Server(server, {
  cors: {
    origin: "*",       // Change "*" to your frontend URL in production
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

// Add a simple test route
app.get("/", (req, res) => res.send("Hello from server"));

// Pass io to your routes so you can emit events on changes
app.use("/api/notes", notesRoutes(io));

const startServer = async () => {
  try {
    await connectDB();

    // Use HTTP server to listen (not app.listen)
    if (ENV.NODE_ENV !== "production") {
      server.listen(ENV.PORT, () => {
        console.log("Server is up and running on PORT:", ENV.PORT);
      });
    }
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();

// export for vercel or other serverless platforms
export default app;
