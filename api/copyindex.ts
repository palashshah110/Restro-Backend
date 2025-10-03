import express, { Request, Response } from "express";
import cors from "cors";
import { connectDatabase } from "../src/config/database";
import authRoutes from "../src/routes/authRoutes";
import cafeRoutes from "../src/routes/cafeRoutes";
import categoryRoutes from "../src/routes/categoryRoutes";
import menuRoutes from "../src/routes/menuRoutes";
import orderRoutes from "../src/routes/orderRoutes";
import planRoutes from "../src/routes/planRoutes";
import statsRoutes from "../src/routes/statsRoutes";
import userRoutes from "../src/routes/usersRoutes";
import { errorHandler } from "../src/middleware/errorHandler";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get("/", async (req: Request, res: Response) => {
  try {
    await connectDatabase();
    res.json({ success: true, message: "🚀 Backend running on Vercel" });
  } catch (error) {
    res.status(500).json({ success: false, error: "Database connection failed" });
  }
});

app.use("/api/auth", authRoutes);
app.use("/api/cafes", cafeRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/menus", menuRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/plans", planRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/users", userRoutes);

// Error handler (must be last)
app.use(errorHandler);

export default app;
