import express from "express";
import { pusher } from "../config/env.js";

const router = express.Router();

router.post("/auth", (req, res) => {
  const { socket_id, channel_name, user_id } = req.body;

  console.log("🛂 Auth request:", req.body);

  if (!channel_name || !channel_name.startsWith("presence-board-")) {
    console.log("❌ Forbidden channel:", channel_name);
    return res.status(403).json({ error: "Unauthorized channel" });
  }

  if (!user_id || typeof user_id !== "string" || !user_id.trim()) {
    console.log("❌ Invalid user_id:", user_id);
    return res.status(400).json({ error: "User ID required" });
  }

  try {
    const authResponse = pusher.authenticate(socket_id, channel_name, {
      user_id,
      user_info: { name: "Anonymous" }, // Optional: Add actual user info
    });

    console.log("✅ Auth success");
    return res.status(200).send(authResponse);
  } catch (error) {
    console.error("❌ Pusher authentication failed:", error);
    return res.status(500).json({ error: "Pusher authentication failed" });
  }
});

export default router;
