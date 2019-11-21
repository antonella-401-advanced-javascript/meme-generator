require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const User = require('../lib/models/User');
const Meme = require('../lib/models/Meme');

describe('app routes', () => {
  beforeAll(() => {
    connect();
  });

  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });

  afterAll(() => {
    return mongoose.connection.close();
  });

  it('can sign up a user', async() => {
    await User.create({ username: 'testy', password: 'test' });
    const res = await request(app)
      .post('/api/auth/signin')
      .send({ username: 'testy', password: 'test' });

    expect(res.body).toEqual({
      _id: expect.any(String),
      username: 'testy'
    });
  });

  it('can sign up a new user', () => {
    return request(app)
      .post('/api/auth/signup')
      .send({ username: 'new', password: 'test' })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          username: 'new'
        });
      });
  });

  it('gives error when user gives a bad password', async() => {
    await User.create({ username: 'testy', password: 'test' });
    const res = await request(app)
      .post('/api/auth/signin')
      .send({ username: 'testy', password: 'bad' });

    expect(res.body).toEqual({
      status: 401,
      message: 'Invalid username or password'
    });
  });

  it('gives error when user gives a bad username', async() => {
    await User.create({ username: 'testy', password: 'test' });
    const res = await request(app)
      .post('/api/auth/signin')
      .send({ username: 'bad', password: 'test' });

    expect(res.body).toEqual({
      status: 401,
      message: 'Invalid username or password'
    });
  });

  it('can verify a logged in user', async() => {
    const agent = request.agent(app);
    await User.create({ username: 'test', password: 'testy' });
    await agent
      .post('/api/auth/signin')
      .send({ username: 'test', password: 'testy' });

    return agent
      .get('/api/auth/verify')
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          username: 'test'
        });
      });
  });

  it('can post a new meme', async() => {
    await User.create({ username: 'testy', password: 'test' });
    await request(app)
      .post('/api/auth/signin')
      .send({ username: 'testy', password: 'test' });
    return request(app)
      .post('/api/meme')
      .send({ topText: 'testing meme', bottomText: 'is this working', url: 'https://i.imgflip.com/345v97.jpg' })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          __v: 0,
          topText: 'testing meme',
          bottomText: 'is this working',
          url: 'https://i.imgflip.com/345v97.jpg'
        });
      });
      
  });
});