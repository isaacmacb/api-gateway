import express from 'express';
import CartsController from './controllers/CartsController';

const router = express.Router();

router.get('/carts', CartsController.index);

export default router;
