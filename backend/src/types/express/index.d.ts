import { userInterface } from "../user";

declare global {
  namespace Express {
    interface Request {
      user?: userInterface;
    }
  }
}

export {};
