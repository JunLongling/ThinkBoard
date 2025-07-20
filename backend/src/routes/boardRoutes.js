import express from "express";
import { createBoard } from "../controllers/boardsController.js";

const router = express.Router();

router.post("/", createBoard);

export default router;
