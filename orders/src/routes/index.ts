import {Request, Response, Router} from 'express';
import {requireAuth} from '@awatickets/common';
import {Order} from '../models/order';

const router = Router();

router.get('/api/orders', requireAuth as any, async (req: Request, res: Response) => {
  const orders = await Order.find({
    userId: req.currentUser!.id
  }).populate('ticket');

  res.send(orders);
});

export {router as indexOrderRouter};
