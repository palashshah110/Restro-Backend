import { Router } from 'express';
import {
  createCafe,
  getCafes,
  getCafeById,
  updateCafe,
  deleteCafe
} from '../controllers/cafeController';
import { dummyAuth } from '../middleware/auth';
import { validateCafe, validateUpdateCafe } from '../middleware/validation';

const router = Router();

router.use(dummyAuth);

router.route('/')
  .post(validateCafe, createCafe)
  .get(getCafes);

router.route('/:id')
  .get(getCafeById)
  .put(validateUpdateCafe, updateCafe)
  .delete(deleteCafe);

export default router;
