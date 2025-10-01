import { Router } from 'express';
import {
  createPlan,
  getPlans,
  getPlanById,
  updatePlan,
  deletePlan
} from '../controllers/planController';
import { authenticate } from '../middleware/auth';
import { validatePlan, validateUpdatePlan } from '../middleware/validation';

const router = Router();

router.use(authenticate); 

router.route('/')
  .post(validatePlan, createPlan)
  .get(getPlans);

router.route('/:id')
  .get(getPlanById)
  .put(validateUpdatePlan, updatePlan)
  .delete(deletePlan);

export default router;
