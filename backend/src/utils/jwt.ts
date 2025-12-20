import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { userInterface } from "../types/user";

dotenv.config({ path: "./.env" });

const secret: any = process.env.secret;

export function createToken(payload: userInterface) {
  return jwt.sign(payload, secret, { expiresIn: "1h" });
}
