import mongoose, { Schema } from 'mongoose';
import { ICafe } from '../types';

const CafeSchema = new Schema<ICafe>({
  name: {
    type: String,
    required: [true, 'Cafe name is required'],
    trim: true,
    minlength: [2, 'Cafe name must be at least 2 characters'],
    maxlength: [100, 'Cafe name cannot exceed 100 characters']
  },
  subdomain: {
    type: String,
    required: [true, 'Subdomain is required'],
    unique: true,
    trim: true,
    lowercase: true,
  },
  plan: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Plan',
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
},{versionKey: false});

// Indexes
CafeSchema.index({ subdomain: 1 });
CafeSchema.index({ createdAt: -1 });

export const Cafe = mongoose.model<ICafe>('Cafe', CafeSchema);
