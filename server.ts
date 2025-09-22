// server.ts
import app from "./src/app";
import { connectDatabase } from "./src/config/database";
import { logger } from "./src/middleware/logger";
import { config } from "./src/config/env";

const startServer = async () => {
  try {
    await connectDatabase();
    app.listen(config.PORT, () => {
      logger.info(`Server running on port ${config.PORT}`);
    });
  } catch (error) {
    logger.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
