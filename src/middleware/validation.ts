import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { AppError } from '../utils/AppError';

const validateSchema = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body);
    
    if (error) {
      const message = error.details.map(detail => detail.message).join(', ');
      return next(new AppError(message, 400));
    }
    
    next();
  };
};

// Cafe validation schemas
const cafeSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required(),
  subdomain: Joi.string().trim().lowercase().pattern(/^[a-z0-9-]+$/).min(3).max(50).required(),
  plan: Joi.string().required()
});

const updateCafeSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).optional(),
  subdomain: Joi.string().trim().lowercase().pattern(/^[a-z0-9-]+$/).min(3).max(50).optional(),
  plan: Joi.string().optional()
});

// Plan validation schemas
const planSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required(),
  price: Joi.number().min(0).required(),
  duration: Joi.number().integer().min(1).max(60).required(),
  features: Joi.array().items(Joi.string().trim().max(200)).default([])
});

const updatePlanSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).optional(),
  price: Joi.number().min(0).optional(),
  duration: Joi.number().integer().min(1).max(60).optional(),
  features: Joi.array().items(Joi.string().trim().max(200)).optional()
});

// Order validation schemas
const orderSchema = Joi.object({
  cafeId: Joi.string().required(),
  planId: Joi.string().required(),
  amount: Joi.number().min(0).optional()
});

const orderStatusSchema = Joi.object({
  status: Joi.string().valid('active', 'expired', 'pending').required()
});

// Auth validation schemas
const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required()
});

const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required()
});

// Export validation middleware
export const validateCafe = validateSchema(cafeSchema);
export const validateUpdateCafe = validateSchema(updateCafeSchema);
export const validatePlan = validateSchema(planSchema);
export const validateUpdatePlan = validateSchema(updatePlanSchema);
export const validateOrder = validateSchema(orderSchema);
export const validateOrderStatus = validateSchema(orderStatusSchema);
export const validateLogin = validateSchema(loginSchema);
export const validateRegister = validateSchema(registerSchema);
