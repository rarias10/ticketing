import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { requireAuth, validateRequest } from '@awatickets/common';
import { Ticket } from '../models/ticket';
import { TicketCreatedPublisher } from '../events/publishers/ticket-created-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.post('/api/tickets', requireAuth as any, [
  body('title')
    .not()
    .isEmpty()
    .withMessage('Title is required'),
  body('price')
    .isFloat({ gt: 0 })
    .withMessage('Price must be greater than 0')
], validateRequest as any, async (req: Request, res: Response) => {
  const { title, price } = req.body;

  const ticket = Ticket.build({
    title,
    price,
    userId: req.currentUser!.id
  });
  await ticket.save();

  // Check if NATS is connected before publishing
  if (!natsWrapper.isConnected) {
    console.warn('NATS is not connected, skipping event publishing');
  } else {
    try {
      await new TicketCreatedPublisher(natsWrapper.client).publish({
        id: ticket.id,
        title: ticket.title,
        price: ticket.price,
        userId: ticket.userId,
        version: ticket.version
      });
    } catch (error) {
      console.error('Failed to publish ticket created event:', error);
      // Don't fail the request if event publishing fails
    }
  }

  res.status(201).send(ticket);
});

export { router as createTicketRouter };
