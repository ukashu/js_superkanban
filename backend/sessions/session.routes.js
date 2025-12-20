import { Router } from 'express';
import { login, register } from './session.controller.js';
import { body } from 'express-validator';

const router = Router();

router.post(
  '/register',
  body('email').isEmail(),
  body('password').isLength({ min: 5 }),
  body('username').isLength({ min: 3 }),
  register
);
router.post('/login', body('email').isEmail(), login);

export default router;
