const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');

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
  
  afterAll(() => {
    pool.end();
  });
});
