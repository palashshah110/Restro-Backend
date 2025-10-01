import { Request, Response, NextFunction } from 'express';
import { Cafe } from '../models/Cafe';
import { AppError } from '../utils/AppError';
import { getPaginationOptions, paginate } from '../utils/pagination';
import { getTenantConnection } from '../config/database';

export const createCafe = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, subdomain, plan } = req.body;

    // Check if subdomain already exists
    const existingCafe = await Cafe.findOne({ subdomain });
    if (existingCafe) {
      return next(new AppError('Subdomain already exists', 400));
    }

    const cafe = await Cafe.create({ name, subdomain, plan });

    // Create tenant database connection
    getTenantConnection(subdomain);

    res.status(201).json({
      success: true,
      data: cafe
    });
  } catch (error) {
    next(error);
  }
};

export const getCafes = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const options = getPaginationOptions(req.query);
    const result = await paginate(Cafe, {}, options, "plan");

    res.status(200).json({
      success: true,
      ...result
    });
  } catch (error) {
    next(error);
  }
};

export const getCafeById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cafe = await Cafe.findById(req.params.id);
    
    if (!cafe) {
      return next(new AppError('Cafe not found', 404));
    }

    res.status(200).json({
      success: true,
      data: cafe
    });
  } catch (error) {
    next(error);
  }
};

export const updateCafe = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, description, location, phone, wifiName, wifiPassword} = req.body;
    let coverImage = req.body.coverImage;
    if(req.file){
      coverImage = req.file.path;
    }
    const cafe = await Cafe.findByIdAndUpdate(
      req.params.id,
      { name, description, location, phone, wifiName, wifiPassword, coverImage },
      { new: true, runValidators: true }
    );

    if (!cafe) {
      return next(new AppError('Cafe not found', 404));
    }

    res.status(200).json({
      success: true,
      data: cafe
    });
  } catch (error) {
    next(error);
  }
};

export const deleteCafe = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cafe = await Cafe.findByIdAndDelete(req.params.id);
    
    if (!cafe) {
      return next(new AppError('Cafe not found', 404));
    }

    res.status(200).json({
      success: true,
      message: 'Cafe deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
