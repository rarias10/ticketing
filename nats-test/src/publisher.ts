const nats = require('node-nats-streaming');
import { TicketCreatedPublisher } from './events/ticket-created-publisher';

console.clear();

const client = nats.connect('ticketing', 'publisher', {
  url: 'http://localhost:4222',
});

client.on('connect', async () => {
  console.log('Publisher connected to NATS');
  
  const publisher = new TicketCreatedPublisher(client);
  try {
    await publisher.publish({
      id: '123',
      title: 'concert',
      price: 25
    });
  } catch (err) {
    console.error(err);
  }

client.on('close', () => {
  console.log('NATS connection closed!');
  process.exit();
});
});

process.on('SIGINT', () => client.close());
process.on('SIGTERM', () => client.close());