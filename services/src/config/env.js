import dotenv from "dotenv";
import { cleanEnv, port, str } from "envalid";

dotenv.config();

export default cleanEnv(process.env, {
  PORT: port({ default: 5000 }),
  JWT_SECRET: str({ default: "7313cc8651a398378f869faed4cb896c80e04ba4e4e6065e2c697385ab0d6fbc" }),
  MONGODB_URI: str({ default: "mongodb://127.0.0.1:27017/smartsanchar" }),
  CLOUDINARY_CLOUD_NAME: str({ default: "zvslkhdj" }),
  CLOUDINARY_API_KEY: str({ default: "995259544325756" }),
  CLOUDINARY_API_SECRET: str({ default: "pP6JXyTkMKt8mLVcdOLSvVg7Q2g" }),
});
