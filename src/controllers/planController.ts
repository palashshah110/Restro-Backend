import { Request, Response, NextFunction } from 'express';
import { Plan } from '../models/Plan';
import { AppError } from '../utils/AppError';
import { getPaginationOptions, paginate } from '../utils/pagination';

export const createPlan = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, price, duration, features } = req.body;
    
    const plan = await Plan.create({ name, price, duration, features });

    res.status(201).json({
      success: true,
      data: plan
    });
  } catch (error) {
    next(error);
  }
};

export const getPlans = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const options = getPaginationOptions(req.query);
    const result = await paginate(Plan, {}, options);

    res.status(200).json({
      success: true,
      ...result
    });
  } catch (error) {
    next(error);
  }
};

export const getPlanById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const plan = await Plan.findById(req.params.id);
    
    if (!plan) {
      return next(new AppError('Plan not found', 404));
    }

    res.status(200).json({
      success: true,
      data: plan
    });
  } catch (error) {
    next(error);
  }
};

export const updatePlan = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, price, duration, features } = req.body;
    
    const plan = await Plan.findByIdAndUpdate(
      req.params.id,
      { name, price, duration, features },
      { new: true, runValidators: true }
    );

    if (!plan) {
      return next(new AppError('Plan not found', 404));
    }

    res.status(200).json({
      success: true,
      data: plan
    });
  } catch (error) {
    next(error);
  }
};

export const deletePlan = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const plan = await Plan.findByIdAndDelete(req.params.id);
    
    if (!plan) {
      return next(new AppError('Plan not found', 404));
    }

    res.status(200).json({
      success: true,
      message: 'Plan deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
