import request from 'supertest';
import { app } from '../../app'
import { Ticket } from '../../models/ticket';
import mongoose from 'mongoose';

it('fetches the ticket', async () => {
  const ticket = Ticket.build({
    title: 'Concert',
    price: 20,
    userId: new mongoose.Types.ObjectId().toHexString()
  });
  await ticket.save();

  const response = await request(app)
    .get(`/api/tickets/${ticket.id}`)
    .set('Cookie', global.signin())
    .send();

  expect(response.status).toEqual(200);
  expect(response.body.title).toEqual(ticket.title);
  expect(response.body.price).toEqual(ticket.price);

  const ticketResponse = await request(app)
    .get(`/api/tickets/${ticket.id}`)
    .set('Cookie', global.signin())
    .send()
    .expect(200); 

  expect(ticketResponse.body.title).toEqual(ticket.title);
  expect(ticketResponse.body.price).toEqual(ticket.price);
  
});

it('returns a 404 if the ticket is not found', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  const response = await request(app)
    .get(`/api/tickets/${id}`)
    .set('Cookie', global.signin())
    .send();

  expect(response.status).toEqual(404);
});