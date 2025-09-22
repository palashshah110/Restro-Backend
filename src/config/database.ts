import mongoose, { Connection } from "mongoose";
import { config } from "./env";
import { logger } from "../middleware/logger";

interface CachedConnections {
  main?: typeof mongoose;
  tenants: { [key: string]: Connection };
}

// Use global cache so Vercel doesn’t reconnect on every request
const globalAny: any = global;
if (!globalAny.mongooseCache) {
  globalAny.mongooseCache = { main: undefined, tenants: {} } as CachedConnections;
}
const connectionCache: CachedConnections = globalAny.mongooseCache;

// ----------------------
// Main DB Connection
// ----------------------
export const connectDatabase = async (): Promise<void> => {
  if (connectionCache.main) {
    return; // ✅ already connected
  }

  try {
    const conn = await mongoose.connect(config.MONGODB_URI);
    connectionCache.main = conn;

    logger.info("✅ Connected to main MongoDB database");

    conn.connection.on("error", (error) => {
      logger.error("❌ MongoDB connection error:", error);
    });

    conn.connection.on("disconnected", () => {
      logger.warn("⚠️ MongoDB disconnected");
    });
  } catch (error) {
    logger.error("❌ Failed to connect to MongoDB:", error);
    throw error; // ❌ do NOT process.exit() on Vercel
  }
};

// ----------------------
// Tenant DB Connection
// ----------------------
export const getTenantConnection = (subdomain: string): Connection => {
  if (connectionCache.tenants[subdomain]) {
    return connectionCache.tenants[subdomain];
  }

  const tenantDbUri = config.MONGODB_URI.replace("/mainDB", `/${subdomain}`);
  const connection = mongoose.createConnection(tenantDbUri);

  connection.on("connected", () => {
    logger.info(`✅ Connected to tenant DB: ${subdomain}`);
  });

  connection.on("error", (error) => {
    logger.error(`❌ Tenant DB connection error for ${subdomain}:`, error);
  });

  connectionCache.tenants[subdomain] = connection;
  return connection;
};
