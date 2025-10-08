import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../app';

declare global {
  var beforeAll: any;
  var beforeEach: any;
  var afterAll: any;
  function signin(): Promise<string[]>;
}

let mongo: MongoMemoryServer | undefined;

beforeAll(async () => {
  process.env.JWT_KEY = 'asdfasdf';
  // Speed up MongoDB Memory Server by using a specific version
  process.env.MONGOMS_VERSION = '6.0.6';
  process.env.MONGOMS_DOWNLOAD_MIRROR = 'https://fastdl.mongodb.org';
  
  try {
    // Increase timeout and set download dir to cache MongoDB binary
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

global.signin = async (): Promise<string[]> => {
  const email = 'test@test.com';
  const password = 'password';

  const response = await request(app)
    .post('/api/users/signup')
    .send({
      email,
      password
    })
    .expect(201);

  const cookie = response.get('Set-Cookie');
  return cookie || [];
};

