import { Request, Response, NextFunction } from "express";
import { Category } from "../models/Category";
import { AppError } from "../utils/AppError";

// Get all categories
export const getCategories = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const categories = await Category.find();
    res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    next(error);
  }
};

// Create category
export const createCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, customImageUrl } = req.body;
    let image: string | null = null;

    if (customImageUrl) {
      image = customImageUrl;
    }
    if (req.file?.path) {
      image = req.file.path; // uploaded file
    }

    if (!image) {
      return next(new AppError("Category image is required", 400));
    }

    const category = await Category.create({
      name,
      image,
    });

    res.status(201).json({
      success: true,
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

// Update category
export const updateCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { name, customImageUrl } = req.body;

    let updateData: { name?: string; image?: string } = {};
    if (name) updateData.name = name;

    if (customImageUrl) {
      updateData.image = customImageUrl;
    }
    if (req.file?.path) {
      updateData.image = req.file.path;
    }

    const updatedCategory = await Category.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedCategory) {
      return next(new AppError("Category not found", 404));
    }

    res.status(200).json({
      success: true,
      data: updatedCategory,
    });
  } catch (error) {
    next(error);
  }
};

// Delete category
export const deleteCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const deletedCategory = await Category.findByIdAndDelete(id);

    if (!deletedCategory) {
      return next(new AppError("Category not found", 404));
    }

    res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
