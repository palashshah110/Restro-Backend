import mongoose from 'mongoose';
import { config } from '../config/env';
import { Cafe } from '../models/Cafe';
import { Plan } from '../models/Plan';
import { Order } from '../models/Order';
import { logger } from '../middleware/logger';

const seedData = async () => {
  try {
    await mongoose.connect(config.MONGODB_URI);
    console.info('Connected to MongoDB for seeding');

    // Clear existing data
    await Promise.all([
      Cafe.deleteMany({}),
      Plan.deleteMany({}),
      Order.deleteMany({})
    ]);

    // Seed Cafes
    const cafes = await Cafe.create([
      { name: 'Brew & Bytes', subdomain: 'brewbytes' },
      { name: 'Code Café', subdomain: 'codecafe' },
      { name: 'Digital Drip', subdomain: 'digitaldrip' },
      { name: 'Tech Tea House', subdomain: 'techteahouse' },
      { name: 'Binary Bean', subdomain: 'binarybean' }
    ]);

    // Seed Plans
    const plans = await Plan.create([
      {
        name: 'Basic',
        price: 999,
        duration: 1,
        features: ['Basic POS System', '100 orders/month', 'Email support', 'Basic analytics']
      },
      {
        name: 'Premium',
        price: 2999,
        duration: 3,
        features: ['Advanced POS System', 'Unlimited orders', 'Priority support', 'Advanced analytics', 'Customer management']
      },
      {
        name: 'Enterprise',
        price: 9999,
        duration: 12,
        features: ['Custom POS System', 'Multi-location support', 'API access', 'Dedicated support', 'Custom integrations', 'White-label solution']
      }
    ]);

    // Seed Orders
    const orders = await Order.create([
      {
        cafeId: cafes[0]._id,
        planId: plans[1]._id,
        amount: plans[1].price,
        status: 'active',
        purchaseDate: new Date('2024-08-15')
      },
      {
        cafeId: cafes[1]._id,
        planId: plans[0]._id,
        amount: plans[0].price,
        status: 'active',
        purchaseDate: new Date('2024-08-20')
      },
      {
        cafeId: cafes[2]._id,
        planId: plans[2]._id,
        amount: plans[2].price,
        status: 'expired',
        purchaseDate: new Date('2024-07-10')
      },
      {
        cafeId: cafes[3]._id,
        planId: plans[1]._id,
        amount: plans[1].price,
        status: 'pending',
        purchaseDate: new Date('2024-09-01')
      },
      {
        cafeId: cafes[4]._id,
        planId: plans[0]._id,
        amount: plans[0].price,
        status: 'active',
        purchaseDate: new Date('2024-08-25')
      }
    ]);

    console.info(`Seeded ${cafes.length} cafes`);
    console.info(`Seeded ${plans.length} plans`);
    console.info(`Seeded ${orders.length} orders`);
    console.info('Database seeding completed successfully');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Run seeding if this file is executed directly
if (require.main === module) {
  seedData();
}

export default seedData;
