import { Request, Response, NextFunction } from "express";
import { Menu } from "../models/Menu";
import { AppError } from "../utils/AppError";

// Get all menus
export const getMenus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const menus = await Menu.find();
    res.status(200).json({
      success: true,
      data: menus,
    });
  } catch (error) {
    next(error);
  }
};

// Create menu
export const createMenu = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { itemURL, itemName } = req.body;
    let itemImage = null;
    if (itemURL) {
      itemImage = itemURL;
    }
    if (req.file?.path) {
      itemImage = req.file?.path;
    }

    if (!itemImage) {
      return next(new AppError("Item image is required", 400));
    }
    const menu = await Menu.create({
      itemImage,
      itemName,
    });

    res.status(201).json({
      success: true,
      data: menu,
    });
  } catch (error) {
    next(error);
  }
};

// Update menu
export const updateMenu = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const updatedMenu = await Menu.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedMenu) {
      return next(new AppError("Menu not found", 404));
    }

    res.status(200).json({
      success: true,
      data: updatedMenu,
    });
  } catch (error) {
    next(error);
  }
};

// Delete menu
export const deleteMenu = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const deletedMenu = await Menu.findByIdAndDelete(id);

    if (!deletedMenu) {
      return next(new AppError("Menu not found", 404));
    }

    res.status(200).json({
      success: true,
      message: "Menu deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
