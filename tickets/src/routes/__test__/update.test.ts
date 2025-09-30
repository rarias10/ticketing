import request from 'supertest';
import { app } from '../../app'
import { Ticket } from '../../models/ticket';
import mongoose from 'mongoose';

it('returns a 404 if the provided id does not exist', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie', global.signin())
    .send({
      title: 'Concert',
      price: 20
    })
    .expect(404);
});

it('returns a 401 if the user is not authenticated', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets/${id}`)
    .send({
      title: 'Concert',
      price: 20
    })
    .expect(401);
});

it('returns a 401 if the user does not own the ticket', async () => {
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title: 'Concert',
      price: 20
    });
  const ticket = await Ticket.findById(response.body.id);
  await request(app)
    .put(`/api/tickets/${ticket.id}`)
    .set('Cookie', global.signin())
    .send({
      title: 'Updated Concert',
      price: 30
    })
    .expect(401);
});

it('returns a 400 if the user provides an invalid title or price', async () => {
  const cookie = global.signin();
  const response = await request(app) 
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'Concert',
      price: 20
    });
    
  const ticket = await Ticket.findById(response.body.id);

  await request(app)  
    .put(`/api/tickets/${ticket.id}`)
    .set('Cookie', cookie)
    .send({
      title: '',
      price: 20
    })
    .expect(400); 

  await request(app)
    .put(`/api/tickets/${ticket.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'Valid Title', 
      price: -10
    })
    .expect(400);
});

it('updates the ticket provided valid inputs', async () => {
  const cookie = global.signin();
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'Concert',
      price: 20
    }); 

  const ticket = await Ticket.findById(response.body.id);

  await request(app)
    .put(`/api/tickets/${ticket.id}`)
    .set('Cookie', cookie)
    .send({ 

      title: 'Updated Concert', 
      price: 100  
    })  
    .expect(200);

  const ticketResponse = await request(app)
    .get(`/api/tickets/${ticket.id}`)
    .set('Cookie', global.signin())
    .send();
  expect(ticketResponse.body.title).toEqual('Updated Concert');
  expect(ticketResponse.body.price).toEqual(100);
}); 
