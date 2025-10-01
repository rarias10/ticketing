import mongoose from 'mongoose';
import { Request, Response, Router } from 'express';
import { requireAuth, validateRequest } from '@awatickets/common';
import { body } from 'express-validator';
import { Order } from '../models/order';

const router = Router();

router.post('/api/orders', requireAuth, [
  body('ticketId')
    .not()
    .isEmpty()
    .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
    .withMessage('TicketId must be provided')
], validateRequest, async (req: Request, res: Response) => {
  const { ticketId } = req.body;

  const order = Order.build({
    userId: req.currentUser!.id,
    status: 'created',
    expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes from now
    ticket: {
      id: ticketId
    }
  });

  await order.save();

  res.send({});
});

export { router as newOrderRouter };
