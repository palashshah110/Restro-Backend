import { Router } from 'express';
import { getMenus, createMenu, updateMenu, deleteMenu } from '../controllers/menuController';
import uploadImage from '../utils/uploadImage';

const router = Router();

router.get('/', getMenus);
router.post('/', uploadImage("itemImage"), createMenu);
router.put('/:id',uploadImage("itemImage"), updateMenu);
router.delete('/:id', deleteMenu);

export default router;
