import request from 'supertest';
import { app } from '../../app'
import { Ticket } from '../../models/ticket';
import mongoose from 'mongoose';
import { natsWrapper } from '../../nats-wrapper'; // Import natsWrapper
import { response } from 'express';

it('returns an error if one user tries to fetch another users order', async () => {
  // Create a ticket
  const ticket = Ticket.build({
    title: 'concert',
    price: 20,
    id: new mongoose.Types.ObjectId().toHexString()
  });
  await ticket.save();  

  const userOne = global.signin();
  const userTwo = global.signin();
  // Create one order as User #1
  const { body: order } = await request(app)
    .post('/api/orders')  
    .set('Cookie', userOne) 
    .send({
      ticketId: ticket.id
    })
    .expect(201); 

  // Make request to get the order as User #2 
  const userTwoResponse = await request(app)
    .get(`/api/orders/${order.id}`) 
    .set('Cookie', userTwo) 
    .expect(401); 


  // Make sure unauthorized access returns an error
  expect(userTwoResponse.status).toEqual(401);
});

it('fetches the order', async () => { 
  // Create a ticket
  const ticket = Ticket.build({
    title: 'concert', 
    price: 20,
    id: new mongoose.Types.ObjectId().toHexString()
  });
  await ticket.save();

  const user = global.signin();

  // Create one order as User #1
  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({
      ticketId: ticket.id
    })
    .expect(201); 

  // Make request to get the order as User #1
  const { body: fetchedOrder } = await request(app)
    .get(`/api/orders/${order.id}`) 
    .set('Cookie', user)
    .expect(200);   
  expect(fetchedOrder.id).toEqual(order.id);
});
  