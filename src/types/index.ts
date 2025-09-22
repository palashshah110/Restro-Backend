import { Document } from 'mongoose';

export interface ICafe extends Document {
  name: string;
  subdomain: string;
  createdAt: Date;
  plan: Object;
}

export interface IPlan extends Document {
  name: string;
  price: number;
  duration: number;
  features: string[];
  createdAt: Date;
}

export interface IOrder extends Document {
  cafeId: string;
  planId: string;
  amount: number;
  purchaseDate: Date;
  status: 'active' | 'expired' | 'pending';
}

export interface IUser extends Document {
  email: string;
  password: string;
  role: 'admin';
  createdAt: Date;
  cafe?: string;
  comparePassword: (candidatePassword: string) => Promise<boolean>;
}

export interface PaginationQuery {
  page?: string;
  limit?: string;
}

export interface OrderFilters {
  status?: 'active' | 'expired' | 'pending';
  startDate?: string;
  endDate?: string;
  cafeId?: string;
}