import dotenv from "dotenv";
dotenv.config();

export const DMS_URL_POST = process.env.DMS_URL_POST ?? "";
export const DMS_GET_URL = process.env.DMS_GET_URL ?? "";

if (!DMS_URL_POST || !DMS_GET_URL) {
  throw new Error("Missing DMS URLs in .env");
}
