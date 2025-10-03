import { Order, OrderStatus } from '../../models/order';
import { Ticket } from '../../models/ticket';
import mongoose from 'mongoose';
import { app } from '../../app';
import request from 'supertest';
import { natsWrapper } from '../../nats-wrapper';

it('returns an error if the ticket doesn\'t exist', async () => {
  const ticketId = new mongoose.Types.ObjectId();

  const response = await request(app)
    .get(`/api/tickets/${ticketId}`)
    .set('Cookie', global.signin())
    .send({ ticketId });

  expect(response.status).toBe(404);
});


it('returns an error if the ticket is already reserved', async () => {
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'concert',   
    price: 20,
  });

  await ticket.save();  

  const order = Order.build({
    ticket,
    userId: 'alskdjflas',
    status: OrderStatus.Created,
    expiresAt: new Date(),
  });

  await order.save();   
  
  const response = await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin())
    .send({ ticketId: ticket.id });

  expect(response.status).toBe(400);
  expect(response.body.errors[0].message).toBe('Ticket is already reserved');
}
);

it('reserves a ticket', async () => {
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 20,
  });
  await ticket.save();

  const response = await request(app)
    .post('/api/orders')
    .set('Cookie', signin())
    .send({ ticketId: ticket.id });

  expect(response.status).toBe(201);
  expect(response.body.ticket.id).toBe(ticket.id);
  expect(response.body.status).toBe(OrderStatus.Created);
}
);  

it('emits an order created event', async () => {
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 20,
  });
  await ticket.save();
  const response = await request(app)
    .post('/api/orders')
    .set('Cookie', signin())
    .send({ ticketId: ticket.id });
  expect(response.status).toBe(201);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});  