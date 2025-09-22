import mongoose, { Schema } from 'mongoose';
import { IPlan } from '../types';

const PlanSchema = new Schema<IPlan>({
  name: {
    type: String,
    required: [true, 'Plan name is required'],
    trim: true,
    minlength: [2, 'Plan name must be at least 2 characters'],
    maxlength: [100, 'Plan name cannot exceed 100 characters']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  duration: {
    type: Number,
    required: [true, 'Duration is required'],
    min: [1, 'Duration must be at least 1 month'],
    max: [60, 'Duration cannot exceed 60 months']
  },
  features: [{
    type: String,
    trim: true,
    maxlength: [200, 'Feature description cannot exceed 200 characters']
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
},{versionKey: false});

// Indexes
PlanSchema.index({ price: 1 });
PlanSchema.index({ duration: 1 });
PlanSchema.index({ createdAt: -1 });

export const Plan = mongoose.model<IPlan>('Plan', PlanSchema);
