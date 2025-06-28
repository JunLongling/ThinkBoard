import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";

import notesRoutes from "../src/routes/notesRoutes.js";
import { connectDB } from "../src/config/db.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;
const __dirname = path.resolve();

// middleware
const corsConfig = {
  origin: process.env.FRONTEND_URL, 
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
};

app.use(cors(corsConfig));

// Handle preflight requests
app.options("*", cors(corsConfig));


app.use(express.json()); // JSON body parser

// API routes only
app.use("/api/notes", notesRoutes);


// ✅ Catch-all for unmatched API routes
app.use("*", (req, res) => {
  res.status(404).json({ message: "API route not found" });
});



connectDB().then(() => {
  app.listen(PORT, () => {
    console.log("Server started on PORT:", PORT);
  });
});

export default app;
