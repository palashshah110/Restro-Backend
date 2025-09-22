import { Request, Response, NextFunction } from 'express';
import { User } from '../models/User';
import { AppError } from '../utils/AppError';

export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await User.find({role:"admin"}).populate("cafe");
    res.status(200).json({
      success: true,
      data:users
    });
  } catch (error) {
    next(error);
  }
}

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, role, cafe } = req.body;
    const user = await User.create({
      email,
      password,
      role,
      cafe
    });
    res.status(201).json({
      success: true,
      user
    });
  } catch (error) {
    next(error);
  }
}
export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { email, password, role,cafe } = req.body;
    const user = await User.findByIdAndUpdate(id, {
      email,
      password,
      role,
      cafe
    }, {
      new: true,
      runValidators: true
    });
    if (!user) {
      return next(new AppError('User not found', 404));
    }
    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    next(error);
  }
}

export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return next(new AppError('User not found', 404));
    }
    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    next(error);
  }
}