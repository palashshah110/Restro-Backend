import { Router } from 'express';
import { login, register } from '../controllers/authController';
import { validateLogin, validateRegister } from '../middleware/validation';

const router = Router();

router.post('/login', validateLogin, login);
router.post('/register', validateRegister, register);
export default router;
