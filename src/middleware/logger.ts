import winston from "winston";
import { Request, Response, NextFunction } from "express";

const isProd = process.env.NODE_ENV === "production";

export const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: "super-admin-api" },
  transports: [
    // Always log to console (works on Vercel + local)
    new winston.transports.Console({
      format: isProd ? winston.format.json() : winston.format.simple(),
    }),

    // File logging only in local/dev
    ...(!isProd
      ? [
          new winston.transports.File({
            filename: "logs/error.log",
            level: "error",
          }),
          new winston.transports.File({
            filename: "logs/combined.log",
          }),
        ]
      : []),
  ],
});

export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;
    console.info(
      `${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms`
    );
  });

  next();
};
