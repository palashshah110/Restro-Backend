import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config/env";
import { User } from "../models/User";
import { AppError } from "../utils/AppError";
import { getTenantConnection } from "../config/database";
import MenuSchema from "../models/privateModel/Menu";
import OrderSchema from "../models/privateModel/Orders";
import CategorySchema from "../models/privateModel/Category";

// Extend Request type
interface AuthRequest extends Request {
  user?: any;
  menu?: any;   // tenant model
  orders?: any; // tenant model
  category?: any; // tenant model
}

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    let token: string | undefined;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return next(new AppError("No token provided, authorization denied", 401));
    }

    const decoded = jwt.verify(token, config.JWT_SECRET) as any;

    // Get user from main DB
    const user:any = await User.findById(decoded.id).populate("cafe");
    if (!user) {
      return next(new AppError("User not found", 401));
    }
    req.user = user;
    if (!user.cafe || !user.cafe.subdomain) {
      return next(new AppError("User has no associated cafe/subdomain", 400));
    }

    // ----------------------
    // Switch to tenant DB using cafe.subDomain
    // ----------------------
    const tenantDb:any = getTenantConnection(user.cafe.subdomain);

    // ----------------------
    // Attach tenant models directly on req
    // ----------------------
    req.menu =
      tenantDb.model(
        "Menu",
        MenuSchema
      );
      req.category =
      tenantDb.model(
        "Category",
        CategorySchema
      );

    req.orders =
      tenantDb.model(
        "Orders",
        OrderSchema
      );

    next();
  } catch (error) {
    console.error("Authentication error:", error);
    return next(new AppError("Invalid token", 401));
  }
};
