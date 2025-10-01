import {Request, Response, Router} from 'express';
import {requireAuth} from '@awatickets/common';
import {Order} from '../models/order';

const router = Router();

router.get('/api/orders', requireAuth, async (req: Request, res: Response) => {
  res.send({});
});

export {router as indexOrderRouter};
