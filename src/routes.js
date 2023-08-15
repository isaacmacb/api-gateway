import express from 'express';
import CartsController from './controllers/CartsController';

const router = express.Router();

router.get('/carts', CartsController.index);
router.post('/carts', CartsController.create);
router.put('/carts/:id', CartsController.update);
router.delete('/carts/:id', CartsController.destroy);



export default router;
