import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../app';
import jwt from 'jsonwebtoken';

declare global {
  function signin(id?: string): string[];
}

jest.mock('../nats-wrapper');

// Mock Stripe manually
jest.mock('../stripe', () => {
  // Keep track of created charges for testing
  let createdCharges: any[] = [];
  
  return {
    stripe: {
      charges: {
        create: jest.fn().mockImplementation((options: any) => {
          const charge = { 
            id: `ch_${Math.random().toString(36).substr(2, 9)}`,
            amount: options.amount,
            currency: options.currency,
            source: options.source,
            description: options.description
          };
          createdCharges.push(charge);
          return Promise.resolve(charge);
        }),
        list: jest.fn().mockImplementation((options: any) => {
          return Promise.resolve({
            data: createdCharges.slice(0, options.limit || 50)
          });
        })
      }
    }
  };
});

let mongo: MongoMemoryServer | undefined;

beforeAll(async () => {
  process.env.JWT_KEY = 'asdfasdf';
  process.env.STRIPE_SECRET_KEY = 'sk_test_mock_key';
  // Speed up MongoDB Memory Server by using a specific version
  process.env.MONGOMS_VERSION = '6.0.6';
  process.env.MONGOMS_DOWNLOAD_MIRROR = 'https://fastdl.mongodb.org';
  
  try {
    mongo = await MongoMemoryServer.create({
      binary: {
        downloadDir: './node_modules/.cache/mongodb-memory-server',
        version: '6.0.6',
      },
    });
    const mongoUri = mongo.getUri();
    
    await mongoose.connect(mongoUri);
  } catch (error) {
    console.error('Failed to start MongoDB Memory Server:', error);
    throw error;
  }
}, 60000); // 60 second timeout for beforeAll

beforeEach(async () => {
  jest.clearAllMocks();
  
  const collections = await mongoose.connection.db?.collections();
  if (collections) {
    for (let collection of collections) {
      await collection.deleteMany({});
    }
  }
});

afterAll(async () => {
  try {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
  } catch (error) {
    console.error('Error closing mongoose connection:', error);
  }
  
  try {
    if (mongo) {
      await mongo.stop();
    }
  } catch (error) {
    console.error('Error stopping MongoDB Memory Server:', error);
  }
}, 30000); // 30 second timeout for cleanup

global.signin = (id?: string): string[] => {
  // Build a JWT payload.  { id, email }
  const payload = {
    id: id || new mongoose.Types.ObjectId().toHexString(),
    email: 'test@test.com'
  };

  // Create a JWT
  const token = jwt.sign(payload, process.env.JWT_KEY!);

  // Build session object - this is what cookie-session expects
  const session = { jwt: token };

  // Turn that into JSON
  const sessionJSON = JSON.stringify(session);

  // Take JSON and encode it as base64
  const base64 = Buffer.from(sessionJSON).toString('base64');

  // Return a cookie with the encoded data
  return [`session=${base64}`];
};
