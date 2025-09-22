import mongoose, { Schema } from 'mongoose';
import { IOrder } from '../types';

const OrderSchema = new Schema<IOrder>({
  cafeId: {
    type: String,
    required: [true, 'Cafe ID is required'],
    ref: 'Cafe'
  },
  planId: {
    type: String,
    required: [true, 'Plan ID is required'],
    ref: 'Plan'
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: [0, 'Amount cannot be negative']
  },
  purchaseDate: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['active', 'expired', 'pending'],
    default: 'pending',
    required: true
  }
},{versionKey: false});

// Indexes
OrderSchema.index({ cafeId: 1 });
OrderSchema.index({ planId: 1 });
OrderSchema.index({ status: 1 });
OrderSchema.index({ purchaseDate: -1 });
OrderSchema.index({ cafeId: 1, status: 1 });

export const Order = mongoose.model<IOrder>('Order', OrderSchema);
