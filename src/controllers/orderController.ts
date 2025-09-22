import { Request, Response, NextFunction } from 'express';
import { Order } from '../models/Order';
import { Cafe } from '../models/Cafe';
import { Plan } from '../models/Plan';
import { AppError } from '../utils/AppError';
import { getPaginationOptions, paginate } from '../utils/pagination';
import { OrderFilters } from '../types';

export const createOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { cafeId, planId, amount } = req.body;

    // Verify cafe exists
    const cafe = await Cafe.findById(cafeId);
    if (!cafe) {
      return next(new AppError('Cafe not found', 404));
    }

    // Verify plan exists
    const plan = await Plan.findById(planId);
    if (!plan) {
      return next(new AppError('Plan not found', 404));
    }

    const order = await Order.create({
      cafeId,
      planId,
      amount: amount || plan.price
    });

    // Populate order with cafe and plan details
    await order.populate([
      { path: 'cafeId', select: 'name subdomain' },
      { path: 'planId', select: 'name price duration' }
    ]);

    res.status(201).json({
      success: true,
      data: order
    });
  } catch (error) {
    next(error);
  }
};

export const getOrders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const options = getPaginationOptions(req.query);
    const filters: OrderFilters = req.query;
    
    // Build filter object
    const filterObj: any = {};
    
    if (filters.status) {
      filterObj.status = filters.status;
    }
    
    if (filters.cafeId) {
      filterObj.cafeId = filters.cafeId;
    }
    
    if (filters.startDate || filters.endDate) {
      filterObj.purchaseDate = {};
      if (filters.startDate) {
        filterObj.purchaseDate.$gte = new Date(filters.startDate);
      }
      if (filters.endDate) {
        filterObj.purchaseDate.$lte = new Date(filters.endDate);
      }
    }

    const result = await paginate(
      Order, 
      filterObj, 
      options, 
      [
        { path: 'cafeId', select: 'name subdomain' },
        { path: 'planId', select: 'name price duration' }
      ]
    );

    res.status(200).json({
      success: true,
      ...result
    });
  } catch (error) {
    next(error);
  }
};

export const getOrderById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('cafeId', 'name subdomain')
      .populate('planId', 'name price duration');
    
    if (!order) {
      return next(new AppError('Order not found', 404));
    }

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    next(error);
  }
};

export const updateOrderStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status } = req.body;
    
    if (!['active', 'expired', 'pending'].includes(status)) {
      return next(new AppError('Invalid status value', 400));
    }
    
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    ).populate([
      { path: 'cafeId', select: 'name subdomain' },
      { path: 'planId', select: 'name price duration' }
    ]);

    if (!order) {
      return next(new AppError('Order not found', 404));
    }

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    next(error);
  }
};
