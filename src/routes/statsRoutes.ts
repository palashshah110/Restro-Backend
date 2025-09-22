import { Router } from 'express';
import { dummyAuth } from '../middleware/auth';
import { getStats } from '../controllers/stats.controller';

const router = Router();

router.use(dummyAuth); 
router.route('/')
  .get(getStats);

export default router;