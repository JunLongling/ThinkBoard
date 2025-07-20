import dotenv from "dotenv";
import Pusher from "pusher";

dotenv.config(); // Load env variables once at the top

export const ENV = {
  PORT: process.env.PORT,
  NODE_ENV: process.env.NODE_ENV,
  MONGO_URI: process.env.MONGO_URI,
  PUSHER_APP_ID: process.env.PUSHER_APP_ID,
  PUSHER_KEY: process.env.PUSHER_KEY,
  PUSHER_SECRET: process.env.PUSHER_SECRET,
  PUSHER_CLUSTER: process.env.PUSHER_CLUSTER,
};

// Export Pusher instance configured with env vars
export const pusher = new Pusher({
  appId: ENV.PUSHER_APP_ID,
  key: ENV.PUSHER_KEY,
  secret: ENV.PUSHER_SECRET,
  cluster: ENV.PUSHER_CLUSTER,
  useTLS: true,
});
