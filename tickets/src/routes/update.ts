import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { requireAuth, validateRequest, NotFoundError } from '@awatickets/common';
import { Ticket } from '../models/ticket';

const router = express.Router();

router.put('/api/tickets/:id', requireAuth as any, [
  body('title')
    .not()  
    .isEmpty()
    .withMessage('Title is required'),
  body('price')
    .isFloat({ gt: 0 })
    .withMessage('Price must be greater than 0')
], validateRequest as any, async (req: Request, res: Response) => {
  const ticket = await Ticket.findById(req.params.id);
  if (!ticket) {
    throw new NotFoundError();
  }
  if (ticket.userId !== req.currentUser!.id) {
   return res.status(401).send();
  }
  const { title, price } = req.body;
  ticket.set({
    title,  
    price
  });
  await ticket.save();
  res.send(ticket);
});

export { router as updateTicketRouter };

