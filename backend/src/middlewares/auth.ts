import { NextFunction, Request, Response } from "express";

import ObjectID from "bson-objectid";
import jwt from "jsonwebtoken";

export const check = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token =
    (req.cookies && req.cookies.token) ||
    (req.headers["authorization"]
      ? JSON.parse(req.headers["authorization"])["value"]
      : null);
  const secret: any = process.env.secret;

  try {
    const data: any = jwt.verify(token, secret);
    data["_doc"]._id = ObjectID(data["_doc"]._id);
    req.body.user = data["_doc"];
    req.body.userId = ObjectID(data._doc._id);

    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};
