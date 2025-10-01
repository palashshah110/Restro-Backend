import { Router } from 'express';
import {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus
} from '../controllers/orderController';
import { authenticate } from '../middleware/auth';
import { validateOrder, validateOrderStatus } from '../middleware/validation';

const router = Router();

router.use(authenticate); 

router.route('/')
  .post(validateOrder, createOrder)
  .get(getOrders);

router.route('/:id')
  .get(getOrderById)
  .put(validateOrderStatus, updateOrderStatus);

export default router;
