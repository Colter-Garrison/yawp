const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const agent = request.agent(app);

const testUser = {
  firstName: 'Tiesto',
  lastName: 'Testerson',
  email: 'testemail@test.com',
  password: 'asdf',
};

describe('yawp POST, GET, and DELETE route tests', () => {
  beforeEach(() => {
    return setup(pool);
  });
  
  it('POST should create a new user', async () => {
    const resp = await request(app).post('/api/v1/users').send(testUser);
    const { firstName, lastName, email } = testUser;
    
    expect(resp.body).toEqual({
      id: expect.any(String),
      firstName,
      lastName,
      email,
    });
  });
  
  it('POST should sign in an existing user', async () => {
    await request(app).post('/api/v1/users').send(testUser);
    const resp = await request(app).post('/api/v1/users/sessions').send({ email: 'testemail@test.com', password: 'asdf' });
    expect(resp.status).toBe(200);
  });
  
  it('should return a 403 when signed in but not admin when listing all users', async () => {
    const agent = request.agent(app);
    await agent.post('/api/v1/users').send(testUser);
    await agent.post('/api/v1/users/sessions').send({ email: 'testemail@test.com', password: 'asdf' });
    const res = await agent.get('/api/v1/users');
    expect(res.body).toEqual({
      message: 'You do not have access to view this page',
      status: 403,
    });
  });

  it('GET should allow authenticated users to view a list of users', async () => {
    const adminUser = {
      firstName: 'Admin',
      lastName: 'Boss',
      email: 'admin',
      password: 'asdf',
    };
    await agent.post('/api/v1/users').send(adminUser);
    const res = await agent.get('/api/v1/users');
    await agent.post('/api/v1/users/sessions').send(adminUser);
    expect(res.status).toBe(200);
    expect(res.body[0]).toEqual({
      id: expect.any(String),
      firstName: expect.any(String),
      lastName: expect.any(String),
      email: expect.any(String),
    });
  });

  it('GET should show a list of restaurants', async () => {
    const res = await agent.get('/api/v1/restaurants');
    expect(res.body).toEqual(expect.arrayContaining([{
      id: expect.any(String),
      name: expect.any(String),
      cuisine: expect.any(String),
    }]));
  });

  it('GET should return a restaurant by id with reviews', async () => {
    const res = await request(app).get('/api/v1/restaurants/1');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      id: '1',
      name: 'Murphys',
      cuisine: 'Diner',
      reviews: expect.any(Array),
    });
  });

  it('POST should add a new review if user is signed in', async () => {
    const review = {
      stars: 5,
      detail: 'YUMMY',
    };
    await agent.post('/api/v1/users').send(testUser);
    const res = await agent.post('/api/v1/restaurants/1/reviews').send(review);
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      id: expect.any(String),
      restaurantId: '1',
      userId: expect.any(String),
      ...review,
    });
  });

  it('#DELETE should delete a review based on user id', async () => {
    const agent = request.agent(app);
    await agent.post('/api/v1/users').send({ ...testUser, email: 'admin' });

    const res = await agent.delete('/api/v1/reviews/1');
    expect(res.status).toBe(200);
  });
  
  afterAll(() => {
    pool.end();
  });
});
