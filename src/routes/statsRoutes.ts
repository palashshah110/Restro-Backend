import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { getStats, getCafeStats } from '../controllers/stats.controller';

const router = Router();

router.use(authenticate); 
router.route('/')
  .get(getStats);

router.get("/cafe", getCafeStats);

export default router;