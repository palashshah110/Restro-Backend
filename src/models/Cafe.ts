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
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  location:{
    type: String
  },
  phone:{
    type: String,
    trim: true,
    maxlength: [15, 'Phone number cannot exceed 15 characters']
  },
  wifiName:{
    type: String,
    trim: true,
    maxlength: [100, 'WiFi name cannot exceed 100 characters']
  },
  wifiPassword:{
    type: String,
    trim: true,
    maxlength: [100, 'WiFi password cannot exceed 100 characters']
  },
  coverImage:{
    type: String,
    trim: true,
    maxlength: [500, 'Cover image URL cannot exceed 100 characters']
  }
},{versionKey: false, timestamps: true});

// Indexes
CafeSchema.index({ subdomain: 1 });
CafeSchema.index({ createdAt: -1 });

export const Cafe = mongoose.model<ICafe>('Cafe', CafeSchema);
