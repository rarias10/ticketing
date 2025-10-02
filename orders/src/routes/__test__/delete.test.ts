import request from 'supertest';
import { app } from '../../app'
import { Order, OrderStatus } from '../../models/order';
import { natsWrapper } from '../../nats-wrapper'; 
import mongoose from 'mongoose';
import { Ticket } from '../../models/ticket';

it('marks an order as cancelled', async () => {
  // Create a ticket with Ticket model
  const ticket = Ticket.build({ 
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'concert', 
    price: 20 
  });
  await ticket.save();

  const user = global.signin();

  // Create an order with Order model 
  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(201); 

  // Make a request to cancel the order
  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set('Cookie', user)
    .send()
    .expect(204); 

    // 204 means no content

  // Expectation to make sure the thing is cancelled
  const updatedOrder = await Order.findById(order.id);
  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);


});

it('emits an order cancelled event', async () => {
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 20
  });
  await ticket.save();

  const user = global.signin();

  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(201);

  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set('Cookie', user)
    .send()
    .expect(204);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});