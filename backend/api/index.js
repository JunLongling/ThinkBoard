import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import notesRoutes from "../src/routes/notesRoutes.js";
import { connectDB } from "../src/config/db.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL, 
  })
);

app.use(express.json()); // JSON body parser

// API routes only
app.use("/api/notes", notesRoutes);

// ❌ Remove frontend serving logic — you're deploying frontend separately
// if (process.env.NODE_ENV === "production") {
//   app.use(express.static(path.join(__dirname, "../frontend/dist")));
//   app.get("*", (req, res) => {
//     res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
//   });
// }

app.get("/", (req, res) => {
  res.send("ThinkBoard Backend is running.");
});

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log("Server started on PORT:", PORT);
  });
});

export default app;
