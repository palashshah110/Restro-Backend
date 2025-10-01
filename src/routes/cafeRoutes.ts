import { Router } from 'express';
import {
  createCafe,
  getCafes,
  getCafeById,
  updateCafe,
  deleteCafe
} from '../controllers/cafeController';
import { authenticate } from '../middleware/auth';
import { validateCafe, validateUpdateCafe } from '../middleware/validation';
import uploadImage from '../utils/uploadImage';

const router = Router();

router.use(authenticate);

router.route('/')
  .post(validateCafe, createCafe)
  .get(getCafes);

router.route('/:id')
  .get(getCafeById)
  .put(uploadImage("coverImage"), updateCafe)
  .delete(deleteCafe);


export default router;
