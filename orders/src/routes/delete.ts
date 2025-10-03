import {Request, Response, Router} from 'express';
import {NotAuthorizedError, NotFoundError, requireAuth} from '@awatickets/common';
import {Order, OrderStatus} from '../models/order';
import { OrderCancelledPublisher } from '../events/publishers/order-cancelled-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = Router();

router.delete('/api/orders/:id', requireAuth as any, async (req: Request, res: Response) => {
  const { id } = req.params;

  const order = await Order.findById(id).populate('ticket');
  if (!order) {
    throw new NotFoundError();
  }
  if (order.userId !== req.currentUser!.id) {
    throw new NotAuthorizedError();
  }

  order.status = OrderStatus.Cancelled;

  await order.save();

  await new OrderCancelledPublisher(natsWrapper.client).publish({
    id: order.id,
    version: order.version,
    ticket: {
      id: order.ticket.id
    }
  });

  res.status(204).send();
});

export {router as deleteOrderRouter};
