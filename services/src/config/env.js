import dotenv from "dotenv";
import { cleanEnv, port, str } from "envalid";

dotenv.config();

export default cleanEnv(process.env, {
  PORT: port(),
  JWT_SECRET: str(),

  MONGODB_URI: str(),

  CLOUDINARY_CLOUD_NAME: str(),
  CLOUDINARY_API_KEY: str(),
  CLOUDINARY_API_SECRET: str(),
});
