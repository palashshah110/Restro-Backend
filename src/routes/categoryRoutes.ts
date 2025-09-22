import { Router } from 'express';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../controllers/categoryController';
import uploadImage from '../utils/uploadImage';

const router = Router();

router.get('/', getCategories);
router.post('/', uploadImage("image"), createCategory);
router.put('/:id',uploadImage("image"), updateCategory);
router.delete('/:id', deleteCategory);

export default router;
