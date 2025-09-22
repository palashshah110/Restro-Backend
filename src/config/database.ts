import mongoose from 'mongoose';
import { config } from './env';
import { logger } from '../middleware/logger';

const connectionCache: { [key: string]: mongoose.Connection } = {};

export const connectDatabase = async (): Promise<void> => {
  try {
    const connection = await mongoose.connect(config.MONGODB_URI);
    logger.info('Connected to main MongoDB database');
    
    connection.connection.on('error', (error) => {
      logger.error('MongoDB connection error:', error);
    });

    connection.connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected');
    });

  } catch (error) {
    logger.error('Failed to connect to MongoDB:', error);
    process.exit(1);
  }
};

// Multi-tenant database connection
export const getTenantConnection = (subdomain: string): mongoose.Connection => {
  if (connectionCache[subdomain]) {
    return connectionCache[subdomain];
  }

  const tenantDbUri = config.MONGODB_URI.replace('/mainDB', `/${subdomain}`);
  const connection = mongoose.createConnection(tenantDbUri);
  
  connection.on('error', (error) => {
    logger.error(`Tenant DB connection error for ${subdomain}:`, error);
  });

  connectionCache[subdomain] = connection;
  return connection;
};