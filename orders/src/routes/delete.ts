import {Request, Response, Router} from 'express';
import {requireAuth} from '@awatickets/common';
import {Order} from '../models/order';

const router = Router();

router.delete('/api/orders/:id', requireAuth, async (req: Request, res: Response) => {
  const { id } = req.params;
  await Order.findByIdAndDelete(id);
  res.send({});
});

export {router as deleteOrderRouter};
